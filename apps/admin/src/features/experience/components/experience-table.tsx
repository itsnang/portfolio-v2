"use client";

import type { Experiences } from "@portfolio/db/schema";
import { convertDate } from "@portfolio/ui/convert-date";

import { AddButton, ContentList, ContentRow, ListHeader, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteExperienceAction } from "@/features/experience/actions/experience";
import { ExperienceForm } from "@/features/experience/components/experience-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

export function ExperienceTable({ experiences }: { experiences: Experiences[] }) {
  const sheet = useEditorSheet<Experiences>();

  return (
    <div>
      <ListHeader
        title="Experience"
        description="The roles on your home page."
        count={experiences.length}
      >
        <AddButton label="Add experience" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={experiences.length === 0} emptyMessage="No experience yet.">
        {experiences.map((item) => (
          <ContentRow
            key={item.id}
            media={<RowMedia src={item.imageUrl} alt={item.company} />}
            title={item.company}
            subtitle={item.title}
            meta={`${convertDate(item.startDate)} – ${item.endDate ? convertDate(item.endDate) : "Present"}`}
            itemLabel={`${item.title} at ${item.company}`}
            status={<RowStatus live={item.isActive} label={item.isActive ? "Shown" : "Hidden"} />}
            onEdit={() => sheet.openEdit(item)}
            onDelete={async () => {
              showActionResult(await deleteExperienceAction(item.id));
            }}
          />
        ))}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit experience" : "Add experience"}
        description={sheet.editing ? "Update this work experience." : "Add a new role to your portfolio."}
      >
        <ExperienceForm
          key={sheet.editing?.id ?? "create"}
          initialData={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
}
