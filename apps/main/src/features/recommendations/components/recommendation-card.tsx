"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";
import React from "react";

interface RecommendationCardProps {
  name: string;
  position: string;
  profileImageUrl: string;
  recommendationText: string;
}

export const RecommendationCard = ({
  name,
  position,
  profileImageUrl,
  recommendationText,
}: RecommendationCardProps) => {
  return (
    <Card className="flex flex-col p-4 h-full">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="border size-12 bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={profileImageUrl}
              alt={name}
              className="object-cover"
            />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{position}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div className="relative">
          <Quote className="absolute top-0 left-0 h-4 w-4 text-muted-foreground/50" />
          <p className="text-sm leading-relaxed pl-6 italic text-muted-foreground">
            {recommendationText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
