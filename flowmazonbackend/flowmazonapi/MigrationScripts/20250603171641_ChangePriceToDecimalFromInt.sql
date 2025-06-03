START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250603171641_ChangePriceToDecimalFromInt') THEN
    ALTER TABLE "Products" ALTER COLUMN "Price" TYPE numeric;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250603171641_ChangePriceToDecimalFromInt') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20250603171641_ChangePriceToDecimalFromInt', '8.0.3');
    END IF;
END $EF$;
COMMIT;

