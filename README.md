## Running the app in Debug mode

Use VS Code compund launch configuartion **Frontend/Backend** to run in debug mode. Just select from launch configurations dropdown it in Debug sidebar window (Ctrl), then whenever yo upress F5, the configuration will launch.

Bear in mind that to stop debugging with this compound configuration, yuo will need to press Shift+F5 twice and not once.

## Configuration

For details of configuration key/value pairs that need to be provided to each service, and how to provide these - e.g. using config files in local development but environment variables at build and/or run of deployment or containers - see the READMEs of respective services ([frontend app](./flowmazonfrontend/README.md) and [backend api](./flowmazonbackend/flowmazonapi/README.md)).

You can also check out any Docker compose files (see [compose.yaml](./compose.yaml) for local continuous testing using Playwright tests) and TestContainers-based code (in [API Integration Tests](./flowmazonbackend/flowmazonapi.IntegrationTests/)) for some examples of how config values are provided to the services.

## Database Migrations

### Local workflow

Once you are ready to make a commit to the current feature branch in which database changes are involved, generate and test a migration as follows (On MS Docs, [this page](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli) on creating migrations and [this page](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying?tabs=dotnet-core-cli) on applying migrations might be helpful):

1. `cd` into `flowmazonbackend/flowmazonapi` folder (this is the API project that contains the domain model and DbContext)

2. `dotnet ef migrations add <name of last migration> <new migration name>`
   I would just use name of the feature branch as new migration's name.
   Name of last migration can be seen in `Migrations` folder (last file in the list).

3. `dotnet ef database update` updates the local development database.

4. Start the whole solution using **Frontend/Backend** launch configuration. Test the new database functionality.
   **If everything is fine up to this point,** continue below.

5. `dotnet ef migrations script <last migration name> <new migration name> --idempotent -o MigrationScripts/<filename of new migration>.sql`

   You can see file for the new migration you created above in `Migrations` folder. Just click it, press `F2`, then `Ctrl+C` to copy the filename without extension, then `Esc`. copyPaste it when typing command above, and tag on `.sql` at the end.

6. `dotnet ef migrations script <new migration name> <last migration name> --idempotent -o MigrationScripts/<filename of new migration>_Rollback.sql`

   This is much the same command as the previous one, you just swapped the names of the two migrations.

   **You just generated the rollback script**.

7. Check both the scripts in `MigrationScripts` folder that you just generated. Modify as needed.

   Rollback script requires especially careful inspection. Rollbacks are hairy and we need to ensure that **rollback script isn't destructive** i.e. if it is applied to the database to rollback the migration, **it wouldn't destroy any data**.

   Also, after you have applied the rollback script - and any preceding migrations's rollback scripts - to an existing database to roll it back to a state in which it worked with the **last known good release** of the microservice that owns the database, the database should work with that last known good version. The microservice in our case is `flowmazonapi`.

   **For example:** I generated a migration to change `Price` field's data type from `int` to `decimal`. The rollback script for this change looked like this:

   ```sql
    ALTER TABLE "Products" ALTER COLUMN "Price" TYPE integer;
   ```

   Changing an integer to decimal, even if somehow allowed to succeed, would be a destructive operation (it does succeed on my local PostgreSQL db which already had data wth decimal points in Price field; such values got rounded after I ran the above statement). In particular, any products added to production db between migration and rollback (rollback may happen in production way after the deployment and migration took place, e.g. when someone reports a problem with a recent release hours or days later) may have pennies in their prices which would get rounded or truncated.

   To prevent the above (snippet of) rollback script from destroying such data, I simply commented it out. Thus the rollback script doesn't actually do anything except modify `__EFMigrationsHistory` table in the database. I then tested that this database worked with the last known good version of `flowmazonapi`, which used `int` for `Price` but the code for that version still worked with the field being of type `decimal` in the database instead of `int`, as you would expect.

   **If:**

   - you cannot roll some or all of the database changes in the migration script back because it would destroy data Ilike I commented out the `ALTER` statement in the rollback script above
   - **and the last know good release of the owning microservice would NOT with the the database until the changes you chose not to rollback were actually reversed**

   Then **now is the time to decide** how you would release your change(s) to production while still retaining the ability to roll back the release if things went south after the release.

8. Commit and push your code (this would include the migration and rollback scripts you just generated/tweaked) to the feature branch.

9. Apply migration script to your local development db

10. Add some data to the db that exercises the schema/db changes just made by the migration. This should preferably be done using the owning microservice rather than directly in the database.

11. Apply rollback script to your local development db

12. Apply any previous rollback scripts (in reverse chronological order) that take you to the state of database taht would have been released with or used by the last know good release of the microservice.

13. Check out the last known good version of the microservice code locally, as well as current/lastknown good versions of any dependent microservices. For our _logical microservice_ this means checking out the whole `flowmazondotnet` repo at the last known good version.

14. Run all services using launch configuration so that you are running against the local dev database taht you just rolled back (**Frontend/Backend VS Code launch configuration** starts both services against the local dev database).

    Make sure functionality related to the changes you rolled back still works.

15. Copy all migration scripts up to `HEAD` of the feature into the `MigrationScripts` folder.

    Copy the last rollback script into `MigrationScripts` folder but rename it so it has a timestamp later than the last migration script and delete `_Rollback` from the end.

    I would do this by downloading them from GitHub.

16. Now run unit- and integration test suites of the (services included in) the logical microservice (i.e. unit- and integration tests of both `flowmazonfrontend` and `flowmazonbackend`) as well as integration tests involving the logical microservice as well as any dependent microservices (not applicable to this repo at the moment).
    Integration tests would migrate the database up to the latest migration, then apply the rollback script (which has ben named to look like the latest migration).

If you have come this far and all integration tests passed in step 16, then you can open a pull request from feature branch to `main` and proceed to merge if CI pipeline, UAT deployment PR review are ok.

## Test data generation

I moved to [Bogus](https://github.com/bchavez/Bogus) from [AutoFixture](https://github.com/AutoFixture/AutoFixture) because:

- AutoFixture is dated and no longer under active development. Releases are infrequent (last one was 7 months before the date of this writing). [Documenation](https://github.com/AutoFixture/AutoFixture?tab=readme-ov-file#documentation) was updated in 2021 and many of the links mentioned in it contain very old posts.
- AutoFixture is too basic. I was quite surprised to discover that despite how long it's been around, there [seems to be no out of the box way](https://autofixture.github.io/docs/quick-start/) of generating a number in a specified range. This makes it particular difficult to use with `Price` for example which is bounded by zero below and would almost have an upper limit also.

Bogus not only does not have the problems above, it allows you to generate (semi-)meaningful test data within specified constraints really easily, and the code you write to do so would be really easy to read:

```csharp
internal class ProductFaker : Faker<Product>
{
    public ProductFaker()
    {
        RuleFor(p => p.Id, f => f.Random.Int(1, int.MaxValue));

        RuleFor(p => p.Name, f => f.Commerce.ProductName());
        RuleFor(p => p.Description, f => f.Lorem.Paragraph());
        RuleFor(p => p.Price, f => f.Finance.Amount(0, 5000));

    }
}
```

What's really great is that GitHub Pilot generated (almot all of) this code for me whereas when I was wrestling with AutoFixture, it was quiet. This may be something to do with how much Bogus-based (and possibly Faker-based; Bogus is a port of Faker.js) test code there is out there that LLMs have been trained on.
