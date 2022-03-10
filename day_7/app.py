import sys
from base64 import b64encode
from datetime import timedelta
from os import getcwd as get_current_working_directory, urandom
from os.path import join as join_paths

from dotenv import dotenv_values
from hata import Client, DiscordException, datetime_to_timestamp, now_as_id, parse_oauth2_redirect_url
from flask import Flask, abort, jsonify, redirect, render_template, request
from scarletio import to_json
from scarletio.web_common import URL


# Setup oath 2
CONFIG = dotenv_values('.env')

try:
    CLIENT_ID = CONFIG['CLIENT_ID']
    CLIENT_SECRET = CONFIG['CLIENT_SECRET']
except KeyError:
    sys.stderr.write('Required environmental variables: CLIENT_ID, CLIENT_SECRET.\n')
    raise SystemExit(1) from None


AUTHORIZATION_URL = str(
    URL(
        'https://discordapp.com/oauth2/authorize',
    ).extend_query(
        {
            'client_id': CLIENT_ID,
            'redirect_uri': 'http://127.0.0.1:5000/api/auth',
            'response_type': 'code',
            'scope': 'identify',
        },
    )
)

CLIENT = Client('', client_id=CLIENT_ID, secret=CLIENT_SECRET)

LOOP = CLIENT.loop


def create_authorization_token(user_id):
    user_id_key = b64encode(str(user_id).encode()).decode()
    current_time_key = b64encode(str(now_as_id()).encode()).decode()
    token_key = b64encode(urandom(32)).decode()
    return f'{user_id_key}.{current_time_key}.{token_key}'


def get_access_expires_at(user):
    access = user.access
    return access.created_at + timedelta(seconds=access.expires_in)


AUTHORIZATION_TOKEN_TO_USER = {}


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

DAY = 7

@APP.route('/')
def index():
    return render_template(
        'index.html',
        day = DAY,
    )


def get_user():
    try:
        token = request.headers['Authorization']
    except KeyError:
        abort(401)
        return
    
    try:
        user = AUTHORIZATION_TOKEN_TO_USER[token]
    except KeyError:
        abort(401)
        return
    
    return user


@APP.route('/api/profile')
def profile():
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


@APP.route('/api/auth')
def authenticate():
    result = parse_oauth2_redirect_url(request.url)
    if result is None:
        abort(400)
    
    try:
        access = LOOP.run(CLIENT.activate_authorization_code(*result, 'identify'))
    except DiscordException as err:
        if err.status == 400:
            access = None
        
        else:
            raise
    
    if access is None:
        abort(400)
    
    user = LOOP.run(CLIENT.user_info_get(access))
    
    token = create_authorization_token(user.id)
    
    AUTHORIZATION_TOKEN_TO_USER[token] = user
    
    return render_template(
        'authorized.html',
        token = token,
        user = to_json(serialise_user(user)),
        expires_at = datetime_to_timestamp(get_access_expires_at(user)),
    )


@APP.route('/login')
def login():
    return redirect(AUTHORIZATION_URL)


APP.run()
