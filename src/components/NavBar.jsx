import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LanguageSwitcher from "./common/LanguageSwitcher";
import { useNavigationText } from "../hooks/useContent";

const Navbar = () => {
  const [isLanguagesDropdownOpen, setIsLanguagesDropdownOpen] = useState(false);
  const [isDemosDropdownOpen, setIsDemosDropdownOpen] = useState(false);

  // Get translated text
  const languagesText = useNavigationText('languages');
  const dragAndDropText = useNavigationText('dragAndDrop');
  const fillInTheBlanksText = useNavigationText('fillInTheBlanks');
  const gapFillText = useNavigationText('gapFill');
  const highlightText = useNavigationText('highlight');
  const clickToChangeText = useNavigationText('clickToChange');
  const singleAnswerText = useNavigationText('singleAnswer');
  const multipleAnswersText = useNavigationText('multipleAnswers');
  const sequencingText = useNavigationText('sequencing');
  const organizeInformationText = useNavigationText('organizeInformation');
  const aboutText = useNavigationText('about');
  const contactText = useNavigationText('contact');

  // Toggle dropdown visibility
  const handleLanguagesDropdownToggle = () => {
    setIsLanguagesDropdownOpen((prev) => !prev);
    setIsDemosDropdownOpen(false); // Close other dropdown
  };

  const handleDemosDropdownToggle = () => {
    setIsDemosDropdownOpen((prev) => !prev);
    setIsLanguagesDropdownOpen(false); // Close other dropdown
  };

  // Close dropdown when clicking outside
  const handleLanguagesDropdownClose = () => {
    setIsLanguagesDropdownOpen(false);
  };

  const handleDemosDropdownClose = () => {
    setIsDemosDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Quiz App</h1>

        {/* Navigation Menu */}
        <ul className="flex items-center gap-6">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg font-semibold transition duration-300"
            >
              🏠 Home
            </Link>
          </li>

          {/* Demos Dropdown */}
          <li className="relative">
            <button
              onClick={handleDemosDropdownToggle}
              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-3 py-2 rounded-lg font-semibold transition duration-300"
            >
              🚀 Demos
              {isDemosDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/* Demos Dropdown Menu */}
            {isDemosDropdownOpen && (
              <ul
                className="absolute mt-2 bg-white text-black shadow-lg rounded-lg w-64 z-50 max-h-96 overflow-y-auto"
                onMouseLeave={handleDemosDropdownClose}
                onBlur={handleDemosDropdownClose}
              >
                {/* Schema & Universal Tests */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b">
                  🧪 Core Tests
                </li>
                <li>
                  <Link
                    to="/"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧪 Schema Test
                  </Link>
                </li>
                <li>
                  <Link
                    to="/universal-demo"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🚀 Universal Demo
                  </Link>
                </li>

                {/* Analytics Demos - Phase 3 */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b border-t">
                  📊 Analytics (Phase 3)
                </li>
                <li>
                  <Link
                    to="/analytics-demo"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    📊 Analytics Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/storage-demo"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    💾 Storage Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/realtime-demo"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    ⚡ Real-Time Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/phase3-summary"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    📈 Phase 3 Summary
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analytics-dashboard"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧠 Advanced Analytics
                  </Link>
                </li>

                {/* Gamification Demos - Phase 4 */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b border-t">
                  🎮 Gamification (Phase 4)
                </li>
                <li>
                  <Link
                    to="/gamification-dashboard"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🎮 Gamification Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/social-dashboard"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    👥 Social Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/streaks-dashboard"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🔥 Streaks & Habits
                  </Link>
                </li>
                <li>
                  <Link
                    to="/phase4-summary"
                    className="block px-4 py-2 hover:bg-green-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🌟 Phase 4 Summary
                  </Link>
                </li>

                {/* AI & Personalization - Phase 5 */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b border-t">
                  🤖 AI & Personalization (Phase 5)
                </li>
                <li>
                  <Link
                    to="/ai-analytics"
                    className="block px-4 py-2 hover:bg-indigo-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧠 AI Analytics Dashboard
                  </Link>
                </li>

                {/* Platform Scaling & Excellence - Phase 6 */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b border-t">
                  🚀 Platform Scaling & Excellence (Phase 6)
                </li>
                <li>
                  <Link
                    to="/enterprise-architecture"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🏢 Enterprise Architecture Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/internationalization"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🌐 Internationalization Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advanced-analytics"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    📊 Advanced Analytics Hub
                  </Link>
                </li>
                <li>
                  <Link
                    to="/performance-monitoring"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    ⚡ Performance Monitoring
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user-behavior"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    👤 User Behavior Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ab-testing"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧪 A/B Testing Framework
                  </Link>
                </li>
                <li>
                  <Link
                    to="/phase6-integration-test"
                    className="block px-4 py-2 hover:bg-purple-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🚀 Phase 6 Integration Test
                  </Link>
                </li>

                {/* Other Demos */}
                <li className="px-4 py-2 bg-gray-100 font-semibold text-sm text-gray-700 border-b border-t">
                  🔧 Development Demos
                </li>
                <li>
                  <Link
                    to="/ai-demo"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🤖 AI Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/migration-demo"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🔄 Migration Demo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advanced-features"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    ⚡ Advanced Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features-guide"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    📖 Features Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/migration-testing"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧪 Migration Testing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/simple-test"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    ⚡ Simple Test
                  </Link>
                </li>
                <li>
                  <Link
                    to="/universal-test"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🔬 Universal Test
                  </Link>
                </li>
                <li>
                  <Link
                    to="/responsive-test"
                    className="block px-4 py-2 hover:bg-yellow-100 transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    📱 Responsive Test
                  </Link>
                </li>
                <li>
                  <Link
                    to="/comprehensive-test"
                    className="block px-4 py-2 hover:bg-yellow-100 rounded-b-lg transition duration-300"
                    onClick={handleDemosDropdownClose}
                  >
                    🧪 Integration Test
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Languages Dropdown */}
          <li className="relative">
            <button
              onClick={handleLanguagesDropdownToggle}
              className="flex items-center gap-1 hover:underline focus:outline-none"
            >
              {languagesText}
              {isLanguagesDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/* Languages Dropdown Menu */}
            {isLanguagesDropdownOpen && (
              <ul
                className="absolute mt-2 bg-white text-black shadow-lg rounded-lg w-48 z-50"
                onMouseLeave={handleLanguagesDropdownClose}
                onBlur={handleLanguagesDropdownClose}
              >
                <li>
                  <Link
                    to="/drag-and-drop"
                    className="block px-4 py-2 hover:bg-blue-100 rounded-t-lg transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {dragAndDropText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fill-in-the-blanks"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {fillInTheBlanksText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gap-fill"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {gapFillText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/highlight"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {highlightText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/click-to-change"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {clickToChangeText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/single-answer"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {singleAnswerText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/multiple-answers"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {multipleAnswersText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sequencing"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {sequencingText}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/organize-information-by-topic"
                    className="block px-4 py-2 hover:bg-blue-100 rounded-b-lg transition duration-300"
                    onClick={handleLanguagesDropdownClose}
                  >
                    {organizeInformationText}
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Language Switcher */}
          <li>
            <LanguageSwitcher />
          </li>

          {/* About Link */}
          <li>
            <Link
              to="/about"
              className="hover:underline hover:text-gray-200 px-4 py-2 transition duration-300"
            >
              {aboutText}
            </Link>
          </li>

          {/* Contact Link */}
          <li>
            <Link
              to="/contact"
              className="hover:underline hover:text-gray-200 px-4 py-2 transition duration-300"
            >
              {contactText}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
