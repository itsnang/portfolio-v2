ALTER TABLE "profile" ADD COLUMN "skills" json DEFAULT '{}'::json;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "description" text;