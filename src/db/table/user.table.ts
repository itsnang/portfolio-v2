import { column, table } from "@/utils";

export type TbUser = typeof TbUser;

export const TbUser = table("user", {
  id: column.id,
  name: column.text("name").notNull(),
  email: column.text("email").notNull().unique(),
  emailVerified: column.boolean("email_verified").default(false),
  image: column.text("image"),
  role: column.text("role").notNull().default("user"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
});
