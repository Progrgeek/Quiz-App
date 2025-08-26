import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const IncorrectMultipleChoiceFeedback = ({ currentExercise, selectedAnswer, onGotIt }) => {
  const correctOption = currentExercise.correctAnswer;
  const selectedOption = selectedAnswer;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center space-x-2 text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
          <h3 className="text-lg font-bold">Not quite right!</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Your answer:</strong> {selectedOption}
            </p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Correct answer:</strong> {correctOption}
            </p>
          </div>
          
          {currentExercise.hint && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Hint:</strong> {currentExercise.hint}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={onGotIt}
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Got it!
        </button>
      </div>
    </motion.div>
  );
};

IncorrectMultipleChoiceFeedback.propTypes = {
  currentExercise: PropTypes.shape({
    question: PropTypes.string.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    hint: PropTypes.string
  }).isRequired,
  selectedAnswer: PropTypes.string.isRequired,
  onGotIt: PropTypes.func.isRequired
};

export default IncorrectMultipleChoiceFeedback;
