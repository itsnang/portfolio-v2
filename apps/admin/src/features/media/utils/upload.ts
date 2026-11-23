import cloudinary from "@/lib/cloudinary";

export async function uploadToCloudinaryFolder(
  fileUri: string,
  fileName: string,
  folderPath: string
): Promise<{ imageUrl: string; folder: string }> {
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: folderPath,
    invalidate: true,
    filename_override: fileName,
    use_filename: true,
  });
  return { imageUrl: result.secure_url, folder: result.folder || folderPath };
}
