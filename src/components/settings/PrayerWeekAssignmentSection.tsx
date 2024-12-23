import React from 'react';
import { useContactStore } from '../../store/contactStore';
import { Calendar } from 'lucide-react';

export function PrayerWeekAssignmentSection() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const { items: contacts, update } = useContactStore();

  const handleAssignWeeks = async () => {
    try {
      setLoading(true);
      setSuccess(false);

      // Group contacts by current prayer week
      const weekCounts = contacts.reduce((acc, contact) => {
        if (contact.prayer_week) {
          acc[contact.prayer_week] = (acc[contact.prayer_week] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);

      // Find weeks with fewest contacts
      const contactsToUpdate = contacts.filter(c => !c.prayer_week);
      for (const contact of contactsToUpdate) {
        // Find the week with the least contacts
        let leastUsedWeek = 1;
        let minCount = Infinity;
        
        for (let week = 1; week <= 52; week++) {
          const count = weekCounts[week] || 0;
          if (count < minCount) {
            minCount = count;
            leastUsedWeek = week;
          }
        }

        // Update contact with new week
        await update(contact.id, {
          prayer_week: leastUsedWeek,
          updated_at: new Date().toISOString(),
        });

        // Update our tracking
        weekCounts[leastUsedWeek] = (weekCounts[leastUsedWeek] || 0) + 1;
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error assigning prayer weeks:', err);
    } finally {
      setLoading(false);
    }
  };

  const unassignedCount = contacts.filter(c => !c.prayer_week).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-neutral-900">Prayer Week Assignment</h3>
          <p className="text-sm text-neutral-500">
            {unassignedCount} contact{unassignedCount !== 1 ? 's' : ''} without assigned prayer weeks
          </p>
        </div>
        <button
          onClick={handleAssignWeeks}
          disabled={loading || unassignedCount === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Assigning...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Assign Prayer Weeks
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-3 bg-sage-50 text-sage-700 rounded-md border border-sage-200 text-sm">
          Successfully assigned prayer weeks to all contacts
        </div>
      )}
    </div>
  );
}