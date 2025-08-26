import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../ui';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { useContent } from '../../hooks/useContent';

/**
 * Universal Example Section Component
 * Shows examples for exercise types in a consistent format using design system
 */
const ExampleSection = ({ 
  title,
  content,
  isVisible = false,
  onToggle,
  className = '',
  variant = 'default', // 'default', 'highlighted', 'compact'
  exerciseType = 'general'
}) => {
  const { getContent } = useContent();
  
  if (!content) return null;

  const defaultTitle = title || getContent('exercises', 'common', 'example') || 'Example';

  const variantStyles = {
    default: {
      cardVariant: 'bordered',
      headerBg: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    },
    highlighted: {
      cardVariant: 'elevated',
      headerBg: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500'
    },
    compact: {
      cardVariant: 'flat',
      headerBg: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-500'
    }
  };

  const style = variantStyles[variant];

  return (
    <motion.div 
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant={style.cardVariant} className={`overflow-hidden ${style.borderColor}`}>
        {/* Toggle Header */}
        <Button
          variant="ghost"
          onClick={onToggle}
          className={`
            w-full justify-between p-4 h-auto rounded-none
            ${style.headerBg} hover:bg-opacity-80 transition-colors
            ${isVisible ? 'rounded-t-lg' : 'rounded-lg'}
          `}
          aria-expanded={isVisible}
          aria-controls="example-content"
        >
          <div className="flex items-center gap-3">
            <Lightbulb className={`w-5 h-5 ${style.iconColor}`} />
            <span className="font-medium text-gray-700">{defaultTitle}</span>
          </div>
          
          <motion.div
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
        </Button>
        
        {/* Example Content */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              id="example-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Card.Content className="p-4 pt-0">
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  {typeof content === 'string' ? (
                    <p className="text-gray-700 leading-relaxed">{content}</p>
                  ) : (
                    <div className="example-content-wrapper">
                      {content}
                    </div>
                  )}
                </div>
                
                {/* Helper text */}
                <motion.p 
                  className="text-sm text-gray-500 mt-3 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getContent('instructions', exerciseType, 'example') || 
                   getContent('instructions', 'general', 'example') || 
                   'This example shows you how to complete this type of exercise.'}
                </motion.p>
              </Card.Content>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

ExampleSection.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isVisible: PropTypes.bool,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'highlighted', 'compact']),
  exerciseType: PropTypes.string
};

export default ExampleSection;
