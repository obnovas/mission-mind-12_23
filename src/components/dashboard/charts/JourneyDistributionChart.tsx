import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Contact } from '../../../types';
import { colors } from '../../../styles/colors';

interface JourneyDistributionChartProps {
  contacts: Contact[];
}

export function JourneyDistributionChart({ contacts }: JourneyDistributionChartProps) {
  const data = React.useMemo(() => {
    const distribution = contacts.reduce((acc, contact) => {
      const journeyCount = contact.journeys?.length || 0;
      acc[journeyCount] = (acc[journeyCount] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(distribution).map(([journeys, count]) => ({
      name: journeys === '0' ? 'No Journeys' : `${journeys} Journey${Number(journeys) > 1 ? 's' : ''}`,
      value: count,
    }));
  }, [contacts]);

  const COLORS = [
    colors.ocean[500],
    colors.sage[500],
    colors.coral[500],
    colors.sunset[500],
    colors.lavender[500],
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
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