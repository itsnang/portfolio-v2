import { LOCAL_DATABASE_URL } from "./local-database-url";

const IMAGE = "https://placehold.co/600x400.png";
const ICON = "https://placehold.co/64x64.png";

async function main() {
  if (process.env.DATABASE_URL !== LOCAL_DATABASE_URL) {
    throw new Error("Fixtures only run against the local database. Use `pnpm db:reset`.");
  }

  // Imported here so the check above runs before a client connects.
  const { db } = await import("@/db/drizzle");
  const {
    TbAppConfig,
    TbBlogPost,
    TbEducation,
    TbExperiences,
    TbProfile,
    TbProject,
    TbRecommendations,
    TbSkills,
    TbSocials,
  } = await import("@/db/table");

  const [profile] = await db
    .update(TbProfile)
    .set({
      name: "Sample Developer",
      isAvailable: true,
      bio: "Made-up profile for local development.",
      imageUrl: IMAGE,
      abouts: "This is fixture content. None of it is real.",
      aboutImages: [IMAGE],
    })
    .returning();
  if (!profile) throw new Error("Seed the admin account before the fixtures.");

  await db.insert(TbAppConfig).values({ id: "config", theme: "wireframe" });

  await db.insert(TbSkills).values([
    { userId: profile.id, name: "TypeScript", logoUrl: ICON, category: "Frontend" },
    { userId: profile.id, name: "Postgres", logoUrl: ICON, category: "Database" },
  ]);

  await db.insert(TbExperiences).values([
    {
      userId: profile.id,
      company: "Example Labs",
      title: "Software Developer",
      imageUrl: ICON,
      description: "<p>Built imaginary products.</p>",
      startDate: new Date("2024-01-01"),
      sortOrder: 0,
    },
    {
      userId: profile.id,
      company: "Sample Studio",
      title: "Intern",
      imageUrl: ICON,
      description: "<p>Learned imaginary things.</p>",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-12-31"),
      sortOrder: 1,
    },
  ]);

  await db.insert(TbEducation).values({
    userId: profile.id,
    school: "University of Examples",
    degree: "Bachelor of Placeholder Science",
    logoUrl: ICON,
    startDate: new Date("2019-09-01"),
    endDate: new Date("2023-06-30"),
  });

  await db.insert(TbProject).values([
    {
      profileId: profile.id,
      title: "Fixture Project One",
      description: "<p>A made-up project.</p>",
      technologies: [{ name: "Next.js", logoUrl: ICON }],
      links: [{ type: "Website", href: "https://example.com" }],
      thumbnail: IMAGE,
      detailImage: [IMAGE],
      sortOrder: 0,
    },
    {
      profileId: profile.id,
      title: "Fixture Project Two",
      description: "<p>Another made-up project.</p>",
      technologies: [{ name: "Postgres", logoUrl: ICON }],
      thumbnail: IMAGE,
      sortOrder: 1,
    },
  ]);

  await db.insert(TbRecommendations).values({
    profileId: profile.id,
    name: "Example Colleague",
    position: "Team Lead at Example Labs",
    profileImageUrl: ICON,
    recommendationText: "A made-up recommendation.",
  });

  await db.insert(TbSocials).values([
    { userId: profile.id, name: "GitHub", url: "https://example.com/github", icon: ICON },
    { userId: profile.id, name: "LinkedIn", url: "https://example.com/linkedin", icon: ICON },
  ]);

  await db.insert(TbBlogPost).values([
    {
      profileId: profile.id,
      title: "A Published Fixture Post",
      slug: "published-fixture-post",
      excerpt: "Visible on the blog.",
      content: "<p>This published Post is fixture content.</p>",
      status: "published",
      publishedAt: new Date("2026-01-15"),
    },
    {
      profileId: profile.id,
      title: "A Draft Fixture Post",
      slug: "draft-fixture-post",
      excerpt: "Only visible in the dashboard.",
      content: "<p>This draft Post is fixture content.</p>",
      status: "draft",
    },
  ]);

  console.log("✅ Fixture content inserted.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
