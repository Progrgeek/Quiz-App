// utils/classNames.js - Utility for conditional class names
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

export function clsx(...classes) {
  return cn(...classes);
}

// Tailwind merge utility (simplified version)
export function twMerge(...classes) {
  // For now, just use cn - in a full implementation you'd want tailwind-merge library
  return cn(...classes);
}

export default cn;
