import ExampleSectionFill from './ExampleSectionFill';
import FillInTheBlanks from './FillInTheBlanks';
import exercisesData from './fillnTheBlanksExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalFillInTheBlanks = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionFill}
      exerciseData={exercisesData}
    >
      <FillInTheBlanks />
    </ExerciseWithExample>
  );
};

export default UniversalFillInTheBlanks;
