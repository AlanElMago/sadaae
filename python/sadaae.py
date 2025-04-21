import os
import requests

from oauthlib.oauth2 import LegacyApplicationClient
from requests_oauthlib import OAuth2Session
from typing import Final

from utils import print_json_data, validate_response

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' # solo para desarrollo

API_AUTH_TEST_ENDPOINT: Final = "http://localhost:3000/api/test/auth/protected"
CLIENT_ID: Final = "sadaae-api"
CLIENT_SECRET: Final = "my-client-secret"
OPERATOR_USER_EMAIL: Final = "operator@example.com"
OPERATOR_USER_PASSWORD: Final = "operator1234%"
OIDC_TOKEN_URI: Final = \
    "http://localhost:8080/realms/sadaae/protocol/openid-connect/token"

def login(email: str, password: str) -> OAuth2Session:
    client = LegacyApplicationClient(client_id=CLIENT_ID)
    oauth = OAuth2Session(client=client)

    oauth.fetch_token(
        token_url=OIDC_TOKEN_URI,
        username=email,
        password=password,
        client_secret=CLIENT_SECRET)

    return oauth

if __name__ == "__main__":
    user_email = input("Email (operator@example.com): ")
    user_password = input("Password (operator1234%): ")

    user_email = user_email if user_email else OPERATOR_USER_EMAIL
    user_password = user_password if user_password else OPERATOR_USER_PASSWORD

    client = LegacyApplicationClient(client_id=CLIENT_ID)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(
        token_url=OIDC_TOKEN_URI,
        username=user_email,
        password=user_password,
        client_secret=CLIENT_SECRET)

    response = oauth.get(API_AUTH_TEST_ENDPOINT)
    json = validate_response(response, requests.codes.ok)

    print_json_data(json)
