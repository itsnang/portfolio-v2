import { ImageDown } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

interface ImageUploadProps {
  name: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ name }) => {
  const [imgSrc, setImgSrc] = useState("");
  const { register, setValue } = useFormContext();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
      "image/jfif": [],
    },
    onDrop: (files) => {
      const reader = new FileReader();
      if (files && files[0]) {
        const file = files[0];

        reader.onload = function () {
          const url = reader.result?.toString() || "";
          setImgSrc(url);
          setValue(name, file); // Update the form value using react-hook-form
        };

        reader.readAsDataURL(file);
      }
    },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`relative mx-auto flex aspect-2/1 w-full max-w-3xl items-center justify-center rounded-2xl border border-gray-200 transition-all duration-200 ${
          isDragActive ? "ring-primary bg-gray-50 ring-3" : "bg-white"
        }`}
      >
        <input {...register} {...getInputProps()} multiple={false} />
        {imgSrc ? (
          <Image
            src={imgSrc}
            className="z-0 rounded-2xl bg-gray-100 object-cover"
            fill
            alt="upload image"
            sizes={"100vh"}
          />
        ) : null}
        <div
          className={`z-10 flex cursor-pointer flex-col items-center justify-center rounded-xl border transition-all duration-200 sm:p-4 ${
            isDragActive || imgSrc
              ? "border-gray-100/25 bg-gray-900/25 text-white"
              : "border-gray-200 bg-gray-100 text-gray-700"
          }`}
        >
          <ImageDown className="h-10 w-10 stroke-[0.75px] sm:h-10 sm:w-10" />
          <p className="p-4 text-center text-sm sm:text-base">
            Drag & drop your image here <br />
            or click to select image
          </p>
          <div
            className={`hidden rounded-xl border px-4 py-2 sm:block ${
              isDragActive || imgSrc
                ? "border-gray-100/25 bg-gray-900/20 text-white"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            Select image
          </div>
        </div>
      </div>
      {/* {errors[name] ? (
        <p className="text-sm text-red-500">
          {errors[name]?.message?.toString()}
        </p>
      ) : null} */}
    </>
  );
};
