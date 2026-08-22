"use client";

import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteEducationAction } from "@/features/education/actions";
import { EducationForm } from "@/features/education/components/education-form";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { FormSheet } from "@/components/form-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Education } from "@/features/education/schemas";
import type { IImages } from "@/features/media/types";

const EMPTY_STATE_MESSAGE =
  "No education added yet. Add your first entry below.";

function formatRange(start: Date, end: Date | null) {
  const startLabel = format(start, "MMM yyyy");
  const endLabel = end ? format(end, "MMM yyyy") : "Present";
  return `${startLabel} – ${endLabel}`;
}

interface EducationTableProps {
  items: Education[];
  images: IImages[];
}

export function EducationTable({ items, images }: EducationTableProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  function openCreate() {
    setEditingItem(null);
    setSheetOpen(true);
  }

  function openEdit(item: Education) {
    setEditingItem(item);
    setSheetOpen(true);
  }

  function handleFormSuccess() {
    setSheetOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteEducationAction(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Education deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button variant="outline" size="sm" onClick={openCreate}>
          Add Education
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {EMPTY_STATE_MESSAGE}
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">Logo</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative size-12 rounded-md overflow-hidden border bg-muted shrink-0">
                        <Image
                          src={item.logoUrl}
                          alt={item.school}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.school}
                    </TableCell>
                    <TableCell>{item.degree}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRange(item.startDate, item.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${item.school}`}
                          onClick={() => openEdit(item)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmButton
                          itemLabel={item.school}
                          onConfirm={() => handleDelete(item.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-4 space-y-3 bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="relative size-16 rounded-md overflow-hidden border bg-muted shrink-0">
                    <Image
                      src={item.logoUrl}
                      alt={item.school}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.school}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.degree}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRange(item.startDate, item.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item.school}`}
                      onClick={() => openEdit(item)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmButton
                      itemLabel={item.school}
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </div>
                </div>
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </>
      )}

      <FormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingItem ? "Edit Education" : "Add Education"}
        description={
          editingItem
            ? "Update this education entry."
            : "Add a school or program to your portfolio."
        }
      >
        <EducationForm
          key={editingItem?.id ?? "create"}
          images={images}
          initialValues={editingItem ?? undefined}
          onSuccess={handleFormSuccess}
        />
      </FormSheet>
    </div>
  );
}
