"use client";

import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

import { PencilIcon } from "lucide-react";
import Image from "next/image";

import { deleteSocialAction } from "@/features/socials/actions/socials";
import { SocialsForm } from "@/features/socials/components/socials-form";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { FormSheet } from "@/components/form-sheet";
import { Badge } from "@portfolio/ui/badge";
import { Button } from "@portfolio/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Socials } from "@portfolio/db/schema";

const EMPTY_STATE_MESSAGE = "No socials added yet. Add your first one below.";

interface SocialsTableProps {
  items: Socials[];
}

export function SocialsTable({ items }: SocialsTableProps) {
  const sheet = useEditorSheet<Socials>();

  async function handleDelete(id: string) {
    const result = await deleteSocialAction(id);
    showActionResult(result);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Socials</h2>
        <Button variant="outline" size="sm" onClick={sheet.openCreate}>
          Add Social
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
                  <TableHead className="w-[70px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
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
                          src={item.icon}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate text-sm text-muted-foreground">
                        {item.url}
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
                          onClick={() => sheet.openEdit(item)}
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
                  <div className="relative size-16 rounded-md overflow-hidden border bg-muted shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => sheet.openEdit(item)}
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
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit Social" : "Add Social"}
        description={
          sheet.editing
            ? "Update this social link."
            : "Add a social link to your portfolio."
        }
      >
        <SocialsForm
          key={sheet.editing?.id ?? "create"}
          initialValues={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
}
