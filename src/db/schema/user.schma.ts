import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TbUser } from "../table/user.table";
import { z } from "zod";

export const userSchema = createSelectSchema(TbUser);

export const userInsertSchema = createInsertSchema(TbUser, {
  email: z.string().email({ message: "Please input email" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;

export const userLoginsSchema = userInsertSchema.pick({
  email: true,
  password: true,
});

export type UserLogins = z.infer<typeof userLoginsSchema>;
