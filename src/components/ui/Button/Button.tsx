import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.gradients.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.md};

    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.shadows.lg};
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  `,

  secondary: css`
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[900]};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[200]};
      border-color: ${({ theme }) => theme.colors.gray[300]};
    }
  `,

  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.purple[50]};
      border-color: ${({ theme }) => theme.colors.primaryDark};
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  `,

  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.gray[700]};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[100]};
      color: ${({ theme }) => theme.colors.gray[900]};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    gap: ${({ theme }) => theme.spacing[2]};
  `,

  md: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    gap: ${({ theme }) => theme.spacing[2]};
  `,

  lg: css`
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    gap: ${({ theme }) => theme.spacing[3]};
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'md' }) => sizeStyles[size]}
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Ripple effect on click */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transform: scale(0);
    transition: transform ${({ theme }) => theme.transitions.slow}, opacity ${({ theme }) => theme.transitions.slow};
  }

  &:active:not(:disabled)::after {
    transform: scale(1);
    opacity: 1;
    transition: 0s;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}
            {children}
            {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
          </>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
