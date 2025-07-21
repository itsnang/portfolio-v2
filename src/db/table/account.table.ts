import { column, table } from "@/utils";
import { TbUser } from "./user.table";

export const TbAccount = table("account", {
  id: column.id,
  userId: column
    .text("user_id")
    .notNull()
    .references(() => TbUser.id, { onDelete: "cascade" }),
  accountId: column.text("account_id").notNull(),
  providerId: column.text("provider_id").notNull(),
  accessToken: column.text("access_token"),
  refreshToken: column.text("refresh_token"),
  accessTokenExpiresAt: column.timestamp("access_token_expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  refreshTokenExpiresAt: column.timestamp("refresh_token_expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  scope: column.text("scope"),
  idToken: column.text("id_token"),
  password: column.text("password"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
});
