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
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead className="min-w-[150px]">Company</TableHead>
                <TableHead className="min-w-[150px]">Position</TableHead>
                <TableHead className="min-w-[200px]">Period</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="rounded-lg border p-4 space-y-4 bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border bg-muted-background dark:bg-foreground">
                  <AvatarImage
                    src={experience.imageUrl}
                    alt={experience.company}
                    className="object-contain"
                  />
                  <AvatarFallback>{experience.company[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{experience.company}</h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.title}
                  </p>
                </div>
              </div>
              <Link href={`/dashboard/experience/${experience.id}/edit`}>
                <Button variant="ghost" size="icon">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Period</span>
                <span>
                  {`${convertDate(experience.startDate)} - ${
                    experience.endDate
                      ? convertDate(experience.endDate)
                      : "Present"
                  }`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={experience.isActive ? "default" : "secondary"}
                  className="ml-auto"
                >
                  {experience.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
