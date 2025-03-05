FROM quay.io/keycloak/keycloak:26.1.3 AS base
USER keycloak

ENV KC_REALM_FILENAME="default-realm.json"

WORKDIR /opt/keycloak
COPY ${KC_REALM_FILENAME} data/import/${KC_REALM_FILENAME}

FROM base AS debug
CMD ["start-dev", "--import-realm"]

FROM base AS dev
CMD ["start-dev", "--import-realm"]

FROM base AS stage
CMD ["start", "--import-realm"]

FROM base AS prod
CMD ["start", "--import-realm"]
