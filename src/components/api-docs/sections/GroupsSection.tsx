import React from 'react';

export function GroupsSection() {
  return (
    <section>
      <h2>Network Groups API</h2>
      <p>Manage network groups and their members.</p>

      <h3>List Groups</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/groups
      </pre>

      <h3>Get Group</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/groups/:id
      </pre>

      <h3>Create Group</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`POST /api/groups
Content-Type: application/json

{
  "name": "Prayer Team",
  "description": "Core prayer ministry team",
  "members": ["uuid1", "uuid2"]
}`}
      </pre>

      <h3>Update Group</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`PUT /api/groups/:id
Content-Type: application/json

{
  "name": "Prayer Warriors",
  "description": "Updated description"
}`}
      </pre>

      <h3>Delete Group</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        DELETE /api/groups/:id
      </pre>

      <h3>Add Member</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`POST /api/groups/:id/members
Content-Type: application/json

{
  "contact_id": "uuid"
}`}
      </pre>

      <h3>Remove Member</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        DELETE /api/groups/:id/members/:contactId
      </pre>

      <h3>Get Group Members</h3>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        GET /api/groups/:id/members
      </pre>
    </section>
  );
}