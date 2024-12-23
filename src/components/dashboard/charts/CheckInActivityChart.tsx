import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Contact } from '../../../types';
import { colors } from '../../../styles/colors';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface CheckInActivityChartProps {
  contacts: Contact[];
}

export function CheckInActivityChart({ contacts }: CheckInActivityChartProps) {
  const data = React.useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // Create array of last 30 days
    const dateRange = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: today,
    });

    // Count check-ins for each day
    return dateRange.map(date => {
      const checkIns = contacts.filter(contact => {
        const checkInDate = new Date(contact.last_contact_date);
        return format(checkInDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }).length;

      return {
        date: format(date, 'MMM d'),
        checkIns,
      };
    });
  }, [contacts]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: colors.neutral[600], fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: colors.neutral[600] }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '0.375rem',
              padding: '0.5rem'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="checkIns" 
            stroke={colors.accent[500]}
            strokeWidth={2}
            dot={{ fill: colors.accent[500], r: 4 }}
            activeDot={{ r: 6, fill: colors.accent[600] }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}