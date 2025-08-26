import ExampleSectionSingleAnswer from './ExampleSectionSingleAnswer';
import SingleAnswer from './SingleAnswer';
import exercisesData from './singleAnswerExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalSingleAnswer = () => {
  return (
    <ExerciseWithExample 
      ExampleComponent={ExampleSectionSingleAnswer}
      exerciseData={exercisesData}
    >
      <SingleAnswer />
    </ExerciseWithExample>
  );
};

export default UniversalSingleAnswer;
