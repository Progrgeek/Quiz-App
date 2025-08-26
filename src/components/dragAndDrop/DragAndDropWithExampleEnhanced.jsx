import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';
import { ExerciseWrapper } from '../shared';
import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exerciseData from './data/dragAndDropExercises.json';
import { useContent } from '../../hooks/useContent';

const DragAndDropWithExampleEnhanced = () => {
  const { getContent } = useContent();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <ExerciseWrapper
          title={getContent('exercises', 'dragAndDrop', 'title') || 'Drag and Drop Exercise'}
          instructions={getContent('exercises', 'dragAndDrop', 'instruction') || 'Drag items to the correct locations'}
          exerciseType="dragAndDrop"
          className="mb-6"
        >
          <Card variant="elevated" className="overflow-hidden">
            <Card.Content className="p-0">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 border-b border-gray-200">
                <ExampleSectionDrag data={exerciseData}>
                  <div className="mt-6">
                    <DragAndDrop />
                  </div>
                </ExampleSectionDrag>
              </div>
            </Card.Content>
          </Card>
        </ExerciseWrapper>
      </div>
    </motion.div>
  );
};

export default DragAndDropWithExampleEnhanced;
