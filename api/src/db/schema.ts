import { pgTable, uuid, text, timestamp, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    password: varchar('password', { length: 300 }).notNull(),
    walletAddress: text('wallet_address'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const lawyers = pgTable('lawyers', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 5000 }).notNull().unique(),
    name: varchar('name', { length: 5000 }).notNull(),
    password: varchar('password', { length: 5000 }).notNull(),
    stateRollNumber: text('state_roll_number').notNull().unique(),
    specialization:text('specialization') ,
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

 
export const appointments = pgTable('appointments', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    reason: text('reason').notNull(), // reason/case for the appointment
    userEmail: varchar('user_email', { length: 255 }).references(() => users.email).notNull(),
    lawyerEmail: varchar('lawyer_email', { length: 255 }).references(() => lawyers.email).notNull(),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const lawyerRelations = relations(lawyers, ({ many }) => ({
    appointments: many(appointments)
}));

export const userRelations = relations(users, ({ many }) => ({
    appointments: many(appointments)
}));

export const appointmentRelations = relations(appointments, ({ one }) => ({
    lawyer: one(lawyers, {
        fields: [appointments.lawyerEmail],
        references: [lawyers.email],
    }),
    user: one(users, {
        fields: [appointments.userEmail],
        references: [users.email],
    }),
}));