import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

interface BarChartData {
  id: string;
  label: string;
  value: number;
  percentage?: number;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
  showPercentage?: boolean;
  valueFormat?: string;
  colors?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 400,
  layout = 'horizontal',
  showPercentage = true,
  valueFormat,
  colors,
}) => {
  const theme = {
    axis: {
      ticks: {
        text: {
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fill: '#8888AA',
        },
      },
    },
    grid: {
      line: {
        stroke: 'rgba(255, 255, 255, 0.06)',
        strokeWidth: 1,
      },
    },
    labels: {
      text: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        fill: '#F0F0FF',
      },
    },
  };

  const chartColors = colors || ['#A100FF'];

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="label"
        layout={layout}
        margin={
          layout === 'horizontal'
            ? { top: 10, right: 60, bottom: 40, left: 200 }
            : { top: 10, right: 20, bottom: 60, left: 50 }
        }
        padding={0.25}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={chartColors}
        borderRadius={6}
        axisTop={null}
        axisRight={null}
        axisBottom={
          layout === 'horizontal'
            ? {
              tickSize: 0,
              tickPadding: 8,
              format: showPercentage ? (v) => `${v}%` : valueFormat,
            }
            : {
              tickSize: 0,
              tickPadding: 8,
              tickRotation: -45,
            }
        }
        axisLeft={
          layout === 'horizontal'
            ? {
              tickSize: 0,
              tickPadding: 12,
            }
            : {
              tickSize: 0,
              tickPadding: 8,
              format: showPercentage ? (v) => `${v}%` : valueFormat,
            }
        }
        enableLabel={true}
        label={(d) => (showPercentage ? `${d.value.toFixed(1)}%` : String(d.value))}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#F0F0FF"
        animate={true}
        motionConfig="gentle"
        theme={theme}
        tooltip={({ indexValue, value, data }) => (
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
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F0F0FF',
                marginBottom: '4px',
              }}
            >
              {indexValue}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#8888AA',
              }}
            >
              {showPercentage ? `${value.toFixed(1)}%` : value}
              {data.percentage !== undefined && ` (${data.percentage.toFixed(1)}%)`}
            </div>
          </div>
        )}
      />
    </div>
  );
};
