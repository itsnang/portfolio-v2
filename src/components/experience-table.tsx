"use client";

import { Experiences } from "@/db/schema/experiences.schema";
import { convertDate } from "@/helper/convert-date";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Main table component
export const ExperienceTable = ({
  experiences,
}: {
  experiences: Experiences[];
}) => {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No experiences added yet. Add your first experience below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Logo</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  <Avatar className="size-10 border bg-muted-background dark:bg-foreground">
                    <AvatarImage
                      src={experience.imageUrl}
                      alt={experience.company}
                      className="object-contain"
                    />
                    <AvatarFallback>{experience.company[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {experience.company}
                </TableCell>
                <TableCell>{experience.title}</TableCell>
                <TableCell>
                  {`${convertDate(experience.startDate)} - ${
                    experience.endDate
                      ? convertDate(experience.endDate)
                      : "Present"
                  }`}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={experience.isActive ? "default" : "secondary"}
                  >
                    {experience.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/experience/${experience.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
