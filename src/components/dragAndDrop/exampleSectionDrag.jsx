import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useButtonText } from "../../hooks/useContent";

const ExamplePracticeSection = ({ children, data }) => {
  const [mode, setMode] = useState("practice");
  const sectionRef = useRef(null);
  
  // Use content hooks for text
  const learnWithExampleText = "Learn with an Example";
  const backToPracticeText = "Back to Practice";

  const toggleMode = () => {
    console.log("Toggle clicked, current mode:", mode);
    setMode((prev) => (prev === "practice" ? "example" : "practice"));
  };

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  const ExampleItem = ({ text }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg  sm:p-3 shadow-sm sm:border sm:border-gray-200"
    >
      {text}
    </motion.div>
  );

  ExampleItem.propTypes = {
    text: PropTypes.string.isRequired,
  };

  const ExampleContent = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden max-w-4xl mx-auto"
    >
      <div className="bg-white p-6 sm:mt-14 rounded-lg border-2 border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {data.sensoryExercise.question}
        </h2>
        <p className="text-gray-600 mb-6">
          Here&apos;s an example of how sensory details can be categorized by the sense they appeal to.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-2  lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(data.sensoryExercise.categories).map(([category, items]) => (
            <div
              key={category}
              className="border-2 rounded-lg transition-colors  duration-200 border-blue-300 bg-white"
            >
              <div className="text-gray-700 font-medium text-center  py-3 border-b-2 border-blue-300">
                <span className="capitalize">{category}</span>
                <span className="ml-2 text-sm text-gray-500 ">({items.length} items)</span>
              </div>
              <div className="min-h-[200px] p-4 space-y-3 ">
                <AnimatePresence>
                  {items.map((item) => (
                    <ExampleItem key={item.id} text={item.content} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Learning Points:</h3>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Each category represents one of our five senses
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Notice how specific details help create vivid mental images
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Good writing often combines multiple sensory details
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              These details make descriptions more engaging and memorable
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
        <p className="text-gray-700 mb-6">
          When you write, you can use <strong>sensory details</strong> to make stories and scenes easier for the reader to imagine. A sensory detail makes the reader imagine a particular sight, sound, smell, taste, or touch.
        </p>

        {Object.entries(data.sensoryExamples).map(([sense, details]) => (
          <div key={sense} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 capitalize mb-3">
              {sense}:
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 sm:px-4 py-2 text-left border border-gray-200 w-1/2">
                      Example
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left border border-gray-200 w-1/2">
                      Explanation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-2 sm:px-4 py-2 border border-gray-200 text-sm sm:text-xs break-words">
                        <strong>{detail.key}</strong>
                      </td>
                      <td className="px-2 sm:px-4 py-2 border border-gray-200 text-sm sm:text-xs break-words">
                        {detail.solution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto">

      <button
        onClick={toggleMode}
        className="flex items-center w-auto px-4 py-2 mx-auto  mb-8 lg:-mb-10 md:-mb-10 text-lg font-medium text-blue-500 border-b-2 border-b-blue-500 transition-colors cursor-pointer"
        style={{
          justifyContent: "space-between",
          position: "relative",
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.9)"
        }}
        type="button"
      >
        {mode === "practice" ? learnWithExampleText : backToPracticeText}
        {mode === "practice" ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>


      <AnimatePresence mode="wait">
        {mode === "practice" ? (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="example"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ExampleContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ExamplePracticeSection.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.shape({
    sensoryExamples: PropTypes.object.isRequired,
    sensoryExercise: PropTypes.object.isRequired,
  }).isRequired,
};

export default ExamplePracticeSection;
