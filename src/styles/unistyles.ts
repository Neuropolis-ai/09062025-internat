export const theme = {
  colors: {
    // Фирменные цвета лицея
    primary: '#8B2439',
    primaryLight: '#A64B5F',
    primaryDark: '#6B1B2B',
    secondary: '#4D8061',
    secondaryLight: '#70A085',
    accent: '#E67E22',
    accentLight: '#F39C12',
    blue: '#2980B9',
    
    // Нейтральные цвета
    black: '#000000',
    charcoal: '#333333',
    gray: '#666666',
    lightGray: '#F5F5F5',
    ultraLight: '#FAFAFA',
    white: '#FFFFFF',
    divider: '#EEEEEE',
    
    // Семантические цвета
    success: '#27AE60',
    warning: '#F1C40F',
    error: '#E74C3C',
    info: '#3498DB',
  },
  typography: {
    fonts: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    sizes: {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      body: 16,
      bodySmall: 14,
      caption: 12,
    },
    lineHeights: {
      h1: 40,
      h2: 36,
      h3: 32,
      h4: 28,
      h5: 24,
      body: 24,
      bodySmall: 20,
      caption: 16,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    small: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  }
}

export type AppTheme = typeof theme 