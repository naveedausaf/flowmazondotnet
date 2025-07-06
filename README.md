## Overview

## Architecture

UML Component diagram with description???

### API Gateway: CloudFlare API Shield

See my [dev.to post]() for a justification as to why I use this and not Azure API Management or other Azure products.

## Setup (after Cloning the Repo)

1. `cd` into working directory (`/`) and run `npm install`.
2. `cd` into folder `/flowmazonfrontend` and run `npm install`
3. In the same folder on the terminal (i.e. `/flowmazonfrontend`), run `npx playwright install`. This installs Playwright's browsers etc.
4. **Set up local PostgreSQL database:** This is used for local development and debugging whereas local continuous testing setup which uses Docker Compose creates its own, new database container separate from this every time `docker compose up` is run. Ensure that the local database is set up as follows:
   - Make sure PostgreSQL is installed on your machine.
   - Create a database named `FlowmazonDB` in your local PostgreSQL server.
   - Using pgAdmin, right-click the database you just created and select **Query tool** (or connect to the database using some other tool for executing queries such as `psql`)
   - execute the following script against FlowmazonDB database. This creates a database, and a user, and assigns privileges to this user on the database (we don't want to use the superadmin `postgres` user, hence why we are creating a dedicated user for the database with enough privileges for development):

     ```sql
     CREATE USER <pick a username> WITH PASSWORD '<pick a strong password>';
     ALTER DATABASE FlowmazonDB OWNER TO <username you picked>;
     ```

   - Navigating to folder `flowmazonbackend/flowmazonapi` on the terminal
   - Run command `dotnet user-secrets set ConnectionStrings:FlowmazonDB "Server=127.0.0.1;Port=5432;Database=FlowmazonDB;User Id=flowmazon_app_user;Password=<PASSWORD YOU CHOSE FOR flowmazon_app_user>;"`
   - Run `dotnet ef database update` to migrate the database to the current state of the EF Core model in `flowmazonapi` project.

5. **Create env file for Docker Compose:**
   - Duplicate `compose.env.template` as a file named `compose.env` (in the same folder, i.e. in solution root).
   - Pick a strong password and replace `<postgres user password>` in the new file with it.
   - Pick a strong password and replace **every occurrence** of `<app user password>` in the new file with it.
