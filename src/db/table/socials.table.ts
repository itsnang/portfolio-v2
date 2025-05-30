import { table, column } from "@/utils";
import { relations } from "drizzle-orm";
import { TbProfile } from "./profile.table";
import { genId } from "@/utils/id";

export type TbSocials = typeof TbSocials;

export const TbSocials = table("socials", {
  id: column.id.$default(genId("socials")),
  userId: column.text("user_id"),
  isActive: column.boolean("is_active").default(true),
  name: column.text("name").notNull(),
  url: column.text("url").notNull(),
  icon: column.text("icon").notNull(),
  createdAt: column.createdAt,
  updatedAt: column.updatedAt,
  deletedAt: column.deletedAt,
});

export const SocialRelations = relations(TbSocials, ({ one }) => ({
  profiles: one(TbProfile, {
    fields: [TbSocials.userId],
    references: [TbProfile.id],
  }),
}));
