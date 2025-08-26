/**
 * Sequencing Exercise Renderer
 * Preserves exact functionality and UI from original Sequencing.jsx
 */

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortableItem = ({ id, content, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isSortableDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border-2 border-gray-300 rounded-lg p-4 mb-3 cursor-move
        transition-all duration-200 hover:border-blue-400 hover:shadow-md
        ${isSortableDragging ? 'opacity-75 scale-105 shadow-lg border-blue-500' : ''}
        ${isDragging ? 'touch-none select-none' : ''}
      `}
    >
      <p className="text-lg font-medium text-gray-800 text-center">
        {content}
      </p>
    </div>
  );
};

export const SequencingRenderer = ({ 
  universalData, 
  sequenceItems,
  setSequenceItems,
  sensors,
  activeId,
  setActiveId,
  onSubmit 
}) => {
  const { content } = universalData;
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    
    const dragElement = document.getElementById(event.active.id);
    if (dragElement) {
      dragElement.classList.add('touch-none', 'select-none', 'z-50');
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = sequenceItems.findIndex((item) => item.id === active.id);
    const overIndex = sequenceItems.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      setSequenceItems((items) => arrayMove(items, activeIndex, overIndex));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSequenceItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    const dragElement = document.getElementById(active.id);
    if (dragElement) {
      dragElement.classList.remove('touch-none', 'select-none', 'z-50');
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    if (activeId) {
      const dragElement = document.getElementById(activeId);
      if (dragElement) {
        dragElement.classList.remove('touch-none', 'select-none', 'z-50');
      }
    }

    setActiveId(null);
  };

  const checkAnswer = () => {
    // Create answer array in the order of current sequence
    const answer = sequenceItems.map(item => item.id);
    onSubmit(answer);
  };

  const hasItems = sequenceItems.length > 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Question */}
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.text.question}
      </h1>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          {content.text.instruction}
        </p>
      </div>

      {/* Sortable List */}
      <div className="max-w-2xl mx-auto mb-8">
        <SortableContext
          items={sequenceItems.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sequenceItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                content={item.content}
                isDragging={activeId === item.id}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Check Answer Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={checkAnswer}
          disabled={!hasItems}
          className="
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            disabled:from-gray-400 disabled:to-gray-500
            text-white font-semibold sm:py-4 py-2 px-10
            rounded-xl text-lg
            transform transition-all duration-200
            hover:-translate-y-1 hover:shadow-lg
            disabled:hover:translate-y-0
            disabled:hover:shadow-none
            disabled:cursor-not-allowed
            sm:w-auto mt-8
          "
        >
          Check Order
        </button>
      </div>
    </DndContext>
  );
};
