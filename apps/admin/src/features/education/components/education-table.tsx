"use client";

import { format } from "date-fns";
import type { Education } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteEducationAction } from "@/features/education/actions/education";
import { EducationForm } from "@/features/education/components/education-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

function formatRange(start: Date, end: Date | null) {
  return `${format(start, "MMM yyyy")} – ${end ? format(end, "MMM yyyy") : "Present"}`;
}

export function EducationTable({ items }: { items: Education[] }) {
  const sheet = useEditorSheet<Education>();

  return (
    <div>
      <ListHeader
        title="Education"
        description="Schools and programs on your home page."
        count={items.length}
      >
        <AddButton label="Add education" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={items.length === 0} emptyMessage="No education yet.">
        {items.map((item) => (
          <ContentRow
            key={item.id}
            media={<RowMedia src={item.logoUrl} alt={item.school} />}
            title={item.school}
            subtitle={item.degree}
            meta={formatRange(item.startDate, item.endDate)}
            status={<RowStatus live={item.isActive} label={item.isActive ? "Shown" : "Hidden"} />}
            onEdit={() => sheet.openEdit(item)}
            onDelete={async () => {
              showActionResult(await deleteEducationAction(item.id));
            }}
          />
        ))}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit education" : "Add education"}
        description={sheet.editing ? "Update this education entry." : "Add a school or program to your portfolio."}
      >
        <EducationForm
          key={sheet.editing?.id ?? "create"}
          initialValues={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
}
