// Export user table first to ensure it's created before tables that reference it
export * from "./account.table";
export * from "./session.table";
export * from "./user.table";
export * from "./verification.table";

// Then export tables that reference the user table
export * from "./education.table";
export * from "./experiences.table";
export * from "./images.table";
export * from "./profile.table";
export * from "./project.table";
export * from "./recommendations.table";
export * from "./skills.table";
export * from "./socials.table";
