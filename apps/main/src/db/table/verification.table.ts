import { column, table } from "@/utils";

export const TbVerificationToken = table("verification", {
  id: column.id,
  identifier: column.text("identifier").notNull(),
  value: column.text("value").notNull(),
  expiresAt: column
    .timestamp("expiresAt", { withTimezone: true, mode: "date" })
    .notNull(),
  createdAt: column
    .timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: column
    .timestamp("updatedAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
