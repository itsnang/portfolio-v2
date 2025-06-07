"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "./icons";
import Link from "next/link";

const achievements = [
  {
    id: 1,
    title: "Enhancing Cellcard App",
    description:
      "In recognition of your exceptional contribution and unwavering effort in enhancing the Cellcard app's performance and user experience.",
    icon: <Trophy className="h-10 w-10 text-yellow-500" />,
    year: "2025",
    category: "Award",
    links: [
      {
        title: "Certificate",
        icon: <Icons.certificate className="h-4 w-4 text-gray-900" />,
        href: "https://drive.google.com/file/d/12H-2G0rV7RTZ0oa7CsPOSOvRtMCb-lkS/view",
      },
    ],
  },
  {
    id: 2,
    title: "TOP 2 Turing Hackaton team",
    description:
      "a five-day program that provides participants with the opportunity to test their ideas in fulfilling societal needs and build a strong foundation for their startups.",
    icon: <Trophy className="h-10 w-10 text-yellow-500" />,
    year: "2024",
    category: "Award",
    links: [
      {
        title: "View more",
        icon: <Icons.certificate className="h-4 w-4 text-gray-900" />,
        href: "https://hackathon.techostartup.center/cycle6",
      },
    ],
  },

  {
    id: 4,
    title: "Full-Stack Web Development Bootcamp",
    description:
      "Awarded a Cellcard scholarship to attend the Sabaicode Full-Stack Web Development Bootcamp, recognizing my potential in full-stack development.",
    icon: <GraduationCap className="h-10 w-10 text-green-500" />,
    year: "2022",
    category: "Education",
    links: [
      {
        title: "News",
        icon: <Icons.globe className="h-4 w-4 text-gray-900" />,
        href: "https://www.cellcard.com.kh/en/media-center/news/post/%E1%9E%A2%E1%9E%93%E1%9E%B6%E1%9E%82%E1%9E%8F%E1%9E%A2%E1%9F%92%E1%9E%93%E1%9E%80%E1%9E%A2%E1%9E%97%E1%9E%B7%E1%9E%9C%E1%9E%8C%E1%9F%92%E1%9E%8D%E1%9E%93%E1%9F%8D%E1%9E%80%E1%9E%98%E1%9F%92%E1%9E%98/",
      },
    ],
  },
  {
    id: 5,
    title: "Mobile App Developer at Cellcard",
    description:
      "Promoted to Mobile App Developer at Cellcard, Developing and maintaining the Cellcard App and Cellcard Website.",
    icon: <Briefcase className="h-10 w-10 text-purple-500" />,
    year: "2024",
    category: "Career",
  },
  {
    id: 6,
    title: "Mobile App Developer Trainee at Cellcard",
    description:
      "Completed a 6-month internship as a Mobile App Developer Trainee at Cellcard, where I developed and maintained Dealer App and Cellcard Sales Force App.",
    icon: <Briefcase className="h-10 w-10 text-purple-500" />,
    year: "2023",
    category: "Career",
  },
];

export function AchievementSection() {
  const [filter, setFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(achievements.map((a) => a.category)));

  const filteredAchievements = filter
    ? achievements.filter((a) => a.category === filter)
    : achievements;

  return (
    <section className="pt-4 space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Achievements
      </h1>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={filter === null ? "default" : "outline-solid"}
            className="cursor-pointer text-sm"
            onClick={() => setFilter(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filter === category ? "default" : "outline-solid"}
              className="cursor-pointer text-sm"
              onClick={() => setFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="rounded-full p-2 bg-muted flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {achievement.title}
                    </CardTitle>
                    <CardDescription>
                      <span className="inline-block mt-1 text-sm font-medium">
                        {achievement.year} • {achievement.category}
                      </span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {achievement.description}
                  </p>
                </CardContent>
                <CardFooter>
                  {achievement.links && achievement.links.length > 0 && (
                    <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
                      {achievement.links.map((link, idx) => (
                        <Link target="_blank" href={link.href} key={idx}>
                          <Badge
                            key={idx}
                            title={link.title}
                            className="flex gap-2 bg-white hover:bg-white"
                          >
                            {link.icon}
                            <span className="text-gray-900">{link.title}</span>
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
