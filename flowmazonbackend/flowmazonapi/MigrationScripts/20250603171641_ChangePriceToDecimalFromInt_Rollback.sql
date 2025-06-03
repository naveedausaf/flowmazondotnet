START TRANSACTION;


DO $EF$
BEGIN
    IF EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250603171641_ChangePriceToDecimalFromInt') THEN
    --Not gonna do this as this would be destrcutive to existing data:
    --ALTER TABLE "Products" ALTER COLUMN "Price" TYPE integer;
    --
    --Instead, do nothing, integer data can be stored in decimal columns.
    --Local development testing has verified that.
    --Will further test in Staging
    NULL; --this is a nnop in PQSQL
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20250603171641_ChangePriceToDecimalFromInt') THEN
    DELETE FROM "__EFMigrationsHistory"
    WHERE "MigrationId" = '20250603171641_ChangePriceToDecimalFromInt';
    END IF;
END $EF$;
COMMIT;