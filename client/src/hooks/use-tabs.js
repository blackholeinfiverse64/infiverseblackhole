import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to manage tab state with proper debouncing and cleanup
 * Prevents stuck screens when switching between tabs rapidly
 * 
 * @param {string} defaultTab - The default tab value
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 200)
 * @returns {object} - Tab state and handlers
 */
export function useTabs(defaultTab, debounceMs = 200) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced tab change handler
  const handleTabChange = useCallback((newTab) => {
    // Prevent rapid switching
    if (isTransitioning) {
      return;
    }

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set transitioning state
    setIsTransitioning(true);

    // Update tab immediately for UI responsiveness
    setActiveTab(newTab);

    // Reset transitioning state after debounce period
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setIsTransitioning(false);
      }
    }, debounceMs);
  }, [isTransitioning, debounceMs]);

  // Reset to default tab
  const resetTab = useCallback(() => {
    handleTabChange(defaultTab);
  }, [defaultTab, handleTabChange]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    resetTab,
    isTransitioning,
  };
}
