/**
 * Universal Multiple Answers With Example Component
 * 
 * This component preserves the EXACT structure of MultipleAnswersWithAnExample.jsx
 * while using the new universal system underneath.
 * 
 * Key Features Preserved:
 * ✅ ExampleSection with "Learn with an example" functionality
 * ✅ Original wrapper styling and layout
 * ✅ Seamless integration with existing codebase
 */

import ExampleSectionMultipleAnswer from './ExampleSectionMultipleAnswer';
import UniversalMultipleAnswers from './UniversalMultipleAnswers';
import exercisesData from './multipleAnswersExercises.json';

const UniversalMultipleAnswersWithAnExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionMultipleAnswer data={exercisesData}>
          <UniversalMultipleAnswers />
        </ExampleSectionMultipleAnswer>
      </div>
    </div>
  );
};

export default UniversalMultipleAnswersWithAnExample;
