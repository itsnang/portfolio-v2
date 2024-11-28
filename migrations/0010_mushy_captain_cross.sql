ALTER TABLE "profile" ADD PRIMARY KEY ("id");--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'experiences'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "experiences" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "id" DROP IDENTITY;