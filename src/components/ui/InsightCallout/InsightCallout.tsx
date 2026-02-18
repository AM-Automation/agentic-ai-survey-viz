import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface InsightCalloutProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'info' | 'warning';
  icon?: React.ReactNode;
}

const variantConfig = {
  primary: {
    bg: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
    border: '#A100FF',
    icon: '#A100FF',
  },
  success: {
    bg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    border: '#10B981',
    icon: '#10B981',
  },
  info: {
    bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    border: '#3B82F6',
    icon: '#3B82F6',
  },
  warning: {
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    border: '#F59E0B',
    icon: '#F59E0B',
  },
};

const CalloutWrapper = styled(motion.div)<{ variant: 'primary' | 'success' | 'info' | 'warning' }>`
  background: ${({ variant }) => variantConfig[variant].bg};
  border-left: 4px solid ${({ variant }) => variantConfig[variant].border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;

  /* Decorative corner accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Subtle pattern overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255, 255, 255, 0.1) 10px,
        rgba(255, 255, 255, 0.1) 20px
      );
    opacity: 0.3;
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;
`;

const IconWrapper = styled.div<{ variant: 'primary' | 'success' | 'info' | 'warning' }>`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ variant }) => variantConfig[variant].icon};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TextContent = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.gray[900]};

  strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.black};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray[800]};

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.spacing[3]};
    }
  }
`;

// Default icon (lightbulb)
const DefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

export const InsightCallout: React.FC<InsightCalloutProps> = ({
  children,
  variant = 'primary',
  icon,
}) => {
  return (
    <CalloutWrapper
      variant={variant}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <ContentWrapper>
        <IconWrapper variant={variant}>
          {icon || <DefaultIcon />}
        </IconWrapper>
        <TextContent>{children}</TextContent>
      </ContentWrapper>
    </CalloutWrapper>
  );
};
