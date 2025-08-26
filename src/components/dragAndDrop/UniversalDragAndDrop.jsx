import ExampleSectionDrag from './exampleSectionDrag';
import DragAndDrop from './DragAndDrop';
import exercisesData from './data/dragAndDropExercises.json';

const UniversalDragAndDrop = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <ExampleSectionDrag data={exercisesData}>
          <DragAndDrop />
        </ExampleSectionDrag>
      </div>
    </div>
  );
};

export default UniversalDragAndDrop;
