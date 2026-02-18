/**
 * Accenture Design System Theme Configuration
 *
 * This theme captures Accenture's professional, forward-thinking brand identity
 * with their signature electric purple and sophisticated typography.
 */

export const accentureTheme = {
  colors: {
    // Primary Brand Colors
    primary: '#A100FF',        // Accenture Electric Purple
    primaryDark: '#8800CC',    // Hover/Active state
    primaryLight: '#C34BFF',   // Lighter variant

    // Neutrals
    black: '#000000',
    white: '#FFFFFF',

    // Purple Scale (for gradients and variations)
    purple: {
      50: '#F3E8FF',
      100: '#E9D5FF',
      200: '#D8B4FE',
      300: '#C084FC',
      400: '#A855F7',
      500: '#A100FF',   // Primary
      600: '#8B00E0',
      700: '#7600BC',
      800: '#5E0099',
      900: '#460074',
    },

    // Gray Scale
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Chart Colors (carefully curated for data visualization)
    chartColors: [
      '#A100FF', // Purple (primary)
      '#6366F1', // Indigo
      '#EC4899', // Pink
      '#F59E0B', // Amber
      '#10B981', // Green
      '#06B6D4', // Cyan
      '#8B5CF6', // Violet
      '#F97316', // Orange
    ],

    // Background Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #A100FF 0%, #6366F1 100%)',
      hero: 'linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
      purple: 'linear-gradient(135deg, #A100FF 0%, #460074 100%)',
      subtle: 'linear-gradient(180deg, rgba(161, 0, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
    },
  },

  typography: {
    // Font Families
    fontFamily: {
      primary: "'Graphik', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
      mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
    },

    // Font Sizes
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },

    // Font Weights
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    // Line Heights
    lineHeight: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.625,
      loose: 1.75,
      extraLoose: 2,
    },

    // Letter Spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    2: '0.5rem',      // 8px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
    40: '10rem',      // 160px
    48: '12rem',      // 192px
    56: '14rem',      // 224px
    64: '16rem',      // 256px
  },

  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },

  shadows: {
    xs: '0 1px 2px 0 rgba(161, 0, 255, 0.05)',
    sm: '0 1px 3px 0 rgba(161, 0, 255, 0.1), 0 1px 2px 0 rgba(161, 0, 255, 0.06)',
    base: '0 2px 8px rgba(161, 0, 255, 0.08)',
    md: '0 4px 6px -1px rgba(161, 0, 255, 0.1), 0 2px 4px -1px rgba(161, 0, 255, 0.06)',
    lg: '0 10px 15px -3px rgba(161, 0, 255, 0.1), 0 4px 6px -2px rgba(161, 0, 255, 0.05)',
    xl: '0 20px 25px -5px rgba(161, 0, 255, 0.1), 0 10px 10px -5px rgba(161, 0, 255, 0.04)',
    '2xl': '0 25px 50px -12px rgba(161, 0, 255, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(161, 0, 255, 0.06)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 4px 16px rgba(161, 0, 255, 0.12)',
    glow: '0 0 20px rgba(161, 0, 255, 0.3)',
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },
} as const;

export type Theme = typeof accentureTheme;

// TypeScript declaration for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
