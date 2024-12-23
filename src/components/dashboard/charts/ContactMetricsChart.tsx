import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Contact } from '../../../types';
import { colors } from '../../../styles/colors';

interface ContactMetricsChartProps {
  contacts: Contact[];
}

export function ContactMetricsChart({ contacts }: ContactMetricsChartProps) {
  const typeData = React.useMemo(() => {
    const types = contacts.reduce((acc, contact) => {
      acc[contact.type] = (acc[contact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [contacts]);

  const COLORS = [colors.ocean[500], colors.sage[500], colors.coral[500]];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={typeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {typeData.map((entry, index) => (
              <Cell 
                key={entry.name} 
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '0.375rem',
              padding: '0.5rem'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span className="text-sm text-neutral-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}