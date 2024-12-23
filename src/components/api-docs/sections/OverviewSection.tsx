import React from 'react';

export function OverviewSection() {
  return (
    <section>
      <h2>Overview</h2>
      <p>
        The Mission Mind API allows you to programmatically access and manage your ministry data.
        All API access is over HTTPS and accessed through our REST API endpoints.
      </p>

      <h3>Authentication</h3>
      <p>
        All API requests require authentication using an API key. Include your API key
        in the Authorization header of all requests:
      </p>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
        Authorization: Bearer YOUR_API_KEY
      </pre>

      <h3>Rate Limits</h3>
      <ul>
        <li>1000 requests per hour per API key</li>
        <li>Maximum payload size: 1MB</li>
        <li>Maximum batch size: 100 records</li>
      </ul>

      <h3>Response Format</h3>
      <p>All responses are returned in JSON format with the following structure:</p>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "data": { ... },
  "error": null
}`}
      </pre>

      <h3>Error Handling</h3>
      <p>Errors are returned with appropriate HTTP status codes and messages:</p>
      <pre className="bg-neutral-900 text-white p-4 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "data": null,
  "error": {
    "message": "Error description"
  }
}`}
      </pre>
    </section>
  );
}