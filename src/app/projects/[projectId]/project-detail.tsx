"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SparklesText from "@/components/ui/sparkles-text";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface Technology {
  name: string;
  logoUrl: string;
}

interface ProjectDetailProps {
  project: {
    title: string;
    description: string;
    thumbnail: string;
    technologies: Technology[];
    detailImage: string[] | null;
  };
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => setSelectedImageIndex(index);
  const handleClose = useCallback(() => setSelectedImageIndex(null), []);

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedImageIndex === null || !project.detailImage) return;
      setSelectedImageIndex((prev) =>
        prev === 0 ? project.detailImage!.length - 1 : prev! - 1
      );
    },
    [selectedImageIndex, project.detailImage]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedImageIndex === null || !project.detailImage) return;
      setSelectedImageIndex((prev) =>
        prev === project.detailImage!.length - 1 ? 0 : prev! + 1
      );
    },
    [selectedImageIndex, project.detailImage]
  );

  return (
    <>
      <motion.section
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center">
          <Link href="/" className="group">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="relative aspect-video overflow-hidden rounded-2xl bg-muted/50 shadow-xl"
        >
          <Image
            alt={project.title}
            src={project.thumbnail}
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <SparklesText
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
              text={project.title}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </Card>

            {project.detailImage && project.detailImage.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Project Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.detailImage.map((detail, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        fill
                        src={detail}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={`${project.title} - Image ${index + 1}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((technology, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Badge
                      variant="secondary"
                      className="h-9 px-4 py-2 flex items-center gap-2 bg-secondary/50 hover:bg-secondary"
                    >
                      <Image
                        src={technology.logoUrl}
                        alt={technology.name}
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                      <span className="font-medium">{technology.name}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {selectedImageIndex !== null && project.detailImage && (
        <div className="fixed inset-0 z-100 bg-black w-screen h-screen overflow-hidden">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="fixed top-6 right-6 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="bg-black/50 text-white hover:bg-white/20 hover:text-white backdrop-blur-xs"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="fixed left-6 z-50 bg-black/50 text-white hover:bg-white/20 hover:text-white backdrop-blur-xs"
            >
              <ChevronLeft className="w-10 h-10" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="fixed right-6 z-50 bg-black/50 text-white hover:bg-white/20 hover:text-white backdrop-blur-xs"
            >
              <ChevronRight className="w-10 h-10" />
            </Button>
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 w-full h-full"
            >
              <Image
                src={project.detailImage[selectedImageIndex]}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
                quality={100}
              />
            </motion.div>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
              <div className="px-6 py-3 rounded-full bg-black/50 text-white text-base backdrop-blur-xs">
                {selectedImageIndex + 1} / {project.detailImage.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
