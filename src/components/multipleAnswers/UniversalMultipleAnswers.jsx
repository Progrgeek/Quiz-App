import ExampleSectionMultipleAnswer from './ExampleSectionMultipleAnswer';
import MultipleAnswers from './MultipleAnswers';
import exercisesData from './multipleAnswersExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalMultipleAnswers = () => {
  return (
    <ExerciseWithExample 
      ExampleComponent={ExampleSectionMultipleAnswer}
      exerciseData={exercisesData}
    >
      <MultipleAnswers />
    </ExerciseWithExample>
  );
};

export default UniversalMultipleAnswers;
