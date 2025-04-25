import Image from "next/image";
import React from "react";

interface AboutImageProps {
  imageUrl: string[];
}

const aspectRatio = [
  "aspect-[3/4]", // Portrait
  // "aspect-[4/3]", // Landscape
  "aspect-[1/1]", // Square
  // "aspect-[4/3]", // Landscape
];

export const AboutImage: React.FC<AboutImageProps> = ({ imageUrl }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      {imageUrl.map((image, index) => (
        <div
          key={index}
          className={`relative ${aspectRatio[index % aspectRatio.length]}`}
        >
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
