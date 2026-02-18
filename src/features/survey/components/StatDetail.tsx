import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

interface StatDetailProps {
    label: string;
    value: string | number;
    info?: string;
}

const DetailContainer = styled.div`
  margin-top: 8px;
  font-size: 11px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const DetailBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: var(--text-muted);
`;

const Value = styled.span`
  color: var(--text-secondary);
  font-weight: 600;
`;

export const StatDetail: React.FC<StatDetailProps> = ({ label, value, info }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DetailContainer>
            <ToggleButton onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '− Hide Details' : '+ Show Details'}
            </ToggleButton>

            <AnimatePresence>
                {isOpen && (
                    <DetailBox
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <InfoRow>
                            <Label>{label}</Label>
                            <Value>{value}</Value>
                        </InfoRow>
                        {info && (
                            <div style={{ marginTop: '4px', opacity: 0.7, fontStyle: 'italic', fontWeight: 400 }}>
                                {info}
                            </div>
                        )}
                    </DetailBox>
                )}
            </AnimatePresence>
        </DetailContainer>
    );
};
