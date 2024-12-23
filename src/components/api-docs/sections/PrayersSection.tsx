import React from 'react';
import { useSettingsStore } from '../../../store/settingsStore';

export function PrayersSection() {
  const { settings } = useSettingsStore();
  const label = settings.featureLabel;

  return (
    <section>
      <h2>{label} API</h2>
      <p>Manage prayer requests and track answers to prayers.</p>

      <h3>List {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/prayers
      </pre>

      <h3>Get {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/prayers/:id
      </pre>

      <h3>Create {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`POST /api/prayers
Content-Type: application/json

{
  "contact_id": "uuid",
  "request": "Strength and guidance for new ministry role",
  "status": "Active"
}`}
      </pre>

      <h3>Update {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`PUT /api/prayers/:id
Content-Type: application/json

{
  "status": "Answered",
  "answer_notes": "Prayer answered with clear direction"
}`}
      </pre>

      <h3>Delete {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        DELETE /api/prayers/:id
      </pre>

      <h3>Get Active {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/prayers/active
      </pre>

      <h3>Get Answered {label}</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/prayers/answered
      </pre>

      <h3>Get {label} by Contact</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/prayers/contact/:contactId
      </pre>
    </section>
  );
}