import sys
from os import getcwd as get_current_working_directory
from os.path import join as join_paths

from dotenv import dotenv_values
from hata import Client, DiscordException, datetime_to_timestamp
from flask import Flask, abort, jsonify, redirect, request
from scarletio import MultiValueDictionary
from scarletio.web_common import URL

from auth_token import AuthToken


# Setup oauth 2
CONFIG = dotenv_values('.env')

try:
    CLIENT_ID = CONFIG['CLIENT_ID']
    CLIENT_SECRET = CONFIG['CLIENT_SECRET']
except KeyError:
    sys.stderr.write('Required environmental variables: CLIENT_ID, CLIENT_SECRET.\n')
    raise SystemExit(1) from None

FRONTEND_URL = 'http://127.0.0.1:3000'

FRONTEND_AUTHORIZATION_URL = FRONTEND_URL + '/auth'

AUTHORIZATION_URL = str(
    URL(
        'https://discordapp.com/oauth2/authorize',
    ).extend_query(
        {
            'client_id': CLIENT_ID,
            'redirect_uri': FRONTEND_AUTHORIZATION_URL,
            'response_type': 'code',
            'scope': 'identify',
        },
    )
)

CLIENT = Client('', client_id=CLIENT_ID, secret=CLIENT_SECRET)

LOOP = CLIENT.loop

AUTHORIZED_USER_ID_TO_USER = {}
TOKENS = MultiValueDictionary()

def serialise_user(user):
    return {
        'name': user.name,
        'id': str(user.id),
        'created_at': datetime_to_timestamp(user.created_at),
        'avatar_hash': str(user.avatar_hash),
        'avatar_type': user.avatar_type.value,
        'discriminator': user.discriminator,
    }


NOTIFICATION_SETTINGS = {
    # Some default value
    184734189386465281: {
        'daily': False,
    }
}

def get_notification_settings_of(user_id):
    try:
        notification_settings = NOTIFICATION_SETTINGS[user_id]
    except KeyError:
        notification_settings = {}
    
    return notification_settings


def set_notification_settings_of(user_id, notification_settings):
    NOTIFICATION_SETTINGS[user_id] = notification_settings

STATS = {
    # Some default value
    184734189386465281: {
        'total_love': 55566556,
        'streak': 222,
    }
}

def get_stats_of(user_id):
    try:
        stats = STATS[user_id]
    except KeyError:
        stats = {
            'total_love': 0,
            'streak': 0,
        }
    
    return stats

# Setup Flask

BASE_PATH = get_current_working_directory()

APP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder =join_paths(BASE_PATH, 'static'),
)

DAY = 11
FRONTEND_BASE_URL = 'http://127.0.0.1:3000/'

def get_user():
    try:
        token = request.headers['Authorization']
    except KeyError:
        abort(401)
        return
    
    auth_token = AuthToken.from_string(token)
    if auth_token is None:
        abort(401)
        return
    
    if (auth_token.user_id, auth_token) not in TOKENS.items():
        abort(401)
        return
    
    try:
        user = AUTHORIZED_USER_ID_TO_USER[auth_token.user_id]
    except KeyError:
        abort(401)
        return
    
    return user


@APP.route('/api/user/@me')
def user_me():
    user = get_user()
    return jsonify(serialise_user(user))


@APP.route('/api/stats')
def stats():
    user = get_user()
    return jsonify(get_stats_of(user.id))


NOTIFICATION_NAMES = {'daily', 'proposal'}

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
