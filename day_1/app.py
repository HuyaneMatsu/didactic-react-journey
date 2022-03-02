from flask import Flask, render_template
from os.path import join as join_paths
from os import getcwd as get_current_working_directory

ROUTE = ('web', 'modules')

BASE_PATH = get_current_working_directory()

WEBAPP = Flask(
    'learning_react',
    template_folder = join_paths(BASE_PATH, 'templates'),
    static_folder =join_paths(BASE_PATH, 'static'),
)

DAY = 1

@WEBAPP.route('/')
def index():
    return render_template(
        'index.html',
        day = DAY,
    )

WEBAPP.run()
