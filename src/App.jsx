import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ContentProvider } from "./context/ContentContext.jsx";
import { PerformanceProvider } from "./performance/PerformanceMonitor.jsx";
import { ThemeProvider } from "./design-system/index.js";
import { AccessibilityProvider } from "./design-system/AccessibilitySystem.jsx";
import QuizEngineProvider from "./providers/QuizEngineProvider.jsx";
import AnalyticsProvider from "./providers/AnalyticsProvider.jsx";
import GamificationProvider from "./providers/GamificationProvider.jsx";
import Navbar from "./components/NavBar";
import DragAndDropWithExample from "./components/dragAndDrop/DragAndDropWithAnExample";
import FillInTheBlanksWithExample from "./components/fillInTheBlanks/FillInTheBlanksWithAnExample";
import GapFillWithExample from "./components/gapFill/GapFillWithAnExample";
import HighlightWithExample from "./components/highlight/HighlightWithAnExample";
import ClickToChangeWithExample from "./components/clickToChange/ClickToChangeWithAnExample";
import SingleAnswerWithExample from "./components/singleAnswer/SingleAnswerWithAnExample";
import MultipleAnswerWithExample from "./components/multipleAnswers/MultipleAnswersWithAnExample";
import SequencingWithExample from "./components/sequencing/SequincingWithAnExample";
import TableExercisesWithAnExample from "./components/tableExercise/TableExercisesWithAnExample";
import { UniversalExerciseDemo } from "./components/exercises";
import ResponsiveTest from "./components/ResponsiveTest";
import UniversalSchemaTest from "./components/UniversalSchemaTest";
import SimpleTest from "./components/SimpleTest";
import AIAnalyticsDemo from "./components/demo/AIAnalyticsDemo";
import MigrationDemo from "./components/demo/MigrationDemo";
import AdvancedFeaturesDemo from "./components/demo/AdvancedFeaturesDemo";
import MigrationTestingDemo from "./components/demo/MigrationTestingDemo";
import AdvancedFeaturesGuide from "./components/demo/AdvancedFeaturesGuide";
import AnalyticsDemo from "./components/demo/AnalyticsDemo";
import DesignSystemDemo from "./components/demo/DesignSystemDemo";
import EnhancedDesignSystemDemo from "./components/demo/EnhancedDesignSystemDemo";
import StorageDemo from "./components/analytics/StorageDemo";
import RealTimeDemo from './components/analytics/RealTimeDemo';
import Phase3Summary from './components/analytics/Phase3Summary';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import GamificationDashboard from './components/gamification/GamificationDashboard';
import { SocialDashboard } from './components/gamification/social/SocialDashboard';
import { StreaksHabitsDashboard } from './components/gamification/streaks/StreaksHabitsDashboard';
import Phase4Summary from './components/gamification/Phase4Summary';
import AIAnalyticsDashboard from './components/ai/AIAnalyticsDashboard';
import EnterpriseArchitectureDashboard from './components/enterprise/EnterpriseArchitectureDashboard';
import InternationalizationDashboard from './components/i18n/InternationalizationDashboard';
import AdvancedAnalyticsDashboard from './components/analytics/AdvancedAnalyticsDashboard';
import PerformanceMonitoringDashboard from './components/analytics/PerformanceMonitoringDashboard';
import UserBehaviorAnalysis from './components/analytics/UserBehaviorAnalysis';
import ABTestingFramework from './components/analytics/ABTestingFramework';
import Phase6IntegrationTest from './components/demo/Phase6IntegrationTest';
import ComprehensiveUniversalTest from './components/universal/ComprehensiveUniversalTest';
import OriginalExerciseComponents from './components/OriginalExerciseComponents';
import TestUniversalIntegration from './components/TestUniversalIntegration';
import TestUnifiedData from './components/TestUnifiedData';
import UnifiedDataTest from './components/test/UnifiedDataTest';
import MobileAccessibilityDemo from './components/demo/MobileAccessibilityDemo';
import IntegrationTestComponent from './components/integration/IntegrationTestComponent';
import EnhancedExerciseDemo from './components/demo/EnhancedExerciseDemo';
import IntegrationStatusPage from './components/demo/IntegrationStatusPage';
import ExerciseIntegrationRouter from './components/integration/ExerciseIntegrationRouter';

