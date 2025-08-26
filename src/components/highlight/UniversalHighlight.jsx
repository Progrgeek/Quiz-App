import HighlightExampleSection from './HighlightExampleSection';
import Highlight from './Highlight';
import exercisesData from './highlightExercises.json';
import ExerciseWithExample from '../../design-system/ExerciseWithExample';

const UniversalHighlight = () => {
  return (
    <ExerciseWithExample
      ExampleComponent={HighlightExampleSection}
      exerciseData={exercisesData}
    >
      <Highlight />
    </ExerciseWithExample>
  );
};

export default UniversalHighlight;
