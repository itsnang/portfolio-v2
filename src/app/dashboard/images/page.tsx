"use client";

import { FolderSelector } from "@/components/folder-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getImages } from "./action";

interface Image {
  id: string;
  imageUrl: string;
  folder: string;
}

function Page() {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadImages = useCallback(async () => {
    try {
      setIsLoading(true);
      const imageList = await getImages(selectedFolder);
      setImages(imageList);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated, loadImages]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-6 mx-4 dark:text-white">
      <div className="p-4 flex justify-between items-center">
        <FolderSelector
          onFolderSelect={setSelectedFolder}
          selectedFolder={selectedFolder}
        />
        <Button asChild>
          <Link href="/dashboard/images/upload">Upload image</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No images found in this folder
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden group cursor-pointer relative"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square w-full">
                  <Image
                    src={image.imageUrl}
                    alt={`Image ${image.id}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-300 group-hover:scale-110 object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
