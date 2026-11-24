"use client";

import { useCallback, useId, useState } from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Project, ProjectTechnology } from "@portfolio/db/schema";

import { AddButton, ContentList, ContentRow, ListHeader, plainText, RowMedia, RowStatus } from "@/components/content-list";
import { FormSheet } from "@/components/form-sheet";
import { deleteProjectAction, reorderProjectsAction } from "@/features/project/actions/project";
import ProjectForm from "@/features/project/components/project-form";
import { useEditorSheet } from "@/lib/use-editor-sheet";
import { showActionResult } from "@/lib/use-run-action";
import { toastRefreshWarning } from "@/lib/toast-refresh-warning";

/** "Next.js, Postgres +2" */
function technologiesLabel(technologies: ProjectTechnology[] | null) {
  if (!technologies?.length) return null;
  const names = technologies.slice(0, 2).map((tech) => tech.name).join(", ");
  return technologies.length > 2 ? `${names} +${technologies.length - 2}` : names;
}

function SortableProjectRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  return (
    <ContentRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 1 : undefined,
      }}
      handle={
        <button
          {...attributes}
          {...listeners}
          className="-ml-1 cursor-grab rounded-sm p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Drag to reorder ${project.title}`}
        >
          <GripVertical className="size-4" />
        </button>
      }
      media={<RowMedia src={project.thumbnail} alt={project.title} />}
      title={project.title}
      subtitle={plainText(project.description)}
      meta={technologiesLabel(project.technologies as ProjectTechnology[] | null)}
      status={<RowStatus live={project.isActive} label={project.isActive ? "Shown" : "Hidden"} />}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

export const ProjectTable = ({ projects }: { projects: Project[] }) => {
  const [items, setItems] = useState<Project[]>(projects);
  const [syncedProjects, setSyncedProjects] = useState(projects);
  const sheet = useEditorSheet<Project>();
  // A stable id keeps dnd-kit's generated aria ids the same on the server and the client.
  const dndId = useId();

  // Fresh projects from the server replace the local order (set during render, not in an effect).
  if (projects !== syncedProjects) {
    setSyncedProjects(projects);
    setItems(projects);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((p) => p.id === active.id);
      const newIndex = items.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);

      setItems(reordered);

      const result = await reorderProjectsAction(reordered.map((p, i) => ({ id: p.id, sortOrder: i })));
      if (result.success) {
        toastRefreshWarning(result);
      } else {
        toast.error(result.error);
        setItems(items); // put the old order back
      }
    },
    [items]
  );

  return (
    <div>
      <ListHeader
        title="Projects"
        description="The work on your home page, in this order. Drag to reorder."
        count={items.length}
      >
        <AddButton label="Add project" onClick={sheet.openCreate} />
      </ListHeader>

      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ContentList isEmpty={items.length === 0} emptyMessage="No projects yet.">
            {items.map((project) => (
              <SortableProjectRow
                key={project.id}
                project={project}
                onEdit={() => sheet.openEdit(project)}
                onDelete={async () => {
                  showActionResult(await deleteProjectAction(project.id));
                }}
              />
            ))}
          </ContentList>
        </SortableContext>
      </DndContext>

      <FormSheet
        open={sheet.open}
        onOpenChange={sheet.setOpen}
        title={sheet.editing ? "Edit project" : "Add project"}
        description={sheet.editing ? "Update this project." : "Add a new project to your portfolio."}
      >
        <ProjectForm
          key={sheet.editing?.id ?? "create"}
          initialData={sheet.editing ?? undefined}
          onSuccess={sheet.close}
        />
      </FormSheet>
    </div>
  );
};
