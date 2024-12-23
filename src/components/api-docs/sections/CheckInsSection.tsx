import React from 'react';
import { useSettingsStore } from '../../../store/settingsStore';

export function CheckInsSection() {
  const { settings } = useSettingsStore();
  const label = settings.checkInLabel;

  return (
    <section>
      <h2>{label}s API</h2>
      <p>Manage {label.toLowerCase()}s and interactions with your contacts.</p>

      <h3>List {label}s</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/check-ins
      </pre>

      <h3>Get {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/check-ins/:id
      </pre>

      <h3>Create {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`POST /api/check-ins
Content-Type: application/json

{
  "contact_id": "uuid",
  "check_in_date": "2024-03-15T10:00:00Z",
  "status": "Scheduled",
  "check_in_notes": "Follow up on ministry opportunity",
  "check_in_type": "planned"
}`}
      </pre>

      <h3>Update {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`PUT /api/check-ins/:id
Content-Type: application/json

{
  "status": "Completed",
  "check_in_notes": "Great conversation about next steps"
}`}
      </pre>

      <h3>Delete {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        DELETE /api/check-ins/:id
      </pre>

      <h3>Get Upcoming {label}s</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/check-ins/upcoming
      </pre>

      <h3>Get Missed {label}s</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/check-ins/missed
      </pre>

      <h3>Get {label}s by Date Range</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/check-ins/range?start=2024-03-01&end=2024-03-31
      </pre>
    </section>
  );
}