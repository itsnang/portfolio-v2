import { column, table } from "@/utils";

export const TbSession = table("session", {
  id: column.id,
  userId: column.text("user_id"),
  token: column.text("token").notNull(),
  expiresAt: column.timestamp("expires_at"),
  ipAddress: column.text("ip_address"),
  userAgent: column.text("user_agent"),

  createdAt: column.timestamp("created_at"),
  updatedAt: column.timestamp("updated_at"),
});
