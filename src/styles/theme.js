// Your existing theme configuration with two themes
const lightTheme = {
  colors: {
    // Brand colors
    primary: '#0d6efd',
    secondary: '#6c757d',
    accent: '#0099ff',
    
    // Semantic colors
    success: '#198754',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#0dcaf0',
    
    // UI component colors
    background: '#f8f9fa',
    cardBg: '#ffffff',
    cardHeader: '#f8f9fa',
    border: '#dee2e6',
    shadow: 'rgba(0,0,0,0.1)',
    
    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textLight: '#ffffff',
    link: '#0d6efd',
    
    // Progress colors
    progressBar: '#0d6efd',
    progressBg: '#e9ecef',
  }
};

const darkTheme = {
  colors: {
    // Brand colors (keeping brand consistency)
    primary: '#0d6efd',
    secondary: '#6c757d',
    accent: '#00b7ff',
    
    // Semantic colors
    success: '#25a06e',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#0dcaf0',
    
    // UI component colors
    background: '#121212',
    cardBg: '#1e1e1e',
    cardHeader: '#2d2d2d',
    border: '#444444',
    shadow: 'rgba(0,0,0,0.5)',
    
    // Text colors
    textPrimary: '#e0e0e0',
    textSecondary: '#adb5bd',
    textLight: '#ffffff',
    link: '#63a7ff',
    
    // Progress colors
    progressBar: '#0d6efd',
    progressBg: '#2d2d2d',
  }
};

const themes = {
  light: lightTheme,
  dark: darkTheme
};

// CHANGE THIS VARIABLE TO SWITCH THEMES
const ACTIVE_THEME = 'light'; // Change to 'dark' to use dark theme

// Apply theme function with more robust implementation
export function applyTheme(themeName = ACTIVE_THEME) {
  // Make sure we're running in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  try {
    // Get the selected theme
    const selectedTheme = themes[themeName] || themes.light;
    
    const root = document.documentElement;
    document.body.classList.add('custom-theme');
    
    // Remove any previous theme classes
    document.body.classList.remove('theme-light', 'theme-dark');
    // Add current theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Apply theme colors as CSS variables
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply Bootstrap overrides directly
    root.style.setProperty('--bs-primary', selectedTheme.colors.primary);
    root.style.setProperty('--bs-secondary', selectedTheme.colors.secondary);
    root.style.setProperty('--bs-success', selectedTheme.colors.success);
    root.style.setProperty('--bs-info', selectedTheme.colors.info);
    root.style.setProperty('--bs-warning', selectedTheme.colors.warning);
    root.style.setProperty('--bs-danger', selectedTheme.colors.danger);
    root.style.setProperty('--bs-body-bg', selectedTheme.colors.background);
    root.style.setProperty('--bs-body-color', selectedTheme.colors.textPrimary);
    
    console.log(`Theme "${themeName}" successfully applied`);
  } catch (error) {
    console.error('Error applying theme:', error);
  }
}

// Export the themes and active theme name
export { ACTIVE_THEME };
export default themes;