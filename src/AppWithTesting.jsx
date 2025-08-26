import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import IntegrationTest from './components/testing/IntegrationTest';
import { QuizEngineProvider } from './providers/QuizEngineProvider';

const AppWithTesting = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Quiz App
              </Link>
              <Link 
                to="/test" 
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Integration Test
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route 
            path="/test" 
            element={
              <QuizEngineProvider>
                <IntegrationTest />
              </QuizEngineProvider>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppWithTesting;
