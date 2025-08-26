import ExampleSectionSequencing from './ExampleSectionSequencing';
import Sequencing from './Sequencing';
import exercisesData from './sequencingExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalSequencing = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionSequencing}
      exerciseData={exercisesData}
    >
      <Sequencing />
    </ExerciseWithExample>
  );
};

export default UniversalSequencing;
