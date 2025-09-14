"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  className?: string;
  gap?: string;
}

export function MasonryGallery({
  images,
  className,
  gap = "gap-4",
}: MasonryGalleryProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const createColumns = (numCols: number) => {
    const cols = Array.from({ length: numCols }, () => [] as GalleryImage[]);
    images.forEach((image, index) => {
      cols[index % numCols].push(image);
    });
    return cols;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={cn("w-full", className)}
    >
      {/* Desktop & Tablet (lg: 4 columns) */}
      <div className={cn("hidden lg:grid lg:grid-cols-4", gap)}>
        {createColumns(4).map((column, columnIndex) => (
          <div key={`lg-${columnIndex}`} className={cn("flex flex-col", gap)}>
            {column.map((image) => (
              <motion.div
                key={`lg-${image.id}`}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Tablet (md: 3 columns) */}
      <div className={cn("hidden md:grid lg:hidden md:grid-cols-3", gap)}>
        {createColumns(3).map((column, columnIndex) => (
          <div key={`md-${columnIndex}`} className={cn("flex flex-col", gap)}>
            {column.map((image) => (
              <motion.div
                key={`md-${image.id}`}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile (2 columns) */}
      <div className={cn("grid md:hidden grid-cols-2", gap)}>
        {createColumns(2).map((column, columnIndex) => (
          <div key={`sm-${columnIndex}`} className={cn("flex flex-col", gap)}>
            {column.map((image) => (
              <motion.div
                key={`sm-${image.id}`}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="50vw"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
