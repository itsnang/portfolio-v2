ALTER TABLE "project" RENAME COLUMN "user_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "project" RENAME COLUMN "image" TO "thumbnail";--> statement-breakpoint
ALTER TABLE "education" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "socials" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "is_available" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "detail_image" json;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
