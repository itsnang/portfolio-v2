"use client";

import type { Skills } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteSkillAction } from "@/features/skills/actions/skills";
import { SkillForm } from "@/features/skills/components/skill-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

export function SkillsTable({ items }: { items: Skills[] }) {
  const sheet = useEditorSheet<Skills>();

  return (
    <div>
      <ListHeader
        title="Skills"
        description="The tools and languages on your home page."
        count={items.length}
      >
        <AddButton label="Add skill" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={items.length === 0} emptyMessage="No skills yet.">
        {items.map((item) => (
          <ContentRow
            key={item.id}
            media={<RowMedia src={item.logoUrl} alt={item.name} />}
            title={item.name}
            subtitle={item.category}
            status={<RowStatus live={item.isActive} label={item.isActive ? "Shown" : "Hidden"} />}
            onEdit={() => sheet.openEdit(item)}
            onDelete={async () => {
              showActionResult(await deleteSkillAction(item.id));
            }}
          />
        ))}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit skill" : "Add skill"}
        description={sheet.editing ? "Update this skill." : "Add a skill to your portfolio."}
      >
        <SkillForm
          key={sheet.editing?.id ?? "create"}
          initialValues={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
}
