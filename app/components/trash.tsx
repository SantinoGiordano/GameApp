import React from "react";
import { useDroppable } from "@dnd-kit/core";

const Trash = () => {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });

  return (
    <div
      ref={setNodeRef}
      className={`mt-6 p-6 border-4 border-dashed rounded-lg text-center transition-colors duration-200 ${
        isOver ? "bg-red-300 border-red-600" : "bg-red-100 border-red-500"
      }`}
    >
      <p className="text-red-700 font-bold text-lg">🗑 Drop Here to Delete</p>
    </div>
  );
};

export default Trash;

