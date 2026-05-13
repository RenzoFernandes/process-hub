import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";

import type { ProcessNode } from "../types/process";
import { ProcessKanbanCardPreview } from "./ProcessKanbanCard";
import { ProcessKanbanColumn } from "./ProcessKanbanColumn";

interface StatusColumn {
  id: string;
  title: string;
  description: string;
  tone: string;
}

interface ProcessKanbanBoardProps {
  columns: StatusColumn[];
  processes: ProcessNode[];
  onMoveProcess: (process: ProcessNode, nextStatus: string) => Promise<void>;
  onSelectProcess: (process: ProcessNode) => void;
  onEditProcess: (process: ProcessNode) => void;
  onDeleteProcess: (id: string) => void;
}

export function ProcessKanbanBoard({
  columns,
  processes,
  onMoveProcess,
  onSelectProcess,
  onEditProcess,
  onDeleteProcess,
}: ProcessKanbanBoardProps) {
  const [activeProcess, setActiveProcess] = useState<ProcessNode | null>(null);
  const [localOrder, setLocalOrder] = useState<string[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedProcesses = useMemo(() => {
    if (localOrder.length === 0) return processes;

    const positionById = new Map(
      localOrder.map((processId, index) => [processId, index]),
    );

    return [...processes].sort((a, b) => {
      const first = positionById.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const second = positionById.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return first - second;
    });
  }, [localOrder, processes]);

  const processesByColumn = useMemo(
    () =>
      columns.reduce<Record<string, ProcessNode[]>>((accumulator, column) => {
        accumulator[column.id] = orderedProcesses.filter(
          (process) => normalizeStatus(process.status, columns) === column.id,
        );

        return accumulator;
      }, {}),
    [columns, orderedProcesses],
  );

  function handleDragStart(event: DragStartEvent) {
    const process = processes.find((item) => item.id === event.active.id);
    setActiveProcess(process || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveProcess(null);

    if (!over) return;

    const draggedProcess = processes.find((process) => process.id === active.id);
    if (!draggedProcess) return;

    const sourceColumnId = normalizeStatus(draggedProcess.status, columns);
    const targetColumnId = getTargetColumnId(String(over.id), columns, processes);

    if (!targetColumnId) return;

    if (sourceColumnId === targetColumnId) {
      const sourceItems = processesByColumn[sourceColumnId] || [];
      const oldIndex = sourceItems.findIndex((process) => process.id === active.id);
      const newIndex = sourceItems.findIndex((process) => process.id === over.id);

      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        const movedIds = arrayMove(
          sourceItems.map((process) => process.id),
          oldIndex,
          newIndex,
        );
        const remainingIds = processes
          .map((process) => process.id)
          .filter((processId) => !movedIds.includes(processId));

        setLocalOrder([...movedIds, ...remainingIds]);
      }

      return;
    }

    await onMoveProcess(draggedProcess, targetColumnId);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveProcess(null)}
    >
      <div className="flex min-h-[500px] gap-4 overflow-x-auto pb-2">
        {columns.map((column) => (
          <ProcessKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            description={column.description}
            tone={column.tone}
            processes={processesByColumn[column.id] || []}
            onSelectProcess={onSelectProcess}
            onEditProcess={onEditProcess}
            onDeleteProcess={onDeleteProcess}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProcess ? (
          <div className="w-[320px]">
            <ProcessKanbanCardPreview
              process={activeProcess}
              onSelectProcess={onSelectProcess}
              onEditProcess={onEditProcess}
              onDeleteProcess={onDeleteProcess}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function normalizeStatus(status: string | undefined, columns: StatusColumn[]) {
  return columns.some((column) => column.id === status) ? status : "open";
}

function getTargetColumnId(
  overId: string,
  columns: StatusColumn[],
  processes: ProcessNode[],
) {
  if (columns.some((column) => column.id === overId)) {
    return overId;
  }

  const process = processes.find((item) => item.id === overId);

  if (!process) return null;

  return normalizeStatus(process.status, columns);
}
