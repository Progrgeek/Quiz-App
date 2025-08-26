import ExampleSectionMultipleChoice from './ExampleSectionMultipleChoice';
import MultipleChoice from './MultipleChoice';
import exercisesData from './multipleChoiceData.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalMultipleChoice = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={ExampleSectionMultipleChoice}
      exerciseData={exercisesData}
    >
      <MultipleChoice />
    </ExerciseWithExample>
  );
};

export default UniversalMultipleChoice;
