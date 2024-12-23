import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Journey } from '../../../types';
import { colors } from '../../../styles/colors';

interface JourneyProgressChartProps {
  journey: Journey;
  data: Array<{ stage: string; count: number }>;
}

export function JourneyProgressChart({ journey, data }: JourneyProgressChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
          <XAxis 
            dataKey="stage" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: colors.neutral[600], fontSize: 12 }}
          />
          <YAxis tick={{ fill: colors.neutral[600] }} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '0.375rem',
            }}
          />
          <Bar 
            dataKey="count" 
            fill={colors.accent[500]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}