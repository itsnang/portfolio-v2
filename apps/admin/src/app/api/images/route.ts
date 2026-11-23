import { getCloudinaryImages } from "@/lib/cloudinary";
import { unauthorizedWithoutSession } from "@/lib/auth/require-session-response";

// A plain GET, not a Server Action: Server Actions run one at a time, so
// listing images would otherwise queue behind uploads.
export async function GET(request: Request) {
  const unauthorized = await unauthorizedWithoutSession();
  if (unauthorized) return unauthorized;

  const folder = new URL(request.url).searchParams.get("folder") || undefined;
  try {
    return Response.json(await getCloudinaryImages(folder));
  } catch (error) {
    console.error("Error fetching images:", error);
    return Response.json({ error: "Failed to fetch images" }, { status: 502 });
  }
}
