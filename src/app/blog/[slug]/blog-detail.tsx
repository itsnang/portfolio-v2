"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RichText } from "@/components/ui/rich-text";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface BlogDetailProps {
  post: {
    title: string;
    excerpt: string;
    coverImage: string | null;
    content: string;
    publishedAt: Date | string | null;
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
  };
}

export function BlogDetail({ post }: BlogDetailProps) {
  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <motion.article
      initial="initial"
      animate="animate"
      className="max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-8"
    >
      <motion.div variants={fadeInUp} className="flex items-center">
        <Link href="/blog" className="group">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to blog
          </Button>
        </Link>
      </motion.div>

      {post.coverImage && (
        <motion.div
          variants={fadeInUp}
          className="relative aspect-video overflow-hidden rounded-2xl bg-muted/50 shadow-xl"
        >
          <Image
            alt={post.title}
            src={post.coverImage}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
        </motion.div>
      )}

      <motion.div variants={fadeInUp} className="space-y-3">
        {publishedLabel && (
          <Badge variant="secondary" className="font-normal">
            {publishedLabel}
          </Badge>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="p-6 sm:p-8">
          <RichText html={post.content} variant="tiptap" />
        </Card>
      </motion.div>

      {(post.prev || post.next) && (
        <motion.nav
          variants={fadeInUp}
          className="flex justify-between gap-4 border-t pt-6"
        >
          {post.prev ? (
            <Link
              href={`/blog/${post.prev.slug}`}
              className="flex flex-col text-sm hover:text-primary transition-colors"
            >
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                ← Previous
              </span>
              <span className="font-medium">{post.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {post.next && (
            <Link
              href={`/blog/${post.next.slug}`}
              className="flex flex-col text-sm text-right hover:text-primary transition-colors"
            >
              <span className="text-muted-foreground text-xs uppercase tracking-wide">
                Next →
              </span>
              <span className="font-medium">{post.next.title}</span>
            </Link>
          )}
        </motion.nav>
      )}
    </motion.article>
  );
}
