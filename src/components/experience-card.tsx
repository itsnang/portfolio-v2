"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import React from "react";

interface ExperienceCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}
export const ExperienceCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  badges,
  period,
  description,
}: ExperienceCardProps) => {
  return (
    <Card className="flex p-4">
      <div className="">
        <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
          <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="grow ml-4 items-center flex-col group">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between gap-x-2 text-base">
            <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
              {title}
              {badges && (
                <span className="inline-flex gap-x-1">
                  {badges.map((badge, index) => (
                    <Badge
                      variant="secondary"
                      className="align-middle text-xs"
                      key={index}
                    >
                      {badge}
                    </Badge>
                  ))}
                </span>
              )}
            </h3>
            <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
              {period}
            </div>
          </div>
          {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
        </CardHeader>
        {description && (
          <div className="mt-2 text-xs sm:text-sm">
            {description && (
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="[&>ol]:list-decimal [&>ol]:list-outside [&>ol]:space-y-1 [&>ol>li[data-list='bullet']]:list-disc [&>ul]:list-disc [&>ul]:list-outside [&>ul]:space-y-1 [&>ul]:ml-4 [&>ol]:ml-4 [&_li]:my-1"
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
