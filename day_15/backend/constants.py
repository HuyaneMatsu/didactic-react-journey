import sys

from dotenv import dotenv_values
from scarletio.web_common import URL
from scarletio import MultiValueDictionary


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

AUTHORIZED_USER_ID_TO_USER = {}

TOKENS = MultiValueDictionary()
