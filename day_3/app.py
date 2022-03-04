from flask import Flask, render_template, jsonify
from os.path import join as join_paths
from os import getcwd as get_current_working_directory

ROUTE = ('web', 'modules')

BASE_PATH = get_current_working_directory()

APP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder =join_paths(BASE_PATH, 'static'),
)

DAY = 3

@APP.route('/')
def index():
    return render_template(
        'index.html',
        day = DAY,
    )


@APP.route('/api/stats')
def stats():
    return jsonify(
        {
            'name': 'Alien watermelon',
            'created_at': '2011-10-10T14:48:00',
            'id': '155652112212323123',
            'avatar_url': '/static/default_avatar.png',
        }
    )


@APP.route('/api/credit')
def credit():
    return jsonify(
        {
            'credit': 55566556,
            'streak': 222,
        }
    )


APP.run()
