ALTER TABLE "lawyers" ADD COLUMN "state_roll_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_state_roll_number_unique" UNIQUE("state_roll_number");