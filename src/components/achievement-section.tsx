"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { achievements } from "@/data/achievement";

export function AchievementSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(achievements.map((a) => a.category)));
  const filtered = filter
    ? achievements.filter((a) => a.category === filter)
    : achievements;

  return (
    <section className="pt-8 pb-16 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-sm text-muted-foreground">
          Awards, certifications, and career highlights.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "px-3 py-1 text-xs border rounded-md transition-colors",
            filter === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={cn(
              "px-3 py-1 text-xs border rounded-md transition-colors",
              filter === category
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filtered.map((achievement) => (
            <div
              key={achievement.id}
              className="border border-border rounded-md p-5 hover:border-foreground/25 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 size-11 rounded-sm bg-muted flex items-center justify-center [&_svg]:size-5">
                  {achievement.icon}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug">
                      {achievement.title}
                    </h3>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {achievement.year}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-xs text-muted-foreground/50 uppercase tracking-wider font-medium">
                      {achievement.category}
                    </span>

                    {achievement.links && achievement.links.length > 0 && (
                      <div className="flex gap-3">
                        {achievement.links.map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.href}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={`${achievement.title} — ${link.title}`}
                          >
                            <ExternalLink className="size-3" />
                            {link.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-12">
          No achievements found.
        </p>
      )}
    </section>
  );
}
