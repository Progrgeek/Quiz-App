import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Card, Badge } from '../ui';
import { useContent } from '../../hooks/useContent';

/**
 * Universal Exercise Wrapper
 * Provides consistent layout and behavior for all exercise types using design system
 */
const ExerciseWrapper = ({ 
  children, 
  title, 
  instructions, 
  showExample = false,
  exampleContent = null,
  exerciseType = 'default',
  className = '',
  onComplete,
  isCompleted = false,
  progress = null
}) => {
  const { getContent } = useContent();

  return (
    <motion.div 
      className={`w-full max-w-6xl mx-auto p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="elevated" exerciseType={exerciseType} className="overflow-hidden">
        {/* Header Section */}
        {title && (
          <Card.Header className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <Badge variant="primary" className="capitalize">
                  {exerciseType.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </div>
              {isCompleted && (
                <Badge variant="success" icon={<span>✓</span>}>
                  {getContent('exercises', 'common', 'completed') || 'Complete'}
                </Badge>
              )}
            </div>
            
            {/* Progress Bar */}
            {progress !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </Card.Header>
        )}
        
        <Card.Content className="space-y-6">
          {/* Instructions Section */}
          {instructions && (
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  i
                </div>
                <p className="text-gray-700 leading-relaxed">{instructions}</p>
              </div>
            </motion.div>
          )}
          
          {/* Example Section */}
          {showExample && exampleContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="bordered" className="bg-yellow-50 border-yellow-200">
                <Card.Header className="bg-yellow-100 border-b border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                    <span className="text-yellow-600">💡</span>
                    {getContent('exercises', 'common', 'example') || 'Example'}
                  </h3>
                </Card.Header>
                <Card.Content className="text-yellow-900">
                  {exampleContent}
                </Card.Content>
              </Card>
            </motion.div>
          )}
          
          {/* Main Exercise Content */}
          <motion.div
            className="exercise-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

ExerciseWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  instructions: PropTypes.string,
  showExample: PropTypes.bool,
  exampleContent: PropTypes.node,
  exerciseType: PropTypes.string,
  className: PropTypes.string,
  onComplete: PropTypes.func,
  isCompleted: PropTypes.bool,
  progress: PropTypes.number
};

export default ExerciseWrapper;
