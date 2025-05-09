"use client";

import React, { useState, useEffect } from "react";
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
import Recall from "./components/recall";
import Trash from "./components/trash";

function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: "transform 0s ease",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-3 m-2 bg-blue-400 text-white font-semibold border border-blue-600 rounded-lg shadow-md cursor-grab hover:bg-blue-500 active:scale-95 transition-transform duration-150"
    >
      Item {id}
    </div>
  );
}

function DroppableArea({
  id,
  label,
  color,
  children,
}: {
  id: string;
  label: string;
  color?: "red" | "green" | "gray";
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const base = "border-dashed border-4 rounded-lg p-6 min-h-[200px] w-full";
  const colorClasses =
    color === "red"
      ? `border-red-400 ${isOver ? "bg-red-200" : "bg-red-100"}`
      : color === "green"
      ? `border-green-400 ${isOver ? "bg-green-200" : "bg-green-100"}`
      : `border-gray-400 ${isOver ? "bg-gray-200" : "bg-gray-100"}`;

  return (
    <div className={`${base} ${colorClasses} transition-all`} ref={setNodeRef}>
      <h2 className="text-center font-bold text-gray-700 mb-4 text-lg">
        {label}
      </h2>
      <div className="flex flex-wrap justify-center">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [areaRed, setAreaRed] = useState<string[]>([]);
  const [areaGreen, setAreaGreen] = useState<string[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );
  
  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = over.id;

    setAreaRed((prev) => prev.filter((item) => item !== id));
    setAreaGreen((prev) => prev.filter((item) => item !== id));

    if (target === "red") {
      setAreaRed((prev) => [...prev, id]);
    } else if (target === "green") {
      setAreaGreen((prev) => [...prev, id]);
    } else if (target === "trash") {
      setDeletedItems((prev) => [...prev, id]);
    }
  };

  const handleRecall = () => {
    setAreaRed([]);
    setAreaGreen([]);
    setDeletedItems([]);
  };

  const allItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const assigned = new Set([...areaRed, ...areaGreen]);
  const availableItems = allItems.filter(
    (id) => !assigned.has(id) && !deletedItems.includes(id)
  );

  if (!mounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-5xl mx-auto mt-10 p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Drag Items Into Color Zones or Trash
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Recall onRecall={handleRecall} />
          <Trash />
        </div>

        <DroppableArea id="available" label="Available Items" color="gray">
          {availableItems.map((id) => (
            <DraggableItem key={id} id={id} />
          ))}
        </DroppableArea>

        <div className="flex flex-col md:flex-row gap-6 mt-6 justify-center items-start">
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
