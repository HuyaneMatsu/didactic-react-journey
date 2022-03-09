from scarletio import get_event_loop, to_json
from scarletio.web_common import URL
from hata import Client, parse_oauth2_redirect_url, now_as_id, DiscordException, datetime_to_timestamp
import sys
from flask import Flask, render_template, jsonify, request, abort
from os.path import join as join_paths
from os import getcwd as get_current_working_directory, urandom
from dotenv import dotenv_values
from base64 import b64encode

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


AUTHORIZATION_TOKEN_TO_USER = {}


def serialise_user(user):
    return {
        'name': user.name,
        'id': user.id,
        'created_at': datetime_to_timestamp(user.created_at),
        'avatar_url': user.avatar_url_as(size=512),
    }

# Setup Flask

BASE_PATH = get_current_working_directory()

APP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder =join_paths(BASE_PATH, 'static'),
)

DAY = 6

@APP.route('/')
def index():
    return render_template(
        'index.html',
        day = DAY,
    )


@APP.route('/api/profile')
def profile():
    return jsonify(
        {
            'name': 'Alien watermelon',
            'created_at': '2011-10-10T14:48:00',
            'id': '155652112212323123',
            'avatar_url': '/static/default_avatar.png',
        }
    )


@APP.route('/api/credits')
def credits():
    return jsonify(
        {
            'credit': 55566556,
            'streak': 222,
        }
    )


# Default to True
NOTIFICATIONS = {
    'daily': False,
}

NOTIFICATION_NAMES = {'daily', 'proposal'}

@APP.route('/api/notification_settings', methods=['GET'])
def notification_settings_get():
    return NOTIFICATIONS

@APP.route('/api/notification_settings', methods=['PATCH'])
def notification_settings_edit():
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
    
    for key, value in data.items():
        if value:
            try:
                del NOTIFICATIONS[key]
            except KeyError:
                pass
        else:
            NOTIFICATIONS[key] = False
    
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
    )


APP.run()
