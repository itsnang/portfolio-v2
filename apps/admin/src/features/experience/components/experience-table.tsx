"use client";

import { useEditorSheet } from "@/lib/use-editor-sheet";

import { Experiences } from "@portfolio/db/schema";
import { convertDate } from "@portfolio/ui/convert-date";
import { Button } from "@portfolio/ui/button";
import { PencilIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@portfolio/ui/avatar";
import { Badge } from "@portfolio/ui/badge";
import { FormSheet } from "@/components/form-sheet";
import { ExperienceForm } from "@/features/experience/components/experience-form";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { deleteExperienceAction } from "@/features/experience/actions/experience";
import { showActionResult } from "@/lib/use-run-action";

interface ExperienceTableProps {
  experiences: Experiences[];
}

export const ExperienceTable = ({ experiences }: ExperienceTableProps) => {
  const sheet = useEditorSheet<Experiences>();

  async function handleDelete(id: string) {
    showActionResult(await deleteExperienceAction(id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experience</h2>
        <Button variant="outline" size="sm" onClick={sheet.openCreate}>
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No experiences added yet. Add your first experience below.
        </div>
      ) : (
        <>
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
                      <TableCell className="font-medium">{experience.company}</TableCell>
                      <TableCell>{experience.title}</TableCell>
                      <TableCell>
                        {`${convertDate(experience.startDate)} - ${
                          experience.endDate ? convertDate(experience.endDate) : "Present"
                        }`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={experience.isActive ? "default" : "secondary"}>
                          {experience.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${experience.title} at ${experience.company}`}
                            onClick={() => sheet.openEdit(experience)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <DeleteConfirmButton
                            itemLabel={`${experience.title} at ${experience.company}`}
                            onConfirm={() => handleDelete(experience.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="md:hidden space-y-4">
            {experiences.map((experience) => (
              <div key={experience.id} className="rounded-lg border p-4 space-y-4 bg-card">
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
                      <p className="text-sm text-muted-foreground">{experience.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${experience.title} at ${experience.company}`}
                      onClick={() => sheet.openEdit(experience)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmButton
                      itemLabel={`${experience.title} at ${experience.company}`}
                      onConfirm={() => handleDelete(experience.id)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Period</span>
                    <span>
                      {`${convertDate(experience.startDate)} - ${
                        experience.endDate ? convertDate(experience.endDate) : "Present"
                      }`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={experience.isActive ? "default" : "secondary"} className="ml-auto">
                      {experience.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit Experience" : "Add Experience"}
        description={
          sheet.editing
            ? "Update this work experience."
            : "Add a new role to your portfolio."
        }
      >
        <ExperienceForm
          key={sheet.editing?.id ?? "create"}
          initialData={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
};
