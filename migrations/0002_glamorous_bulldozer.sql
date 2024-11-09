CREATE TABLE IF NOT EXISTS "experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"imageUrl" text,
	"description" json DEFAULT '{}'::json,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "imageUrl" text NOT NULL;