import { column, table } from "@/utils";
import { TbUser } from "./user.table";

export type TbSession = typeof TbSession;

export const TbSession = table("session", {
  id: column.text("id").primaryKey(),

  userId: column
    .text("user_id")
    .notNull()
    .references(() => TbUser.id),

  expiresAt: column
    .timestamp("expires_at", { withTimezone: true, mode: "date" })
    .notNull(),
});
