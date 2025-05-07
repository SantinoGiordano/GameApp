import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// Draggable item component
function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-2 m-1 bg-blue-300 border border-blue-600 rounded cursor-grab"
    >
      Item {id}
    </div>
  );
}

// Droppable area component
function DroppableArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[200px] p-4 mt-6 border-2 border-dashed border-gray-400 bg-gray-100"
    >
      <h2 className="text-gray-700 mb-2 font-semibold">Drop Items Here</h2>
      <div className="flex flex-wrap">{children}</div>
    </div>
  );
}

// Main page component
export default function HomePage() {
  const [droppedItems, setDroppedItems] = useState<string[]>([]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over && over.id === "droppable") {
      const id = String(active.id);
      setDroppedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require a small drag movement to activate
      },
    })
  );

  const items = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="max-w-xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-4">Draggable Items</h1>

        {/* Draggable Items */}
        <div className="flex flex-wrap">
          {items.map((id) =>
            droppedItems.includes(id) ? null : (
              <DraggableItem key={id} id={id} />
            )
          )}
        </div>

        {/* Droppable Area */}
        <DroppableArea>
          {droppedItems.map((id) => (
            <div
              key={id}
              className="p-2 m-1 bg-green-300 border border-green-600 rounded"
            >
              Item {id}
            </div>
          ))}
        </DroppableArea>
      </div>
    </DndContext>
  );
}
