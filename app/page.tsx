'use client'
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  rectIntersection,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

// Draggable item
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

// Droppable area
function DroppableArea({
  id,
  label,
  color,
  children,
}: {
  id: string;
  label: string;
  color: "red" | "green";
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  const style =
    color === "red"
      ? "border-red-500 bg-red-100"
      : "border-green-500 bg-green-100";

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[200px] p-4 border-2 border-dashed rounded ${style}`}
    >
      <h2 className="text-center font-semibold text-gray-700 mb-2">{label}</h2>
      <div className="flex flex-wrap justify-center">{children}</div>
    </div>
  );
}

// Main page
export default function HomePage() {
  const [areaRed, setAreaRed] = useState<string[]>([]);
  const [areaGreen, setAreaGreen] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = over.id;

    // Remove item from both first
    setAreaRed((prev) => prev.filter((item) => item !== id));
    setAreaGreen((prev) => prev.filter((item) => item !== id));

    // Add to appropriate area
    if (target === "red") {
      setAreaRed((prev) => [...prev, id]);
    } else if (target === "green") {
      setAreaGreen((prev) => [...prev, id]);
    }
  };

  const allItems = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const assigned = new Set([...areaRed, ...areaGreen]);
  const availableItems = allItems.filter((id) => !assigned.has(id));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Drag Items Into Red or Green Boxes
        </h1>

        <div className="flex flex-wrap justify-center mb-8">
          {availableItems.map((id) => (
            <DraggableItem key={id} id={id} />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <DroppableArea id="red" label="Red Zone" color="red">
            {areaRed.map((id) => (
              <DraggableItem key={id} id={id} />
            ))}
          </DroppableArea>
          <DroppableArea id="green" label="Green Zone" color="green">
            {areaGreen.map((id) => (
              <DraggableItem key={id} id={id} />
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndContext>
  );
}
