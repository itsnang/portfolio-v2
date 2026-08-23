import cloudinary from "@/lib/cloudinary";

export const uploadToCloudinaryFolder = async (
  fileUri: string,
  fileName: string,
  folderPath: string
): Promise<{ imageUrl: string; folder: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        folder: folderPath,
        invalidate: true,
        filename_override: fileName,
        use_filename: true,
      })
      .then((result) => {
        resolve({
          imageUrl: result.secure_url,
          folder: result.folder || folderPath,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
