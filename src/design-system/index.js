// design-system/index.js - Enhanced design system entry point extending existing UI components
// Re-export existing UI components
export {
  Button,
  ButtonGroup,
  IconButton,
  Card,
  Input,
  Badge,
  Modal,
  Toast,
  ToastProvider,
  useToast,
  Spinner,
  LoadingOverlay,
  InlineLoader,
  Tooltip,
  Alert,
  InfoAlert,
  SuccessAlert,
  WarningAlert,
  ErrorAlert,
  AlertBanner,
  Select,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioCard,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  SimplePagination,
  FeedbackComponents,
  FormComponents,
  NavigationComponents,
  LayoutComponents
} from '../components/ui/index.js';

// Enhanced theme system
export { 
  ThemeProvider, 
  useTheme, 
  useThemeStyles, 
  useComponentTheme,
  themeUtils 
} from './theme/ThemeProvider.jsx';

// Enhanced design tokens (extending existing)
export { 
  tokens, 
  colors, 
  typography, 
  spacing,
  themes
} from './tokens/index.js';

// Re-export existing design tokens for compatibility
export { 
  tokens as existingTokens,
  components as existingComponents,
  animations as existingAnimations,
  themes as existingThemes
} from '../styles/tokens.js';

// Utility functions
export { cn, clsx, twMerge } from '../utils/classNames.js';
