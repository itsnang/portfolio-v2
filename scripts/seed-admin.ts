// scripts/seed-admin.ts
import { db } from "@/db/drizzle";
import { TbUser } from "@/db/table/user.table";
import { TbAccount } from "@/db/table/account.table";
import { TbProfile } from "@/db/table/profile.table";
import { genId } from "@/utils/id";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

// Get admin data from environment variables or use defaults
const getAdminData = () => {
  return {
    name: process.env.ADMIN_NAME || "Admin User",
    email: process.env.ADMIN_EMAIL || "admin@lornsamnang.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin" as const,
  };
};

// Admin server actions refuse any account without a profile.
async function ensureProfile(userId: string, name: string) {
  // getProfile() renders the first profile row on the public site, so a second
  // row could replace the real one. Only ever create the first.
  const [existing] = await db
    .select({ userId: TbProfile.userId })
    .from(TbProfile)
    .limit(1);

  if (existing) {
    if (existing.userId !== userId) {
      console.warn(
        "⚠️  A profile already exists for another user, so none was created."
      );
      console.warn(
        "   This account will be refused by admin actions until profile.user_id points to it."
      );
    }
    return;
  }

  await db.insert(TbProfile).values({
    id: genId("profile")(),
    userId,
    name,
    isAvailable: false,
    bio: "",
    imageUrl:
      process.env.ADMIN_PROFILE_IMAGE_URL ||
      "https://placehold.co/400x400.png",
    abouts: "",
    aboutImages: [],
  });
  console.log("✅ Placeholder profile created. Edit it in the dashboard.");
}

async function createInitialAdmin() {
  try {
    console.log("🔍 Checking if admin user exists...");

    const adminData = getAdminData();

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(TbUser)
      .where(eq(TbUser.email, adminData.email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("✅ Admin user already exists!");
      console.log(`Email: ${existingAdmin[0].email}`);
      console.log(`Role: ${existingAdmin[0].role}`);
      await ensureProfile(existingAdmin[0].id, existingAdmin[0].name);
      return;
    }

    console.log("🔐 Creating initial admin user...");
    console.log(`Name: ${adminData.name}`);
    console.log(`Email: ${adminData.email}`);

    // Must be Better Auth's own format, or sign-in fails with "Invalid password hash"
    const hashedPassword = await hashPassword(adminData.password);

    // Generate user ID
    const userId = genId("user")();

    // Create admin user record
    const newAdmin = await db
      .insert(TbUser)
      .values({
        id: userId,
        name: adminData.name,
        email: adminData.email,
        emailVerified: true, // Set as verified for admin
        role: adminData.role,
      })
      .returning();

    // Create account record with password
    await db.insert(TbAccount).values({
      id: genId("account")(),
      userId: userId,
      accountId: userId, // For credential accounts, accountId should equal userId
      providerId: "credential", // Provider ID for email/password authentication
      password: hashedPassword,
    });

    await ensureProfile(userId, adminData.name);

    console.log("✅ Initial admin user created successfully!");
    console.log("=".repeat(50));
    console.log(`👤 User ID: ${newAdmin[0].id}`);
    console.log(`👤 Name: ${newAdmin[0].name}`);
    console.log(`📧 Email: ${newAdmin[0].email}`);
    console.log(`🔐 Role: ${newAdmin[0].role}`);
    console.log(`🔐 Password: ${adminData.password}`);
    console.log("=".repeat(50));
    console.log("⚠️  IMPORTANT: Change your password after first login!");
    console.log("🌐 You can now sign in at: http://localhost:3000/sign-in");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
}

// Run the script
createInitialAdmin()
  .then(() => {
    console.log("🎉 Setup completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error);
    process.exit(1);
  });
