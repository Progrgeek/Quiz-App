import React, { useState } from 'react';
import Button from '../src/components/ui/Button.jsx';
import Card from '../src/components/ui/Card.jsx';
import Modal from '../src/components/ui/Modal.jsx';
import Alert from '../src/components/ui/Alert.jsx';
import Badge from '../src/components/ui/Badge.jsx';
import Input from '../src/components/ui/Input.jsx';
import Checkbox from '../src/components/ui/Checkbox.jsx';
import Radio from '../src/components/ui/Radio.jsx';
import Select from '../src/components/ui/Select.jsx';
import Tabs from '../src/components/ui/Tabs.jsx';
import Toast, { ToastProvider, useToast } from '../src/components/ui/Toast.jsx';
import Tooltip from '../src/components/ui/Tooltip.jsx';
import Spinner from '../src/components/ui/Spinner.jsx';
import Pagination from '../src/components/ui/Pagination.jsx';

export default {
  title: 'Quiz Examples/Complete Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive showcase of all UI components working together in real quiz scenarios.',
      },
    },
  },
};

// Complete Quiz Exercise Component
const QuizExerciseShowcase = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2,
      difficulty: 'easy'
    },
    {
      id: 2,
      type: 'multiple-select',
      question: 'Which of these are programming languages?',
      options: ['JavaScript', 'HTML', 'Python', 'CSS', 'Java'],
      correct: [0, 2, 4],
      difficulty: 'medium'
    },
    {
      id: 3,
      type: 'fill-blank',
      question: 'The React library was created by ___.',
      correct: 'Facebook',
      difficulty: 'hard'
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = () => {
    setShowResults(true);
    addToast({
      type: 'success',
      title: 'Quiz Submitted!',
      description: 'Your answers have been saved successfully.'
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    addToast({
      type: 'info',
      title: 'Quiz Reset',
      description: 'Starting fresh quiz attempt.'
    });
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Interactive Quiz Demo</h1>
          <div className="flex items-center gap-4">
            <Badge variant="primary">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge variant={currentQ.difficulty === 'easy' ? 'success' : currentQ.difficulty === 'medium' ? 'warning' : 'error'}>
              {currentQ.difficulty}
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Question Card */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
              
              {/* Multiple Choice */}
              {currentQ.type === 'multiple-choice' && (
                <Radio
                  name={`question-${currentQ.id}`}
                  options={currentQ.options.map((option, index) => ({
                    value: index,
                    label: option
                  }))}
                  value={answers[currentQ.id]}
                  onChange={(value) => handleAnswer(currentQ.id, value)}
                />
              )}

              {/* Multiple Select */}
              {currentQ.type === 'multiple-select' && (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <Checkbox
                      key={index}
                      label={option}
                      checked={answers[currentQ.id]?.includes(index) || false}
                      onChange={(checked) => {
                        const current = answers[currentQ.id] || [];
                        const updated = checked 
                          ? [...current, index]
                          : current.filter(i => i !== index);
                        handleAnswer(currentQ.id, updated);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Fill in the Blank */}
              {currentQ.type === 'fill-blank' && (
                <Input
                  placeholder="Enter your answer..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="max-w-md"
                />
              )}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="secondary"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </Button>

            <Tooltip content="View quiz instructions">
              <Button
                variant="ghost"
                onClick={() => setShowModal(true)}
              >
                Help
              </Button>
            </Tooltip>

            {currentQuestion < questions.length - 1 ? (
              <Button
                variant="primary"
                disabled={answers[currentQ.id] === undefined}
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="success"
                disabled={Object.keys(answers).length < questions.length}
                onClick={submitQuiz}
              >
                Submit Quiz
              </Button>
            )}
          </div>

          {/* Warning if incomplete */}
          {answers[currentQ.id] === undefined && (
            <Alert type="warning">
              Please select an answer before proceeding.
            </Alert>
          )}
        </>
      ) : (
        /* Results Section */
        <Card>
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Here are your results</p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.keys(answers).length}
                </div>
                <div className="text-sm text-blue-800">Questions Answered</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-green-800">Estimated Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2:45</div>
                <div className="text-sm text-purple-800">Time Taken</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="primary" onClick={resetQuiz}>
                Try Again
              </Button>
              <Button variant="secondary">
                View Detailed Results
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Help Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Quiz Instructions"
      >
        <div className="space-y-4">
          <Alert type="info">
            <strong>How to take this quiz:</strong>
          </Alert>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Answer each question by selecting the appropriate option</li>
            <li>Use the Next/Previous buttons to navigate</li>
            <li>You can change your answers before submitting</li>
            <li>Submit when you've answered all questions</li>
          </ul>
          <div className="pt-4">
            <Button variant="primary" onClick={() => setShowModal(false)} fullWidth>
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Student Dashboard Example
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);

  const recentQuizzes = [
    { id: 1, name: 'Math Basics', score: 85, status: 'completed', difficulty: 'easy' },
    { id: 2, name: 'Science Quiz', score: 92, status: 'completed', difficulty: 'medium' },
    { id: 3, name: 'History Test', score: null, status: 'in-progress', difficulty: 'hard' },
    { id: 4, name: 'Language Arts', score: 78, status: 'completed', difficulty: 'medium' },
  ];

  const achievements = [
    { name: 'Quick Learner', description: 'Complete 5 quizzes in one day', earned: true },
    { name: 'Perfect Score', description: 'Get 100% on any quiz', earned: true },
    { name: 'Consistent', description: 'Complete quizzes for 7 days straight', earned: false },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'quizzes', label: 'My Quizzes', icon: '📝' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Track your learning progress and achievements</p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        className="mb-8"
      />

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-gray-600">Quizzes Completed</div>
              <Badge variant="primary" className="mt-2">+3 this week</Badge>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
              <div className="text-gray-600">Average Score</div>
              <Badge variant="success" className="mt-2">Excellent!</Badge>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Achievements</div>
              <Badge variant="secondary" className="mt-2">2 new</Badge>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2 lg:col-span-3">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Quiz Activity</h3>
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        📝
                      </div>
                      <div>
                        <h4 className="font-medium">{quiz.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={quiz.difficulty === 'easy' ? 'success' : 
                                   quiz.difficulty === 'medium' ? 'warning' : 'error'}
                            size="sm"
                          >
                            {quiz.difficulty}
                          </Badge>
                          <Badge 
                            variant={quiz.status === 'completed' ? 'success' : 'warning'}
                            size="sm"
                          >
                            {quiz.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {quiz.score && (
                        <div className="text-lg font-semibold text-green-600">
                          {quiz.score}%
                        </div>
                      )}
                      <Button size="sm" variant="ghost">
                        {quiz.status === 'completed' ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className={achievement.earned ? 'ring-2 ring-yellow-400' : 'opacity-75'}>
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">
                  {achievement.earned ? '🏆' : '🔒'}
                </div>
                <h3 className="font-semibold mb-2">{achievement.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <Badge variant={achievement.earned ? 'success' : 'secondary'}>
                  {achievement.earned ? 'Earned' : 'Locked'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'math', label: 'Mathematics' },
                { value: 'science', label: 'Science' },
                { value: 'history', label: 'History' },
              ]}
              placeholder="Filter by category..."
              className="max-w-xs"
            />
            <Button variant="primary">
              Start New Quiz
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="font-semibold mb-2">{quiz.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={quiz.difficulty === 'easy' ? 'success' : 
                                   quiz.difficulty === 'medium' ? 'warning' : 'error'}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant={quiz.status === 'completed' ? 'success' : 'warning'}>
                      {quiz.status}
                    </Badge>
                  </div>
                  {quiz.score && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{quiz.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${quiz.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <Button variant="primary" size="sm" fullWidth>
                    {quiz.status === 'completed' ? 'Review Results' : 'Continue Quiz'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
            showFirstLast
            className="justify-center"
          />
        </div>
      )}
    </div>
  );
};

// Component Features Demo
const ComponentFeaturesDemo = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const { addToast } = useToast();

  const features = [
    { id: 'animations', label: 'Smooth Animations', description: 'Framer Motion powered' },
    { id: 'accessibility', label: 'Full Accessibility', description: 'WCAG 2.1 AA compliant' },
    { id: 'responsive', label: 'Responsive Design', description: 'Works on all devices' },
    { id: 'themes', label: 'Theme Support', description: 'Light/dark mode ready' },
    { id: 'typescript', label: 'TypeScript Ready', description: 'Full type safety' },
  ];

  const demoAction = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        title: 'Demo Complete!',
        description: 'All component features demonstrated successfully.'
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Component Features Demo</h1>
        <p className="text-gray-600 mb-6">
          Interactive demonstration of all component capabilities
        </p>
        
        <Alert type="info" className="mb-6">
          This showcase demonstrates real-world usage of our professional component library 
          in quiz and educational applications.
        </Alert>
      </div>

      {/* Feature Selection */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Features to Demonstrate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Checkbox
                key={feature.id}
                label={
                  <div>
                    <div className="font-medium">{feature.label}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
                }
                checked={selectedFeatures.includes(feature.id)}
                onChange={(checked) => {
                  setSelectedFeatures(prev =>
                    checked 
                      ? [...prev, feature.id]
                      : prev.filter(id => id !== feature.id)
                  );
                }}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button
          variant="primary"
          onClick={demoAction}
          loading={loading}
          disabled={selectedFeatures.length === 0}
        >
          Run Demo
        </Button>
        
        <Tooltip content="Clear all selections">
          <Button
            variant="secondary"
            onClick={() => setSelectedFeatures([])}
            disabled={selectedFeatures.length === 0}
          >
            Reset
          </Button>
        </Tooltip>

        <Button
          variant="ghost"
          onClick={() => addToast({
            type: 'info',
            title: 'Help',
            description: 'Select features above and click Run Demo to see them in action.'
          })}
        >
          Help
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-600">Demonstrating selected features...</p>
          </div>
        </div>
      )}

      {/* Selected Features Display */}
      {selectedFeatures.length > 0 && !loading && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Selected Features</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((featureId) => {
                const feature = features.find(f => f.id === featureId);
                return (
                  <Badge key={featureId} variant="primary">
                    {feature?.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Wrap components with ToastProvider
const WrappedQuizShowcase = () => (
  <ToastProvider>
    <QuizExerciseShowcase />
  </ToastProvider>
);

const WrappedDashboard = () => (
  <ToastProvider>
    <StudentDashboard />
  </ToastProvider>
);

const WrappedFeaturesDemo = () => (
  <ToastProvider>
    <ComponentFeaturesDemo />
  </ToastProvider>
);

// Export stories
export const CompleteQuizExperience = {
  render: WrappedQuizShowcase,
  parameters: {
    docs: {
      description: {
        story: 'A complete quiz-taking experience showcasing navigation, form inputs, progress tracking, and user feedback.',
      },
    },
  },
};

export const StudentDashboardExample = {
  render: WrappedDashboard,
  parameters: {
    docs: {
      description: {
        story: 'Student dashboard showing quiz history, achievements, and progress tracking with multiple components working together.',
      },
    },
  },
};

export const ComponentFeaturesShowcase = {
  render: WrappedFeaturesDemo,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of component features including animations, accessibility, and user interactions.',
      },
    },
  },
};
