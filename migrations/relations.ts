import { relations } from "drizzle-orm/relations";
import { profile, project, user, session } from "./schema";

export const projectRelations = relations(project, ({one}) => ({
	profile: one(profile, {
		fields: [project.profileId],
		references: [profile.id]
	}),
}));

export const profileRelations = relations(profile, ({many}) => ({
	projects: many(project),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
}));