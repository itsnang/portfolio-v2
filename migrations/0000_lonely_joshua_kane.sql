-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "education" (
	"id" text PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"school" text NOT NULL,
	"degree" text NOT NULL,
	"logo_url" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer,
	"href" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" text PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "socials" (
	"id" text PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"href" text,
	"is_active" boolean DEFAULT true,
	"description" text NOT NULL,
	"technologies" json NOT NULL,
	"links" json,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"is_available" boolean,
	"name" text NOT NULL,
	"bio" text,
	"profile_url" text NOT NULL,
	"abouts" text NOT NULL,
	"about_images" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"user_id" integer,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/