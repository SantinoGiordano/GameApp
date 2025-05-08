'use client';
import React, { useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  rectIntersection,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';


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


function DroppableArea({
  id,
  label,
  color,
  children,
}: {
  id: string;
  label: string;
  color?: 'red' | 'green' | 'gray';
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });

  const base = 'border-dashed border-2 rounded p-4 min-h-[200px]';
  const colorClasses =
    color === 'red'
      ? 'border-red-500 bg-red-100'
      : color === 'green'
      ? 'border-green-500 bg-green-100'
      : 'border-gray-300 bg-gray-100';

  return (
    <div className={`${base} ${colorClasses}`} ref={setNodeRef}>
      <h2 className="text-center font-semibold text-gray-700 mb-2">{label}</h2>
      <div className="flex flex-wrap justify-center">{children}</div>
    </div>
  );
}


export default function HomePage() {
  const [areaRed, setAreaRed] = useState<string[]>([]);
  const [areaGreen, setAreaGreen] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const id = String(active.id);
    const target = over.id;

    // Remove from all zones
    setAreaRed((prev) => prev.filter((item) => item !== id));
    setAreaGreen((prev) => prev.filter((item) => item !== id));

    // Add to appropriate zone
    if (target === 'red') {
      setAreaRed((prev) => [...prev, id]);
    } else if (target === 'green') {
      setAreaGreen((prev) => [...prev, id]);
    }
    // If target is 'available', do nothing (it's already removed)
  };

  const allItems = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
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

        {/* Available Items */}
        <DroppableArea id="available" label="Available Items" color="gray">
          {availableItems.map((id) => (
            <DraggableItem key={id} id={id} />
          ))}
        </DroppableArea>

        {/* Drop Zones */}
        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center items-start text-center">

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
