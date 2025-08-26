import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const ExampleItem = ({ title, words, pattern, soundClue, explanation, commonExamples, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-4"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
        {image && (
          <img src={image} alt={title} className="w-32 h-32 object-contain rounded-lg" />
        )}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {words && words.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {pattern && <p className="text-gray-700 font-medium">{pattern}</p>}
            {soundClue && <p className="text-blue-600 italic">{soundClue}</p>}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {explanation && <p className="text-gray-700">{explanation}</p>}
        {commonExamples && commonExamples.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-600">More examples: </span>
            <span className="text-sm text-gray-600">{commonExamples.join(", ")}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const UniversalExampleSection = ({ 
  children, 
  exerciseType, 
  exampleData,
  learnWithExamplesText = "Learn with Examples",
  backToPracticeText = "Back to Practice"
}) => {
  const [mode, setMode] = useState("practice");
  const [activeSection, setActiveSection] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "practice" ? "example" : "practice"));

  // Default example data if none provided
  const getDefaultExampleData = () => {
    const defaultExamples = {
      'multipleAnswers': {
        sections: [
          {
            title: "Sound Matching",
            description: "Learn to identify words with the same ending sounds.",
            examples: [
              {
                title: "Words ending in -eck",
                words: ["deck", "neck", "check"],
                pattern: "All these words end with the 'eck' sound",
                soundClue: "Listen for the /ek/ sound at the end",
                explanation: "These words rhyme because they have the same ending sound pattern.",
                commonExamples: ["beck", "peck", "speck", "wreck"]
              }
            ]
          },
          {
            title: "Synonyms",
            description: "Learn to identify words with similar meanings.",
            examples: [
              {
                title: "Words meaning 'big'",
                words: ["large", "huge", "enormous"],
                pattern: "All these words mean 'very big'",
                explanation: "Synonyms are words that have the same or similar meanings.",
                commonExamples: ["giant", "massive", "immense"]
              }
            ]
          }
        ]
      },
      'dragAndDrop': {
        sections: [
          {
            title: "Categorization",
            description: "Learn to group items by their characteristics.",
            examples: [
              {
                title: "Animals by Habitat",
                words: ["lion", "dolphin", "elephant", "shark"],
                pattern: "Some live on land, others in water",
                explanation: "Drag each animal to its correct habitat category.",
                commonExamples: ["tiger", "whale", "bear", "fish"]
              }
            ]
          }
        ]
      },
      'fillInBlanks': {
        sections: [
          {
            title: "Complete the Sentence",
            description: "Learn to identify missing words in sentences.",
            examples: [
              {
                title: "Action Words",
                pattern: "The cat is _____ on the mat.",
                explanation: "Think about what action the cat might be doing.",
                commonExamples: ["sitting", "sleeping", "lying", "resting"]
              }
            ]
          }
        ]
      },
      'gapFill': {
        sections: [
          {
            title: "Complete the Word",
            description: "Learn to fill in missing letters.",
            examples: [
              {
                title: "Common Words",
                pattern: "h_pp_",
                explanation: "Think about common vowels that complete this word.",
                commonExamples: ["happy", "hippo", "hoppy"]
              }
            ]
          }
        ]
      },
      'highlight': {
        sections: [
          {
            title: "Letter Recognition",
            description: "Learn to identify specific letters in words.",
            examples: [
              {
                title: "Finding Vowels",
                words: ["a", "e", "i", "o", "u"],
                pattern: "Vowels are the letters: a, e, i, o, u",
                explanation: "Click on each vowel letter in the word.",
                commonExamples: ["sometimes y"]
              }
            ]
          }
        ]
      },
      'sequencing': {
        sections: [
          {
            title: "Logical Order",
            description: "Learn to arrange phrases in correct sequence.",
            examples: [
              {
                title: "Daily Activities",
                words: ["Wake up", "Eat breakfast", "Go to work", "Come home"],
                pattern: "Think about the order of events during a day",
                explanation: "Arrange these activities in the order they typically happen.",
                commonExamples: ["brush teeth", "get dressed", "have lunch"]
              }
            ]
          }
        ]
      }
    };

    return defaultExamples[exerciseType] || defaultExamples['multipleAnswers'];
  };

  const currentExampleData = exampleData || getDefaultExampleData();

  const ExampleContent = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="bg-white p-2 sm:p-3 rounded-lg border-2 border-gray-200 mb-8">
        {currentExampleData.sections.length > 1 && (
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {currentExampleData.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeSection === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {currentExampleData.sections[activeSection].title}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentExampleData.sections[activeSection].description}
          </p>

          <div className="space-y-6">
            {currentExampleData.sections[activeSection].examples.map((example, index) => (
              <ExampleItem key={index} {...example} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {backToPracticeText}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div ref={sectionRef} className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-2 sm:shadow-lg lg:mx-8">
      <div className="w-auto">
        <AnimatePresence mode="wait">
          {mode === "practice" ? (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-center mb-6">
                <button
                  onClick={toggleMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ChevronDown className="w-5 h-5" />
                  {learnWithExamplesText}
                </button>
              </div>
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
    </div>
  );
};

UniversalExampleSection.propTypes = {
  children: PropTypes.node.isRequired,
  exerciseType: PropTypes.string.isRequired,
  exampleData: PropTypes.object,
  learnWithExamplesText: PropTypes.string,
  backToPracticeText: PropTypes.string,
};

export default UniversalExampleSection;
