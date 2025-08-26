import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

const MultipleAnswersRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback,
  onAudioPlay,
  onSubmit
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState(userAnswers?.selectedAnswers || []);
  const [isPlaying, setIsPlaying] = useState(false);

  // Early return if data is not ready
  if (!universalData || !universalData.content) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading exercise...</div>
      </div>
    );
  }

  const { content, presentation } = universalData;
  const options = content?.elements?.options || [];
  const isImageBased = options.some(opt => opt.type === 'image');

  const handleOptionSelect = (optionId) => {
    const newSelectedAnswers = selectedAnswers.includes(optionId)
      ? selectedAnswers.filter(id => id !== optionId)
      : [...selectedAnswers, optionId];
    
    setSelectedAnswers(newSelectedAnswers);
    onAnswerChange?.({ selectedAnswers: newSelectedAnswers });
  };

  const speak = async (text, options = {}) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.onend = resolve;
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const playAllAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      for (const option of options) {
        const textToSpeak = typeof option.content === 'string' ? option.content : 
                          (option.content?.content || option.label || 'Option');
        await speak(textToSpeak, { rate: 0.8, pitch: 1 });
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className={presentation?.styles?.container || "relative bg-white pt-2 sm:pt-3 px-1 sm:px-2 min-h-[500px] w-full"}>
      {/* Question */}
      {content?.text?.question && (
        <div className={presentation?.styles?.question || "text-lg sm:text-xl font-bold text-green-600 mb-6 text-center"}>
          {content.text.question}
        </div>
      )}

      {/* Instruction */}
      {content?.text?.instruction && (
        <div className="text-base sm:text-lg text-gray-700 mb-8 text-center">
          {content.text.instruction}
        </div>
      )}

      {/* Question and Audio Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 w-full">
        {content?.elements?.media?.audio?.length > 0 && (
          <button
            onClick={playAllAudio}
            disabled={isPlaying}
            className={`
              flex items-center px-6 py-3 rounded-lg bg-blue-50 text-blue-500 text-lg
              ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}
            `}
          >
            <Volume2 className="w-6 h-6" />
            <span className="ml-2 whitespace-nowrap">Listen to all</span>
          </button>
        )}
      </div>

      {/* Options Grid - Enhanced for better width and height */}
      <div className={`
        grid gap-6 mb-12 w-full max-w-full mx-auto min-h-[400px]
        ${isImageBased 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}
      `}>
        {options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);
          const optionContent = typeof option.content === 'string' ? option.content : 
                               (option.content?.content || option.label || 'Option');
          
          if (option.type === 'image') {
            return (
              <div 
                key={option.id}
                className={`
                  min-h-[120px] sm:min-h-[150px] cursor-pointer transition-all duration-200 bg-white rounded-xl shadow-sm
                  ${!isAnswered ? 'hover:shadow-lg hover:scale-105' : 'cursor-default'}
                  ${isSelected ? 'ring-4 ring-blue-400 bg-blue-50' : 'border-2 border-gray-200'}
                  ${showFeedback && isSelected && isCorrect ? 'ring-green-400 bg-green-50' : ''}
                  ${showFeedback && isSelected && !isCorrect ? 'ring-red-400 bg-red-50' : ''}
                  flex flex-col items-center justify-center p-4
                `}
                onClick={() => !isAnswered && handleOptionSelect(option.id)}
              >
                <div className="w-full h-20 sm:h-24 mb-3 flex items-center justify-center">
                  <img 
                    src={option.image || '/images/placeholder.png'} 
                    alt={optionContent}
                    className="max-w-full max-h-full object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className="hidden w-full h-full bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm"
                  >
                    Image not found
                  </div>
                </div>
                <span className="text-center text-sm sm:text-base font-medium text-gray-800 leading-tight">
                  {optionContent}
                </span>
              </div>
            );
          } else {
            return (
              <div 
                key={option.id}
                className={`
                  min-h-[80px] sm:min-h-[100px] cursor-pointer transition-all duration-200 bg-white rounded-xl shadow-sm
                  ${!isAnswered ? 'hover:shadow-lg hover:scale-105' : 'cursor-default'}
                  ${isSelected ? 'ring-4 ring-blue-400 bg-blue-50' : 'border-2 border-gray-200'}
                  ${showFeedback && isSelected && isCorrect ? 'ring-green-400 bg-green-50' : ''}
                  ${showFeedback && isSelected && !isCorrect ? 'ring-red-400 bg-red-50' : ''}
                  flex items-center justify-center p-4 sm:p-6
                `}
                onClick={() => !isAnswered && handleOptionSelect(option.id)}
              >
                <span className="text-center text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
                  {optionContent}
                </span>
              </div>
            );
          }
        })}
      </div>

      {/* Selection Instructions */}
      <div className="text-center text-gray-600 text-base mb-8">
        {selectedAnswers.length === 0 && (
          <p>Select {content?.solution?.requiredSelections || 'the correct'} answer{(content?.solution?.requiredSelections || 1) > 1 ? 's' : ''}</p>
        )}
        {selectedAnswers.length > 0 && selectedAnswers.length < (content?.solution?.requiredSelections || 1) && (
          <p>Select {(content?.solution?.requiredSelections || 1) - selectedAnswers.length} more answer{((content?.solution?.requiredSelections || 1) - selectedAnswers.length) > 1 ? 's' : ''}</p>
        )}
        {selectedAnswers.length === (content?.solution?.requiredSelections || 1) && !showFeedback && (
          <p className="text-green-600 font-semibold">Ready to submit!</p>
        )}
      </div>

      {/* Submit Button */}
      {!showFeedback && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => onSubmit?.({ selectedAnswers })}
            disabled={selectedAnswers.length !== (content?.solution?.requiredSelections || 1)}
            className="
              w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 
              disabled:to-gray-500 text-white font-semibold py-2 sm:py-3 
              px-6 sm:px-8 rounded-lg text-sm sm:text-base transform 
              transition-all duration-200 hover:-translate-y-1 
              hover:shadow-lg disabled:hover:translate-y-0 
              disabled:hover:shadow-none disabled:cursor-not-allowed 
              mx-2 sm:mx-0
            "
          >
            Check Answer ({selectedAnswers.length}/{content?.solution?.requiredSelections || 1} selected)
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleAnswersRenderer;
