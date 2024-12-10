import { pgTable, text, boolean, timestamp, integer, foreignKey, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const education = pgTable("education", {
	id: text().primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	school: text().notNull(),
	degree: text().notNull(),
	logoUrl: text("logo_url").notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
	href: text(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	role: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	salt: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}),
	}
});

export const images = pgTable("images", {
	id: text().primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const experiences = pgTable("experiences", {
	id: text().primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	company: text().notNull(),
	title: text().notNull(),
	imageUrl: text("image_url").notNull(),
	description: text(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
});

export const socials = pgTable("socials", {
	id: text().primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	name: text().notNull(),
	url: text().notNull(),
	icon: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
});

export const project = pgTable("project", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	href: text(),
	isActive: boolean("is_active").default(true),
	description: text().notNull(),
	technologies: json().notNull(),
	links: json(),
	image: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
});

export const profile = pgTable("profile", {
	id: text().primaryKey().notNull(),
	isAvailable: boolean("is_available"),
	name: text().notNull(),
	bio: text(),
	profileUrl: text("profile_url").notNull(),
	abouts: text().notNull(),
	aboutImages: json("about_images"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const skills = pgTable("skills", {
	id: text().primaryKey().notNull(),
	isActive: boolean("is_active").default(true),
	userId: integer("user_id"),
	name: text().notNull(),
	logoUrl: text("logo_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});
