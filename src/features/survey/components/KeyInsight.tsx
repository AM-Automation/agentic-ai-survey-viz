import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface KeyInsightProps {
    text: string;
    type?: 'positive' | 'neutral' | 'important';
}

const InsightContainer = styled(motion.div) <{ $type: string }>`
  background: ${props =>
        props.$type === 'important' ? 'rgba(161, 0, 255, 0.1)' :
            props.$type === 'positive' ? 'rgba(16, 185, 129, 0.1)' :
                'rgba(255, 255, 255, 0.05)'};
  border-left: 3px solid ${props =>
        props.$type === 'important' ? 'var(--accent-primary)' :
            props.$type === 'positive' ? '#10B981' :
                'var(--text-muted)'};
  padding: 12px 16px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Icon = styled.div<{ $type: string }>`
  color: ${props =>
        props.$type === 'important' ? 'var(--accent-primary)' :
            props.$type === 'positive' ? '#10B981' :
                'var(--text-muted)'};
  font-size: 18px;
  flex-shrink: 0;
`;

const Text = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  font-weight: 500;
  
  strong {
    color: var(--text-primary);
    font-weight: 700;
  }
`;

export const KeyInsight: React.FC<KeyInsightProps> = ({ text, type = 'neutral' }) => {
    return (
        <InsightContainer
            $type={type}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
        >
            <Icon $type={type}>
                {type === 'important' ? '✦' : type === 'positive' ? '✓' : 'ℹ'}
            </Icon>
            <Text dangerouslySetInnerHTML={{ __html: text }} />
        </InsightContainer>
    );
};
