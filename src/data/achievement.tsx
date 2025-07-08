import { Briefcase, GraduationCap, Trophy, ExternalLink } from "lucide-react";
import { Icons } from "@/components/icons";

export const achievements = [
  {
    id: 1,
    title: "Enhancing Cellcard App",
    description:
      "In recognition of your exceptional contribution and unwavering effort in enhancing the Cellcard app's performance and user experience.",
    icon: <Trophy className="h-12 w-12 text-yellow-500" />,
    year: "2025",
    category: "Award",
    gradient: "from-yellow-400/20 to-orange-500/20",
    links: [
      {
        title: "Certificate",
        icon: <ExternalLink className="h-4 w-4" />,
        href: "https://drive.google.com/file/d/12H-2G0rV7RTZ0oa7CsPOSOvRtMCb-lkS/view",
      },
    ],
  },
  {
    id: 2,
    title: "TOP 2 Turing Hackaton team",
    description:
      "a five-day program that provides participants with the opportunity to test their ideas in fulfilling societal needs and build a strong foundation for their startups.",
    icon: <Trophy className="h-12 w-12 text-yellow-500" />,
    year: "2024",
    category: "Award",
    gradient: "from-yellow-400/20 to-amber-500/20",
    links: [
      {
        title: "View more",
        icon: <ExternalLink className="h-4 w-4" />,
        href: "https://hackathon.techostartup.center/cycle6",
      },
    ],
  },
  {
    id: 4,
    title: "Full-Stack Web Development Bootcamp",
    description:
      "Awarded a Cellcard scholarship to attend the Sabaicode Full-Stack Web Development Bootcamp, recognizing my potential in full-stack development.",
    icon: <GraduationCap className="h-12 w-12 text-emerald-500" />,
    year: "2022",
    category: "Education",
    gradient: "from-emerald-400/20 to-teal-500/20",
    links: [
      {
        title: "News",
        icon: <Icons.globe className="h-4 w-4" />,
        href: "https://sabaicode.com",
      },
    ],
  },
  {
    id: 5,
    title: "Mobile App Developer at Cellcard",
    description:
      "Promoted to Mobile App Developer at Cellcard, Developing and maintaining the Cellcard App and Cellcard Website.",
    icon: <Briefcase className="h-12 w-12 text-purple-500" />,
    year: "2024",
    category: "Career",
    gradient: "from-purple-400/20 to-violet-500/20",
  },
  {
    id: 6,
    title: "Mobile App Developer Trainee at Cellcard",
    description:
      "Completed a 6-month internship as a Mobile App Developer Trainee at Cellcard, where I developed and maintained Dealer App and Cellcard Sales Force App.",
    icon: <Briefcase className="h-12 w-12 text-blue-500" />,
    year: "2023",
    category: "Career",
    gradient: "from-blue-400/20 to-indigo-500/20",
  },
];
