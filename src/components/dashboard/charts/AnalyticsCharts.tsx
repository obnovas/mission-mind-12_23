import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Contact, CheckIn, PrayerRequest } from '../../../types';
import { colors } from '../../../styles/colors';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek, startOfWeek, subDays, isWithinInterval } from 'date-fns';
import { useSettingsStore } from '../../../store/settingsStore';

interface AnalyticsChartsProps {
  contacts: Contact[];
  checkIns: CheckIn[];
  prayerRequests: PrayerRequest[];
}

export function AnalyticsCharts({ contacts, checkIns, prayerRequests }: AnalyticsChartsProps) {
  const { settings } = useSettingsStore();
  
  // Calculate metrics
  const metrics = React.useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const thirtyDaysAgo = subDays(now, 30);

    // Filter to only include data from the last 30 days
    const recentCheckIns = checkIns.filter(ci => 
      isWithinInterval(new Date(ci.check_in_date), { start: thirtyDaysAgo, end: now })
    );

    const recentPrayerRequests = prayerRequests.filter(pr =>
      isWithinInterval(new Date(pr.created_at), { start: thirtyDaysAgo, end: now })
    );

    return {
      contactsVsCheckIns: [
        { name: 'Total Contacts', value: contacts.length, id: 'total-contacts' },
        { name: `Completed ${settings.checkInLabel}s`, value: recentCheckIns.filter(ci => ci.status === 'Completed').length, id: 'completed-checkins' }
      ],
      monthlyCheckIns: (() => {
        const thisMonth = startOfMonth(now);
        const lastMonth = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
        
        return [
          { 
            name: format(lastMonth, 'MMM'),
            value: checkIns.filter(ci =>
              ci.status === 'Completed' &&
              isWithinInterval(new Date(ci.check_in_date), 
                { start: lastMonth, end: thisMonth }
              )
            ).length,
            id: 'last-month'
          },
          { 
            name: format(thisMonth, 'MMM'),
            value: checkIns.filter(ci =>
              ci.status === 'Completed' &&
              isWithinInterval(new Date(ci.check_in_date), 
                { start: thisMonth, end: now }
              )
            ).length,
            id: 'this-month'
          }
        ];
      })(),
      weeklyScheduled: eachWeekOfInterval(
        { start: monthStart, end: monthEnd }
      ).map(weekStart => {
        const weekEnd = endOfWeek(weekStart);
        const weekCheckIns = checkIns.filter(ci => {
          const date = new Date(ci.check_in_date);
          return ci.status === 'Scheduled' && 
                 isWithinInterval(date, { 
                   start: startOfWeek(weekStart), 
                   end: weekEnd 
                 });
        });

        return {
          name: `Week ${format(weekStart, 'd')}`,
          value: weekCheckIns.length,
          id: `week-${format(weekStart, 'yyyy-MM-dd')}`
        };
      }),
      answeredPrayers: (() => {
        const answeredPrayers = prayerRequests.filter(pr =>
          pr.status === 'Answered' &&
          isWithinInterval(new Date(pr.updated_at), 
            { start: thirtyDaysAgo, end: now }
          )
        );

        const groupedByDate = answeredPrayers.reduce((acc, pr) => {
          const date = format(new Date(pr.updated_at), 'MMM d');
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return Array.from({ length: 30 }, (_, i) => {
          const date = format(subDays(now, i), 'MMM d');
          return {
            date,
            count: groupedByDate[date] || 0,
            id: `prayer-${date}`
          };
        }).reverse();
      })()
    };
  }, [contacts, checkIns, prayerRequests, settings.checkInLabel]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Distribution */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-ocean-500 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Contact Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.contactsVsCheckIns}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {metrics.contactsVsCheckIns.map((entry, index) => (
                  <Cell 
                    key={entry.id}
                    fill={index === 0 ? colors.ocean[500] : colors.sage[500]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Check-ins */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-sage-500 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Monthly {settings.checkInLabel}s</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.monthlyCheckIns}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={colors.sage[500]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Scheduled */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-lavender-500 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Weekly Scheduled {settings.checkInLabel}s</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.weeklyScheduled}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={colors.lavender[500]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Answered Prayers */}
      <div className="bg-white rounded-lg border border-neutral-200 border-l-4 border-l-sunset-500 p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Answered {settings.featureLabel}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.answeredPrayers}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.neutral[200]} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={colors.sunset[500]}
                strokeWidth={2}
                dot={{ fill: colors.sunset[500] }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}