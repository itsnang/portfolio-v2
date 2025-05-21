import cloudinary from "cloudinary";
import { env } from "@/utils/env";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  created_at: string;
  folder: string;
  [key: string]: unknown;
}

interface CloudinarySearchResponse {
  resources: CloudinaryResource[];
  [key: string]: unknown;
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;

export const getCloudinaryFolders = async (): Promise<CloudinaryFolder[]> => {
  try {
    const result = await cloudinary.v2.api.root_folders();
    return result.folders.map((folder: { name: string; path: string }) => ({
      name: folder.name,
      path: folder.path,
    }));
  } catch (error) {
    console.error("Error fetching folders from Cloudinary:", error);
    throw error;
  }
};

export const createCloudinaryFolder = async (
  folderName: string
): Promise<void> => {
  try {
    // Create a 1x1 transparent pixel PNG
    const placeholderImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    // Upload the placeholder image to create the folder
    await cloudinary.v2.uploader.upload(placeholderImage, {
      folder: folderName,
      public_id: ".placeholder",
      overwrite: true,
      invalidate: true,
    });

    // Delete the placeholder image immediately
    await cloudinary.v2.uploader.destroy(`${folderName}/.placeholder`);
  } catch (error) {
    console.error("Error creating folder in Cloudinary:", error);
    throw error;
  }
};

export const getCloudinaryImages = async (folderPath?: string) => {
  try {
    const expression = folderPath
      ? `folder:${folderPath}/*`
      : `folder:${env.IMAGE_FOLDER}/*`;

    const result = (await cloudinary.v2.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute()) as CloudinarySearchResponse;

    return result.resources.map((resource: CloudinaryResource) => ({
      id: resource.public_id,
      imageUrl: resource.secure_url,
      folder: resource.folder,
    }));
  } catch (error) {
    console.error("Error fetching images from Cloudinary:", error);
    throw error;
  }
};

export const uploadToCloudinaryFolder = async (
  fileUri: string,
  fileName: string,
  folderPath: string
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(fileUri, {
      folder: folderPath,
      invalidate: true,
      filename_override: fileName,
      use_filename: true,
    });

    return {
      id: result.public_id,
      imageUrl: result.secure_url,
      folder: result.folder,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary folder:", error);
    throw error;
  }
};
