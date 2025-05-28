import { date, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  accountType: varchar("account_type", { length: 50 })
    .notNull()
    .$default(() => "free"),
  joinDate: date("join_date"),
  status: text("status"),
  biography: text("biography"),
  profileImageUrl: varchar("profile_image_url", { length: 1024 }),
});

export const userSocialLinksTable = pgTable("user_social_links", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  platformName: varchar("platform", { length: 50 }).notNull(),
  platformUrl: varchar("url", { length: 255 }).notNull(),
});
