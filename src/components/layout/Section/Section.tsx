import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '../Container/Container';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  background?: 'white' | 'gray' | 'gradient';
  noPadding?: boolean;
}

const sectionBackgrounds = {
  white: 'transparent',
  gray: (theme: any) => theme.colors.gray[50],
  gradient: (theme: any) => theme.colors.gradients.subtle,
};

const SectionWrapper = styled.section<{ background: 'white' | 'gray' | 'gradient' }>`
  padding: ${({ theme }) => `${theme.spacing[20]} 0`};
  background: ${({ theme, background }) =>
    typeof sectionBackgrounds[background] === 'function'
      ? sectionBackgrounds[background](theme)
      : sectionBackgrounds[background]};
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => `${theme.spacing[12]} 0`};
  }
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing[8]};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.black};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.gray[600]};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const SectionContent = styled.div``;

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  title,
  subtitle,
  background = 'white',
  noPadding = false,
}) => {
  return (
    <SectionWrapper id={id} background={background}>
      <Container noPadding={noPadding}>
        {(title || subtitle) && (
          <SectionHeader
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {title && <SectionTitle>{title}</SectionTitle>}
            {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
          </SectionHeader>
        )}
        <SectionContent>{children}</SectionContent>
      </Container>
    </SectionWrapper>
  );
};
