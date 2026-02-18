import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface Insight {
  title: string;
  description: string;
  stat: string;
  label: string;
  color: string;
}

interface ExecutiveSummaryProps {
  insights: Insight[];
}

const SummaryContainer = styled.section`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 24px;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const InsightCard = styled(motion.div) <{ $color: string }>`
  padding: 40px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$color};
    opacity: 0.7;
  }
`;

const StatValue = styled.div<{ $color: string }>`
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${props => props.$color};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
`;

const InsightTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const InsightDesc = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.9;
`;

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ insights }) => {
  return (
    <SummaryContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '80px' }}
      >
        <StatLabel>Key Findings</StatLabel>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, marginTop: '12px', marginBottom: '8px' }}>
          Science-Backed Insights
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
          Automatische Analyse basierend auf Inferenzstatistik, Variable Importance und Clustering-Algorithmen.
        </p>
      </motion.div>

      <InsightGrid>
        {insights.map((insight, idx) => (
          <InsightCard
            key={idx}
            $color={insight.color}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <StatValue $color={insight.color}>{insight.stat}</StatValue>
            <StatLabel>{insight.label}</StatLabel>
            <InsightTitle>{insight.title}</InsightTitle>
            <InsightDesc dangerouslySetInnerHTML={{ __html: insight.description }} />
          </InsightCard>
        ))}
      </InsightGrid>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Explore Full Dashboard</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </ScrollIndicator>
    </SummaryContainer>
  );
};
