ALTER TABLE "profile" ALTER COLUMN "abouts" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "abouts" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "abouts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "experiences" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "aboutsImage" text NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "socials";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "skills";