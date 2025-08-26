import PropTypes from 'prop-types';
import { Clock, Target, Trophy } from 'lucide-react';

const Stats = ({ questionNumber, totalQuestions, timeElapsed, score }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-gray-800">
                {questionNumber}/{totalQuestions}
              </div>
              <div className="text-xs text-gray-600">Questions</div>
            </div>
            <div>
              <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-gray-800">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div>
              <Trophy className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-gray-800">
                {Math.round(score)}
              </div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 w-48">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Progress</h3>
            
            <div className="space-y-4">
              {/* Questions Counter */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Questions</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {questionNumber} / {totalQuestions}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}% Complete</div>
              </div>

              {/* Time Counter */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Time</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatTime(timeElapsed)}
                </div>
                <div className="text-xs text-gray-500">Elapsed</div>
              </div>

              {/* Score Counter */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Score</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(score)}
                </div>
                <div className="text-xs text-gray-500">Out of 100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Stats.propTypes = {
  questionNumber: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  timeElapsed: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
};

export default Stats;
