CREATE TABLE IF NOT EXISTS "profile" (
	"id" integer PRIMARY KEY NOT NULL,
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
CREATE TABLE IF NOT EXISTS "experiences" (
	"id" integer PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"company" text NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" integer PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"user_id" integer,
	"name" text NOT NULL,
	"logo_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "socials" (
	"id" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "education" (
	"id" integer PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"school" text NOT NULL,
	"degree" text NOT NULL,
	"logo_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" integer PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT true,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" integer NOT NULL,
	"title" text NOT NULL,
	"href" text,
	"is_active" boolean DEFAULT true,
	"description" text,
	"technologies" json,
	"links" json,
	"image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
