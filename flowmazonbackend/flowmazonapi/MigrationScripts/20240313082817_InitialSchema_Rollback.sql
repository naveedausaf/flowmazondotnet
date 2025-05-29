START TRANSACTION;

--commenting out as it is desctructive change
--DROP TABLE "Products";

DELETE FROM "__EFMigrationsHistory"
WHERE "MigrationId" = '20240313082817_InitialSchema';

COMMIT;

