import ExampleSectionGapFill from './ExampleSectionGapFill';
import GapFill from './GapFill';
import exercisesData from './gapFillExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalGapFill = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionGapFill}
      exerciseData={exercisesData}
    >
      <GapFill />
    </ExerciseWithExample>
  );
};

export default UniversalGapFill;
