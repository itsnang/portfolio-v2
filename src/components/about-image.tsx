import Image from "next/image";
import React from "react";

interface AboutImageProps {
  imageUrl: string[];
}

export const AboutImage: React.FC<AboutImageProps> = ({ imageUrl }) => {
  return (
    <div className="columns-2 gap-4 sm:columns-3">
      {imageUrl.map((imageUrl, idx) => (
        <Image
          key={idx}
          className="mb-4 size-full rounded-lg object-contain"
          src={imageUrl}
          width={100}
          height={100}
          alt={`Random stock image ${idx + 1}`}
        />
      ))}
    </div>
  );
};
