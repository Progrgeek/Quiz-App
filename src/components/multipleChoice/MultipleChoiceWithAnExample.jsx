import ExampleSectionMultipleChoice from './ExampleSectionMultipleChoice';
import MultipleChoice from './MultipleChoice';
import exerciseData from './multipleChoiceData.json';

const MultipleChoiceWithAnExample = () => {
  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto pt-10">
        <ExampleSectionMultipleChoice data={exerciseData}>
          <MultipleChoice />
        </ExampleSectionMultipleChoice>
      </div>
    </div>
  );
};

export default MultipleChoiceWithAnExample;
