import React, { createContext, useContext, useState, useEffect } from 'react';

const MobileContext = createContext();

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [touchSupport, setTouchSupport] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // Breakpoints
  const breakpoints = {
    mobile: 640,   // sm
    tablet: 768,   // md
    desktop: 1024  // lg
  };

  // Detect device capabilities
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Touch support detection
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;
      setTouchSupport(hasTouch);

      // Viewport size
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });

      // Device type detection
      setIsMobile(width < breakpoints.mobile);
      setIsTablet(width >= breakpoints.mobile && width < breakpoints.desktop);
      setIsDesktop(width >= breakpoints.desktop);

      // Orientation detection
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    checkDeviceCapabilities();

    const handleResize = () => {
      checkDeviceCapabilities();
    };

    const handleOrientationChange = () => {
      setTimeout(checkDeviceCapabilities, 100); // Delay for orientation change
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Touch gesture helpers
  const touchGestureProps = {
    onTouchStart: (e) => {
      // Add touch feedback
      e.currentTarget.style.transform = 'scale(0.95)';
    },
    onTouchEnd: (e) => {
      // Remove touch feedback
      setTimeout(() => {
        e.currentTarget.style.transform = 'scale(1)';
      }, 150);
    }
  };

  // Mobile-optimized props
  const getMobileOptimizedProps = (component = 'button') => {
    const baseProps = {
      style: {
        minHeight: '44px',
        minWidth: '44px',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }
    };

    if (touchSupport) {
      return {
        ...baseProps,
        ...touchGestureProps
      };
    }

    return baseProps;
  };

  // Responsive class helper
  const getResponsiveClasses = (mobileClass, tabletClass, desktopClass) => {
    const classes = [];
    
    if (mobileClass) classes.push(`sm:${mobileClass}`);
    if (tabletClass) classes.push(`md:${tabletClass}`);
    if (desktopClass) classes.push(`lg:${desktopClass}`);
    
    return classes.join(' ');
  };

  // Safe area helper for notched devices
  const getSafeAreaProps = () => ({
    style: {
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }
  });

  // Performance helpers for mobile
  const optimizeForMobile = {
    // Lazy loading
    lazyLoadProps: {
      loading: 'lazy',
      decoding: 'async'
    },
    
    // Reduce animations on mobile
    animationProps: isMobile ? {
      transition: 'none',
      animation: 'none'
    } : {},
    
    // Touch-friendly spacing
    touchSpacing: isMobile ? 'p-4' : 'p-2'
  };

  const value = {
    // Device state
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    touchSupport,
    viewport,
    breakpoints,
    
    // Helpers
    getMobileOptimizedProps,
    getResponsiveClasses,
    getSafeAreaProps,
    touchGestureProps,
    optimizeForMobile,
    
    // Device detection
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    isSmallScreen: viewport.width < breakpoints.mobile,
    isMediumScreen: viewport.width >= breakpoints.mobile && viewport.width < breakpoints.desktop,
    isLargeScreen: viewport.width >= breakpoints.desktop
  };

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  );
};
