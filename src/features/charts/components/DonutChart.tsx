import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface DonutChartData {
  id: string;
  label: string;
  value: number;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  height?: number;
  colors?: string[];
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 400,
  colors,
}) => {
  const theme = {
    labels: {
      text: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        fill: '#F0F0FF',
      },
    },
    legends: {
      text: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
        fill: '#8888AA',
      },
    },
  };

  const chartColors = colors || [
    '#A100FF',
    '#6366F1',
    '#EC4899',
    '#F59E0B',
    '#10B981',
    '#06B6D4',
    '#8B5CF6',
    '#F97316',
  ];

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 30, right: 120, bottom: 30, left: 30 }}
        innerRadius={0.6}
        padAngle={2}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        colors={chartColors}
        borderWidth={0}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#8888AA"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={15}
        arcLabelsTextColor="#F0F0FF"
        arcLabel={(d) => `${d.value.toFixed(1)}%`}
        animate={true}
        motionConfig="gentle"
        theme={theme}
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#8888AA',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 10,
            symbolShape: 'circle',
          },
        ]}
        tooltip={({ datum }) => (
          <div
            style={{
              background: '#1a1a3e',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: datum.color,
                }}
              />
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#F0F0FF',
                }}
              >
                {datum.label}
              </div>
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#8888AA',
                paddingLeft: '18px',
              }}
            >
              {datum.value.toFixed(1)}%
            </div>
          </div>
        )}
      />
    </div>
  );
};
