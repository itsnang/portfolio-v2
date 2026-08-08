"use client";

import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteRecommendationAction } from "@/app/dashboard/recommendations/action";
import { RecommendationsForm } from "@/components/form/recommendations-form";
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
import type { Recommendations } from "@/db/schema/recommendations.schema";
import type { IImages } from "@/types/profile.type";

const EMPTY_STATE_MESSAGE =
  "No recommendations added yet. Add your first one below.";

interface RecommendationsTableProps {
  items: Recommendations[];
  images: IImages[];
}

export function RecommendationsTable({
  items,
  images,
}: RecommendationsTableProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Recommendations | null>(
    null
  );

  function openCreate() {
    setEditingItem(null);
    setSheetOpen(true);
  }

  function openEdit(item: Recommendations) {
    setEditingItem(item);
    setSheetOpen(true);
  }

  function handleFormSuccess() {
    setSheetOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const result = await deleteRecommendationAction(id);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Recommendation deleted");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        <Button variant="outline" size="sm" onClick={openCreate}>
          Add Recommendation
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
                  <TableHead className="w-[70px]">Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative size-12 rounded-full overflow-hidden border bg-muted shrink-0">
                        <Image
                          src={item.profileImageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.position}
                    </TableCell>
                    <TableCell className="max-w-[240px]">
                      <p className="line-clamp-1 text-sm text-muted-foreground truncate">
                        {item.recommendationText}
                      </p>
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
                          aria-label={`Edit ${item.name}`}
                          onClick={() => openEdit(item)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmButton
                          itemLabel={item.name}
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
                  <div className="relative size-16 rounded-full overflow-hidden border bg-muted shrink-0">
                    <Image
                      src={item.profileImageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.position}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.recommendationText}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => openEdit(item)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmButton
                      itemLabel={item.name}
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
        title={editingItem ? "Edit Recommendation" : "Add Recommendation"}
        description={
          editingItem
            ? "Update this recommendation."
            : "Add a recommendation from a colleague or manager."
        }
      >
        <RecommendationsForm
          key={editingItem?.id ?? "create"}
          images={images}
          initialValues={editingItem ?? undefined}
          onSuccess={handleFormSuccess}
        />
      </FormSheet>
    </div>
  );
}
