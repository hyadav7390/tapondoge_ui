import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from '@/styles/theme';

// Create context
const ThemeContext = createContext();

// Theme provider component
export function ThemeProvider({ children }) {
  // Check for saved theme or use system preference
  const [currentTheme, setCurrentTheme] = useState('light');

  // Set theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme('dark');
    }
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
      
      // Apply theme colors as CSS variables
      const root = document.documentElement;
      const themeColors = themes[currentTheme].colors;
      
      for (const [key, value] of Object.entries(themeColors)) {
        root.style.setProperty(`--color-${key}`, value);
      }
    }
  }, [currentTheme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}