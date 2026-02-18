import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Font Face Declarations - Graphik (Accenture's brand font) */
  /* Note: Graphik is a commercial font. Using Inter as primary with similar metrics */
  @import url('https://rsms.me/inter/inter.css');

  /* CSS Reset & Base Styles */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.gray[900]};
    background: ${({ theme }) => theme.colors.white};
    overflow-x: hidden;

    /* Subtle background texture for depth */
    background-image:
      radial-gradient(circle at 20% 80%, ${({ theme }) => theme.colors.purple[50]} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${({ theme }) => theme.colors.purple[50]} 0%, transparent 50%);
    background-attachment: fixed;
  }

  /* Typography Scale */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};
    color: ${({ theme }) => theme.colors.black};
    margin: 0;
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.black};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};

    /* Accent underline effect */
    position: relative;
    padding-bottom: ${({ theme }) => theme.spacing[4]};

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 80px;
      height: 4px;
      background: ${({ theme }) => theme.colors.gradients.primary};
      border-radius: ${({ theme }) => theme.borderRadius.full};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  p {
    margin: 0;
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: all ${({ theme }) => theme.transitions.fast};
    position: relative;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 4px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 4px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }

  input, textarea, select {
    font-family: inherit;

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  /* Selection */
  ::selection {
    background: ${({ theme }) => theme.colors.purple[200]};
    color: ${({ theme }) => theme.colors.purple[900]};
  }

  /* Scrollbar Styling (Webkit) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    border: 2px solid ${({ theme }) => theme.colors.gray[100]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  /* Utility Classes */
  .gradient-text {
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Animation Keyframes */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  /* Print Styles */
  @media print {
    body {
      background: white;
    }

    * {
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a, a:visited {
      text-decoration: underline;
    }

    abbr[title]::after {
      content: " (" attr(title) ")";
    }

    pre, blockquote {
      border: 1px solid ${({ theme }) => theme.colors.gray[300]};
      page-break-inside: avoid;
    }

    thead {
      display: table-header-group;
    }

    tr, img {
      page-break-inside: avoid;
    }

    img {
      max-width: 100% !important;
    }

    p, h2, h3 {
      orphans: 3;
      widows: 3;
    }

    h2, h3 {
      page-break-after: avoid;
    }
  }

  /* Accessibility - Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
