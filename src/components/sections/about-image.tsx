import Image from "next/image";
import React from "react";

interface AboutImageProps {
  imageUrl: string[];
}

export const AboutImage: React.FC<AboutImageProps> = ({ imageUrl }) => {
  return (
    <div className="columns-2 gap-4 sm:columns-3">
      {imageUrl.map((image, index) => (
        <div key={index} className="mb-4">
          <Image
            src={image}
            alt={`Image ${index + 1}`}
            className="object-cover rounded-lg"
            width={1600}
            height={900}
          />
        </div>
      ))}
    </div>
  );
};
