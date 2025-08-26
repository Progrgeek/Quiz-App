import ExampleTableSection from './ExampleTableSection';
import TableExercise from './TableExercise';
import exercisesData from './tableExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalTableExercise = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleTableSection}
      exerciseData={exercisesData}
    >
      <TableExercise />
    </ExerciseWithExample>
  );
};

export default UniversalTableExercise;
