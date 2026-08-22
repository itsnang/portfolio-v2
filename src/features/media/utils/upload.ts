import cloudinary from "@/lib/cloudinary";
import { env } from "@/utils/env";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

export const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        filename_override: fileName,
        folder: env.IMAGE_FOLDER,
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

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
