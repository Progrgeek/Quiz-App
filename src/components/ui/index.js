// UI Components Library
// Professional, accessible, and animated components for the Quiz App

export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
export { default as Modal } from './Modal';

// New Phase 1 Components
export { Toast, ToastProvider, useToast } from './Toast.jsx';
export { Spinner, LoadingOverlay, InlineLoader } from './Spinner.jsx';
export { Tooltip } from './Tooltip.jsx';
export { Alert, InfoAlert, SuccessAlert, WarningAlert, ErrorAlert, AlertBanner } from './Alert';

// Form Components
export { Select } from './Select';
export { Checkbox, CheckboxGroup } from './Checkbox';
export { Radio, RadioGroup, RadioCard } from './Radio';

// Navigation Components
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
export { Pagination, SimplePagination } from './Pagination';

// Import components for re-export and grouping
import { Toast, ToastProvider, useToast } from './Toast.jsx';
import { Spinner, LoadingOverlay, InlineLoader } from './Spinner.jsx';
import { Tooltip } from './Tooltip.jsx';
import { Alert, InfoAlert, SuccessAlert, WarningAlert, ErrorAlert, AlertBanner } from './Alert';
import { Select } from './Select';
import { Checkbox, CheckboxGroup } from './Checkbox';
import { Radio, RadioGroup, RadioCard } from './Radio';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { Pagination, SimplePagination } from './Pagination';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Modal from './Modal';
import Badge from './Badge';

// Component groups for easier imports
export const FeedbackComponents = {
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
};

export const FormComponents = {
  Button,
  Input,
  Select,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioCard,
};

export const NavigationComponents = {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  SimplePagination,
};

export const LayoutComponents = {
  Card,
  Modal,
  Badge,
};

// Design system utilities
export { tokens } from '../../styles/tokens.js';
export { components } from '../../styles/components.js';
export { animations } from '../../styles/animations.js';
export { themes } from '../../styles/themes.js';

// Theme system
export { ThemeProvider, useTheme, useComponentTheme } from '../../design-system/theme/ThemeProvider.jsx';

// Button variants
export { ButtonGroup, IconButton } from '../../design-system/components/Button.jsx';
