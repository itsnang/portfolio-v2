import React from "react";
import BlurFade from "./ui/blur-fade";
import { ResumeCard } from "./resume-card";

const work = [
  {
    company: "Cellcard",
    href: "https://atomic.finance",
    badges: [],
    location: "Remote",
    title: "Mobile App Engineer",
    logoUrl:
      "https://image.pitchbook.com/btX7v4aYzfQ0RX1RuiwdzTClKMH1684425759523_200x200",
    start: "May 2021",
    end: "Oct 2022",
    description:
      "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
  },
  {
    company: "Prutteka",
    badges: [],
    href: "https://shopify.com",
    location: "Remote",
    title: "Self Employed",
    logoUrl: "https://picbucket.vercel.app/images/673da9ee4ad5a4ba85a3e35b",
    start: "January 2021",
    end: "April 2021",
    description:
      "Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
  },
];

export const Experience = () => {
  return (
    <div className="flex min-h-0 flex-col gap-y-3 py-6">
      <h2 className="text-xl font-bold">Work Experience</h2>
      {work.map((work, id) => (
        <BlurFade key={work.company} delay={0.25 + id * 0.05} inView>
          <ResumeCard
            key={work.company}
            logoUrl={work.logoUrl}
            altText={work.company}
            title={work.company}
            subtitle={work.title}
            href={work.href}
            badges={work.badges}
            period={`${work.start} - ${work.end ?? "Present"}`}
            description={work.description}
          />
        </BlurFade>
      ))}
    </div>
  );
};
