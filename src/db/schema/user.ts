import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userModel = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof userModel.$inferSelect;
export type NewUser = typeof userModel.$inferInsert;
