import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface KPICardProps {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  delay?: number;
}

const CardWrapper = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  overflow: hidden;

  /* Gradient accent border */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.base};
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    transform: translateY(-4px);

    &::before {
      opacity: 1;
    }
  }

  /* Subtle background pattern */
  background-image:
    radial-gradient(circle at 100% 0%, ${({ theme }) => theme.colors.purple[50]} 0%, transparent 50%);
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.md};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Value = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.black};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  /* Number animation */
  @keyframes countUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  animation: countUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const Label = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: ${({ theme }) => theme.typography.lineHeight.snug};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const TrendContainer = styled.div<{ trend?: 'up' | 'down' | 'neutral' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, trend }) =>
    trend === 'up'
      ? theme.colors.success
      : trend === 'down'
      ? theme.colors.error
      : theme.colors.gray[500]};
`;

const TrendIcon = styled.span<{ trend?: 'up' | 'down' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, trend }) =>
    trend === 'up'
      ? theme.colors.success + '20'
      : trend === 'down'
      ? theme.colors.error + '20'
      : theme.colors.gray[200]};

  &::before {
    content: '${({ trend }) =>
      trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}';
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const KPICard: React.FC<KPICardProps> = ({
  value,
  label,
  trend,
  trendValue,
  icon,
  delay = 0,
}) => {
  return (
    <CardWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Value>{value}</Value>
      <Label>{label}</Label>
      {trend && trendValue && (
        <TrendContainer trend={trend}>
          <TrendIcon trend={trend} />
          <span>{trendValue}</span>
        </TrendContainer>
      )}
    </CardWrapper>
  );
};
