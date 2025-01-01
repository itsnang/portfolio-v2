import Image from "next/image";
import React from "react";

interface AboutImageProps {
  imageUrl: string[];
}

export const AboutImage: React.FC<AboutImageProps> = ({ imageUrl }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {imageUrl.map((image, index) => (
        <div key={index} className="aspect-square relative">
          <Image
            src={image}
            alt={`Image ${index + 1}`}
            className="object-cover rounded-lg"
            fill
          />
        </div>
      ))}
    </div>
  );
};
