import React from 'react';

export function ContactsSection() {
  return (
    <section>
      <h2>Contacts API</h2>
      <p>Manage your ministry contacts through the API.</p>

      <h3>List Contacts</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts
      </pre>

      <h3>Get Contact</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/:id
      </pre>

      <h3>Create Contact</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`POST /api/contacts
Content-Type: application/json

{
  "name": "John Smith",
  "type": "Individual",
  "email": "john@example.com",
  "phone": "555-0123",
  "address": "123 Main St",
  "notes": "Regular attendee",
  "check_in_frequency": "Weekly"
}`}
      </pre>

      <h3>Update Contact</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`PUT /api/contacts/:id
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}`}
      </pre>

      <h3>Delete Contact</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        DELETE /api/contacts/:id
      </pre>

      <h3>Search Contacts</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/search?q=john
      </pre>

      <h3>Get Contact Check-ins</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/:id/check-ins
      </pre>

      <h3>Get Contact Prayer Requests</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/:id/prayers
      </pre>

      <h3>Get Contact Journeys</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/:id/journeys
      </pre>

      <h3>Get Contact Relationships</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/contacts/:id/relationships
      </pre>
    </section>
  );
}