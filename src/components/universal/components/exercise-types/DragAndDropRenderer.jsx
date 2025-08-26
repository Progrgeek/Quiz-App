/**
 * Drag and Drop Exercise Renderer
 * Preserves exact functionality and UI from original DragAndDrop.jsx
 */

import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import DraggableItem from '../../../dragAndDrop/DraggableItem';
import DroppableZone from '../../../dragAndDrop/DroppableZone';

export const DragAndDropRenderer = ({ 
  universalData, 
  categoryItems, 
  setCategoryItems,
  movedItems, 
  setMovedItems,
  sensors,
  onSubmit 
}) => {
  const { content } = universalData;
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    const draggedItemId = active.id;

    if (!over) {
      // Remove item from categories if dropped outside
      let sourceCategory = null;
      Object.entries(categoryItems).forEach(([category, items]) => {
        if (items.some((item) => item.id === draggedItemId)) {
          sourceCategory = category;
        }
      });

      if (sourceCategory) {
        setCategoryItems(prev => ({
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(item => item.id !== draggedItemId)
        }));
        setMovedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(draggedItemId);
          return newSet;
        });
      }
      return;
    }

    const targetCategory = over.id;
    const draggedItem = content.elements.draggableItems.find(item => item.id === draggedItemId);

    if (!draggedItem) return;

    // Remove from source category
    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === draggedItemId)) {
        sourceCategory = category;
      }
    });

    if (sourceCategory) {
      setCategoryItems(prev => ({
        ...prev,
        [sourceCategory]: prev[sourceCategory].filter(item => item.id !== draggedItemId)
      }));
    }

    // Add to target category
    setCategoryItems(prev => ({
      ...prev,
      [targetCategory]: [...(prev[targetCategory] || []), draggedItem]
    }));

    setMovedItems(prev => new Set(prev).add(draggedItemId));
  };

  const handleResetItem = (itemId, category) => {
    setCategoryItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
    setMovedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const checkAnswers = () => {
    // Create answer object in expected format
    const answer = {};
    Object.entries(categoryItems).forEach(([category, items]) => {
      answer[category] = items.map(item => item.id);
    });
    onSubmit(answer);
  };

  const placedItems = new Set(
    Object.values(categoryItems)
      .flat()
      .map((item) => item.id)
  );

  const getAllPlacedItems = () => {
    return Object.values(categoryItems).flat().length;
  };

  const hasAnswers = getAllPlacedItems() === content.elements.draggableItems.length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* Question */}
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.text.question}
      </h1>

      {/* Draggable Items Grid */}
      <div className="grid grid-cols-2 px-5 gap-4 sm:gap-6 mb-8 w-full sm:px-10">
        {content.elements.draggableItems.map((item) => {
          const isPlaced = placedItems.has(item.id);
          return isPlaced ? (
            <div
              key={`placed-${item.id}`}
              className="p-3 rounded-md text-center h-10 w-full max-w-64 mx-auto bg-gray-200 text-gray-400"
            >
              <span></span>
            </div>
          ) : (
            <div
              key={`unplaced-${item.id}`}
              className={`transform transition-all duration-300 hover:-translate-y-1 ${
                movedItems.has(item.id) ? "scale-105" : ""
              } w-full`}
            >
              <DraggableItem
                id={item.id}
                content={item.content}
                type={item.type || "text"}
                label={item.label}
              />
            </div>
          );
        })}
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 gap-2 sm:gap-8 w-full px-2">
        <div className="flex flex-row gap-3 sm:gap-8 w-full">
          {content.elements.dropZones.map((zone) => (
            <DroppableZone
              key={zone.id}
              id={zone.id}
              label={zone.label}
              items={categoryItems[zone.id] || []}
              onResetItem={handleResetItem}
            />
          ))}
        </div>
      </div>

      {/* Check Answer Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={checkAnswers}
          disabled={!hasAnswers}
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
          Check Answer
        </button>
      </div>
    </DndContext>
  );
};
