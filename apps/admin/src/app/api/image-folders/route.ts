import { getCloudinaryFolders } from "@/lib/cloudinary";
import { unauthorizedWithoutSession } from "@/lib/auth/require-session-response";

export async function GET() {
  const unauthorized = await unauthorizedWithoutSession();
  if (unauthorized) return unauthorized;

  try {
    return Response.json(await getCloudinaryFolders());
  } catch (error) {
    console.error("Error fetching folders:", error);
    return Response.json({ error: "Failed to fetch folders" }, { status: 502 });
  }
}
