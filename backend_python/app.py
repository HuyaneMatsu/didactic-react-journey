from os import getcwd as get_current_working_directory
from os.path import join as join_paths

from hata import Client, DiscordException, datetime_to_timestamp
from flask import Flask, abort, jsonify, redirect, request

from auth_token import AuthToken
from constants import AUTHORIZATION_URL, CLIENT_ID, CLIENT_SECRET, FRONTEND_AUTHORIZATION_URL, FRONTEND_URL, TOKENS, \
    AUTHORIZED_USER_ID_TO_USER, NOTIFICATION_NAMES
from helpers import get_user, serialise_user, get_notification_settings_of, get_stats_of, set_notification_settings_of

# Setup oauth 2
CLIENT = Client('', client_id=CLIENT_ID, secret=CLIENT_SECRET)
LOOP = CLIENT.loop

# Setup Flask

BASE_PATH = get_current_working_directory()

APP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder = join_paths(BASE_PATH, 'static'),
)


@APP.route('/api/user/@me')
def user_me():
    user = get_user()
    return jsonify(serialise_user(user))


@APP.route('/api/stats')
def stats():
    user = get_user()
    return jsonify(get_stats_of(user.id))


@APP.route('/api/notification_settings', methods=['GET'])
def notification_settings_get():
    user = get_user()
    return jsonify(get_notification_settings_of(user.id))


@APP.route('/api/notification_settings', methods=['PATCH'])
def notification_settings_edit():
    user = get_user()
    
    data = request.json
    if not isinstance(data, dict):
        abort(400)
        return
    
    for key in data.keys():
        if key not in NOTIFICATION_NAMES:
            abort(400)
    
    for value in data.values():
        if not isinstance(value, bool):
            abort(400)
    
    notification_settings = get_notification_settings_of(user.id)
    
    for key, value in data.items():
        if value:
            try:
                del notification_settings[key]
            except KeyError:
                pass
        else:
            notification_settings[key] = False
    
    set_notification_settings_of(user.id, notification_settings)
    
    return ('', 204)


@APP.route('/api/auth', methods=['POST'])
def authenticate():
    data = request.json
    if not isinstance(data, dict):
        abort(400)
        return
    
    code = data.get('code', None)
    if (code is None) or (not isinstance(code, str)):
        abort(400)
        return
    
    try:
        access = LOOP.run(CLIENT.activate_authorization_code(FRONTEND_AUTHORIZATION_URL, code, 'identify'))
    except DiscordException as err:
        if err.status == 400:
            access = None
        
        else:
            raise
    
    if access is None:
        abort(400)
    
    user = LOOP.run(CLIENT.user_info_get(access))
    
    user_id = user.id
    auth_token = AuthToken.create_new(user_id)
    TOKENS[user_id] = auth_token
    AUTHORIZED_USER_ID_TO_USER[user_id] = user
    
    return jsonify({
        'token': str(auth_token),
        'user': serialise_user(user),
        'expires_at': datetime_to_timestamp(user.access.expires_at),
    })


@APP.route('/api/sell_daily', methods=['POST'])
def sell_daily():
    user = get_user()
    
    data = request.json
    if not isinstance(data, dict):
        abort(400)
        return
    
    amount = data.get('amount', None)
    if (amount is None):
        abort(400)
        return
    
    while True:
        if isinstance(amount, str):
            if amount.isdigit():
                real_amount = int(amount)
                break
        
        elif isinstance(amount, int):
            real_amount = amount
            break
        
        elif isinstance(amount, float):
            if amount.is_integer:
                real_amount = int(amount)
                break
        
        abort(400)
        return
    
    stats = get_stats_of(user.id)
    
    old_streak = stats['streak']
    new_streak = old_streak - real_amount
    
    if new_streak < 0:
        real_amount += new_streak
        new_streak = 0
    
    stats['total_love'] += 100 * real_amount
    stats['streak'] = new_streak
    
    return jsonify(stats)


@APP.route('/login')
def login():
    return redirect(AUTHORIZATION_URL)


@APP.after_request
def set_headers(response):
    response.headers['Access-Control-Allow-Origin'] = FRONTEND_URL
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Vary'] = 'Origin'
    return response


APP.run()