const App = () => {
  return (
    <PerformanceProvider>
      <AnalyticsProvider>
        <GamificationProvider>
          <QuizEngineProvider>
            <ThemeProvider>
              <AccessibilityProvider>
                <ContentProvider>
                  <BrowserRouter>
              <div className=" sm:min-h-screen  sm:bg-gradient-to-br from-blue-500 via-blue-300 to-green-300">
                <Navbar />
                  <Routes>
                    <Route path="/" element={<OriginalExerciseComponents />} />
                    <Route path="/integration-router" element={<ExerciseIntegrationRouter />} />
                    <Route path="/unified-data-test" element={<TestUnifiedData />} />
                    <Route path="/integration-test" element={<TestUniversalIntegration />} />
                    <Route path="/universal-test" element={<ComprehensiveUniversalTest />} />
                    <Route path="/original-home" element={<UniversalSchemaTest />} />
                    <Route path="/ai-demo" element={<AIAnalyticsDemo />} />
                    <Route path="/migration-demo" element={<MigrationDemo />} />
                    <Route path="/advanced-features" element={<AdvancedFeaturesDemo />} />
                    <Route path="/features-guide" element={<AdvancedFeaturesGuide />} />
                    <Route path="/migration-testing" element={<MigrationTestingDemo />} />
                    <Route path="/analytics-demo" element={<AnalyticsDemo />} />
                    <Route path="/design-system" element={<DesignSystemDemo />} />
                    <Route path="/enhanced-design-system" element={<EnhancedDesignSystemDemo />} />
                    <Route path="/mobile-accessibility" element={<MobileAccessibilityDemo />} />
                    <Route path="/integration-bridge-test" element={<IntegrationTestComponent />} />
                    <Route path="/enhanced-exercise-demo" element={<EnhancedExerciseDemo />} />
                    <Route path="/integration-status" element={<IntegrationStatusPage />} />
                    <Route path="/real-integration" element={<ExerciseIntegrationRouter />} />
                    <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                    <Route path="/gamification-dashboard" element={<GamificationDashboard />} />
                    <Route path="/social-dashboard" element={<SocialDashboard />} />
                    <Route path="/streaks-dashboard" element={<StreaksHabitsDashboard />} />
                    <Route path="/phase4-summary" element={<Phase4Summary />} />
                    <Route path="/ai-analytics" element={<AIAnalyticsDashboard />} />
                    
                    {/* Phase 6 Advanced Analytics & Performance Monitoring */}
                    <Route 
                      path="/advanced-analytics" 
                      element={<AdvancedAnalyticsDashboard />} 
                    />
                    <Route 
                      path="/performance-monitoring" 
                      element={<PerformanceMonitoringDashboard />} 
                    />
                    <Route 
                      path="/user-behavior" 
                      element={<UserBehaviorAnalysis />} 
                    />
                    <Route 
                      path="/ab-testing" 
                      element={<ABTestingFramework />} 
                    />
                    <Route 
                      path="/phase6-integration-test" 
                      element={<Phase6IntegrationTest />} 
                    />
                    <Route 
                      path="/phase6-test" 
                      element={<Phase6IntegrationTest />} 
                    />
                    
                    {/* Enterprise Architecture Dashboard */}
                    <Route 
                      path="/enterprise-architecture" 
                      element={<EnterpriseArchitectureDashboard />} 
                    />
                    
                    {/* Internationalization Dashboard */}
                    <Route 
                      path="/internationalization" 
                      element={<InternationalizationDashboard />} 
                    />
                    <Route path="/storage-demo" element={<StorageDemo />} />
                    <Route path="/realtime-demo" element={<RealTimeDemo />} />
                    <Route path="/phase3-summary" element={<Phase3Summary />} />
                    <Route path="/simple-test" element={<SimpleTest />} />
                    <Route path="/universal-demo" element={<UniversalExerciseDemo />} />
                    <Route path="/universal-test" element={<UniversalSchemaTest />} />
                    <Route path="/comprehensive-test" element={<ComprehensiveUniversalTest />} />
                    <Route path="/drag-and-drop" element={<DragAndDropWithExample />} />
                    <Route path="/fill-in-the-blanks" element={<FillInTheBlanksWithExample />} />
                    <Route path="/gap-fill" element={<GapFillWithExample />} />
                    <Route path="/highlight" element={<HighlightWithExample />} />
                    <Route path="/click-to-change" element={<ClickToChangeWithExample />} />
                    <Route path="/single-answer" element={<SingleAnswerWithExample />} />
                    <Route path="/multiple-answers" element={<MultipleAnswerWithExample />} />
                    <Route path="/sequencing" element={<SequencingWithExample />} />
                    <Route path="/organize-information-by-topic" element={<TableExercisesWithAnExample />} />
                    <Route path="/responsive-test" element={<ResponsiveTest />} />
                  </Routes>
              </div>
            </BrowserRouter>
          </ContentProvider>
        </AccessibilityProvider>
      </ThemeProvider>
      </QuizEngineProvider>
        </GamificationProvider>
      </AnalyticsProvider>
    </PerformanceProvider>
  );
};

export default App;