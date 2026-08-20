ALTER TABLE "appointments" DROP CONSTRAINT "appointments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_lawyer_id_lawyers_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "reason" text NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "user_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "lawyer_email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lawyer_email_lawyers_email_fk" FOREIGN KEY ("lawyer_email") REFERENCES "public"."lawyers"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "user_name";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP COLUMN "lawyer_id";