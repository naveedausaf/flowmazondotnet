#!/bin/bash
set -e

echo "STARTIN MIGRATION SCRIPT!!!!!!!!!!"
#show a list of all databases in the server
psql -U "$POSTGRES_USER" -c "\l"

# Database already exists at this point because it was passed as value of POSTGRES_DB variable so the Postgres image already created it

# Wait for the database to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for database to be ready..."
  sleep 1
done

MIGRATIONS_DIR="/docker-entrypoint-initdb.d/migrations"

# First, verify all migration files have corresponding _Rollback.sql files
for f in "$MIGRATIONS_DIR"/*.sql; do
  filename=$(basename "$f")
  # Skip files ending with _Rollback.sql
  if [[ "$filename" == *_Rollback.sql ]]; then
    continue
  fi

  # Check for corresponding _Rollback file
  base="${filename%.sql}"
  rollback_file="$MIGRATIONS_DIR/${base}_Rollback.sql"
  if [[ ! -f "$rollback_file" ]]; then
    echo "ERROR: Rollback file not found for migration $filename. Expected: ${base}_Rollback.sql to be present in folder \"$MIGRATIONS_DIR\". You may have forgotten to generate the rollback script for this migration."
    exit 1
  fi
done

echo "about to strt iterating over migrations in order from earliest to latest"


# If all checks passed, apply the migrations in order
# iterating in alphabetical order. Because of the file naming
# this is also the temporal order from earliest to latest
for f in "$MIGRATIONS_DIR"/*.sql; do
  filename=$(basename "$f")
  # Skip files ending with _Rollback.sql
  if [[ "$filename" == *_Rollback.sql ]]; then
    continue
  fi

  echo "Applying migration $filename"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$f"
done

echo "FINISHED MIGRATION SCRIPT.........."