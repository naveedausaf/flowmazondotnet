#!/bin/sh
set -e

# This scripts creates a user in 
# PostgreSQL container used in integration testing. 
# The user would have minimal permissions (no DDL permissions)
# and would be used by the API during integration testing.

# This script will be executed by the postgres container's 
# ENTRYPOINT command.
# It inherits environment variables set in the compose.yaml, such as:
# - APP_DB_USER
# - APP_DB_PASSWORD
# - POSTGRES_DB (database to connect to)
#
# It assumes the superuser is 'postgres'
#
# POSTGRES_DB would already have been created by the ENTRYPOINT
# script as teh default DB. 
# ENTRYPOINT command would then run  all initialization scripts (those
# in /docker-entrypoint-initdb.d/ directory in the container where
# this script would be made available as a Docker Volume by
# compose.yaml for integration testing) against this database


# Finally, note that there are two commands in the 
# SQL to create APP_DB_USER that give permissions
# on any future objects that get added to the DB.
# At the moment it's unnecessary as, if there is a migration,
# I re-create the database. But in the future this might be useful
# if I optimise the db container to just run any new migrations
# if the mgirations scripts folder changes.

echo "Initializing application user '${APP_DB_USER}'..."

# Use psql with a here-document.
# Shell variables like ${APP_DB_USER} will be expanded by the shell
# before psql processes the SQL commands.
# Identifiers (like usernames, database names) are double-quoted "${...}"
# Passwords (string literals) are single-quoted '${...}'
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
    \echo 'Creating application user ${APP_DB_USER}...'
    CREATE USER "${APP_DB_USER}" WITH PASSWORD '${APP_DB_PASSWORD}';

    \echo 'Granting connect to database ${POSTGRES_DB} for user ${APP_DB_USER}...'
    GRANT CONNECT ON DATABASE "${POSTGRES_DB}" TO "${APP_DB_USER}";

    \echo 'Granting usage on schema public for user ${APP_DB_USER}...'
    GRANT USAGE ON SCHEMA public TO "${APP_DB_USER}";

    \echo 'Granting DML permissions on existing tables in schema public for user ${APP_DB_USER}...'
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${APP_DB_USER}";

    \echo 'Granting DML permissions on future tables created by role ${POSTGRES_USER} in schema public for user ${APP_DB_USER}...'
    ALTER DEFAULT PRIVILEGES FOR ROLE "${POSTGRES_USER}" IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${APP_DB_USER}";

    \echo 'Granting usage and select permissions on existing sequences in schema public for user ${APP_DB_USER}...'
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${APP_DB_USER}";

    \echo 'Granting usage and select permissions on future sequences created by role ${POSTGRES_USER} in schema public for user ${APP_DB_USER}...'
    ALTER DEFAULT PRIVILEGES FOR ROLE "${POSTGRES_USER}" IN SCHEMA public
        GRANT USAGE, SELECT ON SEQUENCES TO "${APP_DB_USER}";

    \echo 'User ${APP_DB_USER} configured successfully for database ${POSTGRES_DB}.'
EOSQL

echo "Application user '${APP_DB_USER}' initialization complete."
