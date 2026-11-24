"use client";

import type { Recommendations } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, plainText, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteRecommendationAction } from "@/features/recommendations/actions/recommendations";
import { RecommendationsForm } from "@/features/recommendations/components/recommendations-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";

export function RecommendationsTable({ items }: { items: Recommendations[] }) {
  const sheet = useEditorSheet<Recommendations>();

  return (
    <div>
      <ListHeader
        title="Recommendations"
        description="What colleagues and managers say about you."
        count={items.length}
      >
        <AddButton label="Add recommendation" onClick={sheet.openCreate} />
      </ListHeader>

      <ContentList isEmpty={items.length === 0} emptyMessage="No recommendations yet.">
        {items.map((item) => (
          <ContentRow
            key={item.id}
            media={<RowMedia src={item.profileImageUrl} alt={item.name} />}
            title={item.name}
            subtitle={item.position}
            meta={plainText(item.recommendationText)}
            status={<RowStatus live={item.isActive} label={item.isActive ? "Shown" : "Hidden"} />}
            onEdit={() => sheet.openEdit(item)}
            onDelete={async () => {
              showActionResult(await deleteRecommendationAction(item.id));
            }}
          />
        ))}
      </ContentList>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit recommendation" : "Add recommendation"}
        description={sheet.editing ? "Update this recommendation." : "Add a recommendation from a colleague or manager."}
      >
        <RecommendationsForm
          key={sheet.editing?.id ?? "create"}
          initialValues={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
}
