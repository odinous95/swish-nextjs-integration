import {
  integer,
  pgTable,
  varchar,
  date,
  text,
  timestamp,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar("first_name", { length: 100 }).notNull(),
  last_name: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  postal_code: varchar("postal_code", { length: 20 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),

  comment: text("comment"),
  door_code: varchar("door_code", { length: 20 }),
  floor: varchar("floor", { length: 10 }),
  extra_comment: text("extra_comment"),

  delivery_date: date("delivery_date").notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(),

  swish_id: varchar("swish_id", { length: 255 }),
  swish_url: text("swish_url"),
  qr_code_url: text("qr_code_url"),
  payment_status: varchar("payment_status", { length: 50 }),

  total_price: numeric("total_price").notNull(),
  discount: numeric("discount").default("0"),
  delivery_fee: numeric("delivery_fee").default("0"),
  discount_applied: boolean("discount_applied").default(false),
  campaign_code: varchar("campaign_code", { length: 100 }),

  terms_accepted: boolean("terms_accepted").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
