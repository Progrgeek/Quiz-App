import { useContent } from '../context/ContentContext.jsx';

/**
 * Re-export the main useContent hook for convenience
 */
export { useContent } from '../context/ContentContext.jsx';

/**
 * Custom hook for accessing translated content
 * @param {string} section - The section of content (e.g., 'navigation', 'buttons')
 * @param {string} key - The specific key within the section
 * @param {Object} variables - Variables to interpolate in the text
 * @returns {string} The translated text
 */
export const useContentText = (section, key, variables = {}) => {
  const { getContent } = useContent();
  return getContent(section, key, variables);
};

/**
 * Hook for navigation text
 */
export const useNavigationText = (key, variables = {}) => {
  return useContentText('navigation', key, variables);
};

/**
 * Hook for button text
 */
export const useButtonText = (key, variables = {}) => {
  return useContentText('buttons', key, variables);
};

/**
 * Hook for label text
 */
export const useLabelText = (key, variables = {}) => {
  return useContentText('labels', key, variables);
};

/**
 * Hook for message text
 */
export const useMessageText = (key, variables = {}) => {
  return useContentText('messages', key, variables);
};

/**
 * Hook for exercise text
 */
export const useExerciseText = (key, variables = {}) => {
  return useContentText('exercises', key, variables);
};

/**
 * Hook for feedback text
 */
export const useFeedbackText = (key, variables = {}) => {
  return useContentText('feedback', key, variables);
};

/**
 * Hook for instruction text
 */
export const useInstructionText = (key, variables = {}) => {
  return useContentText('instructions', key, variables);
};

/**
 * Hook for tooltip text
 */
export const useTooltipText = (section, key, variables = {}) => {
  return useContentText('tooltips', section, variables);
};

/**
 * Hook for accessibility text
 */
export const useAccessibilityText = (key, variables = {}) => {
  return useContentText('accessibility', key, variables);
};

/**
 * Hook for placeholder text
 */
export const usePlaceholderText = (key, variables = {}) => {
  return useContentText('placeholders', key, variables);
};

export default useContentText;
