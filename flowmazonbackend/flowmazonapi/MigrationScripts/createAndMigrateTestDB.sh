#!/bin/bash
set -e

#show a list of all databases in the server
psql -U "$POSTGRES_USER" -c "\l"

# Database already exists at this point because it was passed as value of POSTGRES_DB variable so the Postgres image already created it

# Wait for the database to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for database to be ready..."
  sleep 1
done

MIGRATIONS_DIR="/docker-entrypoint-initdb.d/migrations"

echo "about to strt iterating over migrations in order from earliest to latest"


# If all checks passed, apply the migrations in order
# iterating in alphabetical order. Because of the file naming
# this is also the temporal order from earliest to latest
for f in "$MIGRATIONS_DIR"/*.sql; do
  filename=$(basename "$f")

  echo "Applying migration $filename"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done

echo "FINISHED MIGRATION SCRIPT.........."