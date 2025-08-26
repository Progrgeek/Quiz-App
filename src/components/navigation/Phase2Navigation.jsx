/**
 * Phase 2 Navigation Component
 * Quick access to all Day 13-16 implementations
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DEMO_ROUTES = [
  {
    path: '/',
    title: 'Main Quiz App',
    description: 'Original quiz application with enhanced features',
    status: 'live'
  },
  {
    path: '/migration-demo',
    title: 'Day 13-14: Universal Exercise Demo',
    description: 'Universal Exercise Component system showcase',
    status: 'complete'
  },
  {
    path: '/advanced-features',
    title: 'Day 15: Advanced Features',
    description: 'Auto-save, hints, bookmarks, pause/resume',
    status: 'complete'
  },
  {
    path: '/migration-testing',
    title: 'Day 16: Migration Testing',
    description: 'Comprehensive testing and performance benchmarks',
    status: 'complete'
  },
  {
    path: '/features-guide',
    title: '📚 Interactive Features Guide',
    description: 'Learn how to use all advanced features step-by-step',
    status: 'guide'
  }
];

export const Phase2Navigation = () => {
  const location = useLocation();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Phase 2 Implementation (Days 13-16)
      </h2>
      <p className="text-gray-600 mb-6">
        Navigate through all Phase 2 implementations and demos
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_ROUTES.map((route) => {
          const isActive = location.pathname === route.path;
          
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`block p-4 rounded-lg border-2 transition-all duration-200 ${
                isActive
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{route.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    route.status === 'complete'
                      ? 'bg-green-100 text-green-800'
                      : route.status === 'live'
                      ? 'bg-blue-100 text-blue-800'
                      : route.status === 'guide'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {route.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{route.description}</p>
              
              {isActive && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  Currently viewing →
                </div>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">✅ Phase 2 Complete!</h4>
        <p className="text-sm text-green-700">
          All Day 13-16 requirements have been successfully implemented with comprehensive 
          testing, performance optimization, and advanced features.
        </p>
      </div>
    </div>
  );
};

export default Phase2Navigation;
