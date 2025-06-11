"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { achievements } from "@/data/achievement";

export function AchievementSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  const filteredAchievements = filter
    ? achievements.filter((a) => a.category === filter)
    : achievements;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="pt-8 pb-16 space-y-8">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Achievements
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my awards, and career highlights
        </p>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge
            variant={filter === null ? "default" : "outline"}
            className="cursor-pointer text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setFilter(null)}
          >
            All ({achievements.length})
          </Badge>
          {categories.map((category) => {
            const count = achievements.filter(
              (a) => a.category === category
            ).length;
            return (
              <Badge
                key={category}
                variant={filter === category ? "default" : "outline"}
                className="cursor-pointer text-sm px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => setFilter(category)}
              >
                {category} ({count})
              </Badge>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                layout
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                <Card className="h-full overflow-hidden border border-border/20 bg-gradient-to-br from-background via-background to-muted/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -m-[1px] border-2" />

                  <div className="relative bg-background rounded-lg h-full">
                    <CardHeader className="flex flex-col items-center text-center space-y-4 pb-4">
                      <motion.div
                        className="relative"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${achievement.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}
                        />
                        <div className="relative rounded-full p-4 bg-background/90 backdrop-blur-sm border border-border/30 shadow-lg">
                          {achievement.icon}
                        </div>
                      </motion.div>

                      <div className="space-y-2">
                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                          {achievement.title}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            {achievement.year}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                            {achievement.category}
                          </span>
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </CardContent>

                    <CardFooter className="px-6 pt-0">
                      {achievement.links && achievement.links.length > 0 && (
                        <div className="w-full flex flex-wrap justify-center gap-2">
                          {achievement.links.map((link, idx) => (
                            <Link target="_blank" href={link.href} key={idx}>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer">
                                  {link.icon}
                                  <span className="font-medium">
                                    {link.title}
                                  </span>
                                </Badge>
                              </motion.div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">
              No achievements found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filter to see more results.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
