import React from "react";
import { getImages } from "./action";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function Page() {
  const images = await getImages();
  console.log(images);
  return (
    <div className="mt-6 mx-4 dark:text-white">
      <div className="p-4 flex justify-end">
        <Button asChild>
          <Link href="/dashboard/images/upload">Upload image</Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card
            key={index}
            className="overflow-hidden group cursor-pointer relative"
          >
            <CardContent className="p-0">
              <div className="relative aspect-square w-full">
                <Image
                  src={image.imageUrl}
                  alt={image.id}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="transition-transform duration-300 group-hover:scale-110 object-cover"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Page;
