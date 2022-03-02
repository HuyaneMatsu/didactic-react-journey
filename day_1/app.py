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

DAY = 1

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
            'name': 'some name',
            'created_at': '2017.04.13-14:56:54',
        }
    )


APP.run()
