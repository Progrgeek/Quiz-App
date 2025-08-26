import ExampleSectionSyllable from './ExampleSectionSyllable';
import SyllableCounting from './SyllableCounting';
import exercisesData from './syllableCountingData.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalSyllableCounting = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionSyllable}
      exerciseData={exercisesData}
    >
      <SyllableCounting />
    </ExerciseWithExample>
  );
};

export default UniversalSyllableCounting;
