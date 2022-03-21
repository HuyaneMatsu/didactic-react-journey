from hata import datetime_to_timestamp
from flask import abort, request


from constants import TOKENS, AUTHORIZED_USER_ID_TO_USER
from auth_token import AuthToken


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
