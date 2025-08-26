import PropTypes from 'prop-types';

const Stats = ({ questionNumber, totalQuestions, timeElapsed, score }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-auto rounded-lg shadow-sm mb-4 sm:mb-0">
      {/* Mobile View - Row Layout for Time, Questions, SmartScore */}
      <div className="bg-neutral-100 grid grid-cols-3 sm:hidden w-full pt-5 m-0">
        <div className="flex flex-col items-center w-full border-b-4 border-success-600">
          <p className="text-sm font-bold text-neutral-800 pb-2">Questions</p>
          <p className="text-lg font-semibold text-success-600 pb-2">
            {questionNumber} / {totalQuestions}
          </p>
        </div>

        {/* Time Elapsed Section */}
        <div className="flex flex-col items-center w-full border-b-4 border-primary-600">
          <p className="text-sm font-bold text-neutral-800 pb-2">Time</p>
          <p className="text-lg font-semibold text-primary-600 pb-2">
            {formatTime(timeElapsed)}
          </p>
        </div>

        {/* SmartScore Section */}
        <div className="flex flex-col items-center w-full border-b-4 border-warning-700">
          <p className="text-sm font-bold text-neutral-800 pb-2">SmartScore</p>
          <p className="text-lg font-semibold text-warning-700 pb-2">
            {Math.round(score)} / 100
          </p>
        </div>
      </div>

      {/* Desktop View - Vertical Layout */}
      <div className="hidden sm:flex flex-col items-center space-y-2 bg-neutral-100 border border-neutral-100 ml-5 rounded-lg w-auto">
        {/* Questions Answered Section */}
        <div className="flex flex-col items-center w-full">
          <p className="text-sm font-bold text-white px-2 py-1 w-full text-center bg-success-600">
            Questions<br />Answered
          </p>
          <p className="text-lg font-semibold mt-2 text-black flex items-center justify-center" style={{ height: '4rem', lineHeight: '4rem' }}>
            {questionNumber} / {totalQuestions}
          </p>
        </div>

        {/* Time Elapsed Section */}
        <div className="flex flex-col items-center w-full mt-4">
          <p className="text-sm font-bold text-white px-2 py-1 w-full text-center bg-primary-600">
            Time<br />Elapsed
          </p>
          <p className="text-lg font-semibold mt-2 text-black flex items-center justify-center" style={{ height: '4rem', lineHeight: '4rem' }}>
            {formatTime(timeElapsed)}
          </p>
        </div>

        {/* SmartScore Section */}
        <div className="flex flex-col items-center w-full mt-4">
          <p className="text-sm font-bold text-white px-2 py-1 w-full text-center bg-warning-600">
            SmartScore<br />Out of 100
          </p>
          <p className="text-lg font-semibold mt-2 text-black flex items-center justify-center" style={{ height: '4rem', lineHeight: '4rem' }}>
            {Math.round(score)} / 100
          </p>
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
