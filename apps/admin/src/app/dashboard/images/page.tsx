"use client";

import { FolderSelector } from "@/features/media/components/folder-selector";
import { Button } from "@portfolio/ui/button";
import { UploadIcon } from "lucide-react";
import { ListHeader } from "@/components/content-list";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useImages } from "@/features/media/hooks/use-images";

function Page() {
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const {
    data: images = [],
    isLoading,
    isError,
  } = useImages(selectedFolder);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load images");
    }
  }, [isError]);

  return (
    <div>
      <ListHeader
        title="Images"
        description="Your Cloudinary library. Every image picker in the forms reads from here."
        count={isLoading ? undefined : images.length}
      >
        <FolderSelector onFolderSelect={setSelectedFolder} selectedFolder={selectedFolder} />
        <Button size="sm" asChild>
          <Link href="/dashboard/images/upload">
            <UploadIcon className="size-4" />
            Upload
          </Link>
        </Button>
      </ListHeader>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-6 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-sm text-muted-foreground">
          No images in this folder.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 border-t border-border pt-6 md:grid-cols-4">
          {images.map((image) => (
            <li key={image.id} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
              <Image
                src={image.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;
