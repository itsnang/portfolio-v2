CREATE TABLE IF NOT EXISTS "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"socials" json DEFAULT '{}'::json,
	"abouts" json DEFAULT '{}'::json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "todo" CASCADE;