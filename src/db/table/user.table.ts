import { column, table } from "@/utils";
import { genId } from "@/utils/id";
import { text } from "drizzle-orm/pg-core";

export type TbUser = typeof TbUser;

export const TbUser = table("user", {
  id: text("id").notNull().primaryKey().$defaultFn(genId("user")),
  role: column.text("role").notNull(),
  email: column.text("email").notNull(),
  password: column.text("password").notNull(),
  salt: text("salt"),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});
