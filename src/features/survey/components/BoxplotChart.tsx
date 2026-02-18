import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BoxplotData {
    label: string;
    min: number;
    max: number;
    q1: number;
    median: number;
    q3: number;
    outliers?: number[];
    n: number;
}

interface BoxplotChartProps {
    data: BoxplotData[];
    height?: string;
    maxScale?: number;
}

const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Axis = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 40px 0 120px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  gap: 12px;
`;

const Label = styled.div`
  width: 120px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlotArea = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
`;

const Box = styled(motion.div)`
  position: absolute;
  top: 10px;
  bottom: 10px;
  background: var(--accent-gradient);
  opacity: 0.3;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const MedianLine = styled(motion.div)`
  position: absolute;
  top: 5px;
  bottom: 5px;
  width: 2px;
  background: white;
  z-index: 2;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Whisker = styled(motion.div)`
  position: absolute;
  top: 50%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
`;

const WhiskerEnd = styled.div`
  position: absolute;
  top: 12px;
  bottom: 12px;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
`;

const Outlier = styled.div`
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-secondary);
  transform: translate(-50%, -50%);
  opacity: 0.5;
`;

export const BoxplotChart: React.FC<BoxplotChartProps> = ({ data, maxScale = 10 }) => {
    const getPos = (val: number) => (val / maxScale) * 100 + '%';

    return (
        <ChartWrapper>
            <Axis>
                {[0, 2.5, 5, 7.5, 10].map(v => <span key={v}>{v}</span>)}
            </Axis>
            {data.map((d, i) => (
                <Row key={i}>
                    <Label title={d.label}>{d.label}</Label>
                    <PlotArea>
                        {/* Whisker Left */}
                        <Whisker
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            style={{ left: getPos(d.min), width: `calc(${getPos(d.q1)} - ${getPos(d.min)})`, transformOrigin: 'left' }}
                        />
                        <WhiskerEnd style={{ left: getPos(d.min) }} />

                        {/* Whisker Right */}
                        <Whisker
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            style={{ left: getPos(d.q3), width: `calc(${getPos(d.max)} - ${getPos(d.q3)})`, transformOrigin: 'left' }}
                        />
                        <WhiskerEnd style={{ left: getPos(d.max) }} />

                        {/* Box (Q1 to Q3) */}
                        <Box
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 0.3, scaleX: 1 }}
                            style={{ left: getPos(d.q1), width: `calc(${getPos(d.q3)} - ${getPos(d.q1)})`, transformOrigin: 'left' }}
                        />

                        {/* Median */}
                        <MedianLine
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            style={{ left: getPos(d.median) }}
                        />

                        {/* Outliers */}
                        {d.outliers?.map((o, idx) => (
                            <Outlier key={idx} style={{ left: getPos(o) }} />
                        ))}
                    </PlotArea>
                </Row>
            ))}
        </ChartWrapper>
    );
};
