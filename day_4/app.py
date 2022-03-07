from flask import Flask, render_template, jsonify, request, abort
from os.path import join as join_paths
from os import getcwd as get_current_working_directory

ROUTE = ('web', 'modules')

BASE_PATH = get_current_working_directory()

APP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder =join_paths(BASE_PATH, 'static'),
)

DAY = 4

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


NOTIFICATIONS = {
    'daily': True,
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
            NOTIFICATIONS[key] = value
        else:
            del NOTIFICATIONS[key]
    
    return ('', 204)


APP.run()
