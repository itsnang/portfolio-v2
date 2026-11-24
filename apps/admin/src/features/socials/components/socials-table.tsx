"use client";

import type { Socials } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteSocialAction } from "@/features/socials/actions/socials";
import { SocialsForm } from "@/features/socials/components/socials-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

export function SocialsTable({ items }: { items: Socials[] }) {
  const sheet = useEditorSheet<Socials>();

  return (
    <div>
      <ListHeader
        title="Socials"
        description="The profile links in your home page's contact section."
        count={items.length}
      >
        <AddButton label="Add social" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={items.length === 0} emptyMessage="No social links yet.">
        {items.map((item) => (
          <ContentRow
            key={item.id}
            media={<RowMedia src={item.icon} alt={item.name} />}
            title={item.name}
            subtitle={item.url}
            status={<RowStatus live={item.isActive} label={item.isActive ? "Shown" : "Hidden"} />}
            onEdit={() => sheet.openEdit(item)}
            onDelete={async () => {
              showActionResult(await deleteSocialAction(item.id));
            }}
          />
        ))}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit social" : "Add social"}
        description={sheet.editing ? "Update this social link." : "Add a social link to your portfolio."}
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
