import ExampleSectionRhyme from './ExampleSectionRhyme';
import RhymeExercises from './RhymeExercises';
import exercisesData from './rhymeExercisesData.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalRhymeExercises = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionRhyme}
      exerciseData={exercisesData}
    >
      <RhymeExercises />
    </ExerciseWithExample>
  );
};

export default UniversalRhymeExercises;
