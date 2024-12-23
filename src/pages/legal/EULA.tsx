import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { format } from 'date-fns';

export function EULA() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/"
          className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-accent-600" />
          <h1 className="text-3xl font-bold text-neutral-900">End User License Agreement</h1>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="text-sm text-neutral-500">
          Last updated: {format(new Date(), 'MMMM d, yyyy')}
        </p>

        <section className="mt-8">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Mission Mind ("the Application"), you agree to be bound by this End User License Agreement ("Agreement"). If you do not agree to these terms, do not use the Application.
          </p>
        </section>

        <section>
          <h2>2. License Grant</h2>
          <p>
            Subject to your compliance with this Agreement, we grant you a limited, non-exclusive, non-transferable, revocable license to:
          </p>
          <ul>
            <li>Access and use the Application for your personal or organizational ministry purposes</li>
            <li>Create and manage contact information and relationships</li>
            <li>Track ministry journeys and prayer requests</li>
            <li>Generate reports and analytics</li>
          </ul>
        </section>

        <section>
          <h2>3. Restrictions</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Copy, modify, or create derivative works of the Application</li>
            <li>Reverse engineer, decompile, or disassemble the Application</li>
            <li>Remove or alter any proprietary notices or labels</li>
            <li>Use the Application for any illegal or unauthorized purpose</li>
            <li>Share your account credentials with others</li>
            <li>Upload malicious code or content</li>
          </ul>
        </section>

        <section>
          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you create or upload to the Application. By using the Application, you grant us a license to store and process your content as necessary to provide the service.
          </p>
        </section>

        <section>
          <h2>5. Privacy and Data Protection</h2>
          <p>
            Your use of the Application is also governed by our Privacy Policy. You agree that we may process your information as described in the Privacy Policy.
          </p>
        </section>

        <section>
          <h2>6. Account Security</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2>7. Service Availability</h2>
          <p>
            We strive to maintain high availability but do not guarantee uninterrupted access to the Application. We reserve the right to modify, suspend, or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            The Application, including all content, features, and functionality, is owned by us and protected by intellectual property laws. This Agreement does not grant you any rights to our trademarks or service marks.
          </p>
        </section>

        <section>
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APPLICATION.
          </p>
        </section>

        <section>
          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your access to the Application immediately for any breach of this Agreement. Upon termination:
          </p>
          <ul>
            <li>Your license to use the Application ends</li>
            <li>You must cease all use of the Application</li>
            <li>You may request a copy of your data within 30 days</li>
          </ul>
        </section>

        <section>
          <h2>12. Changes to Agreement</h2>
          <p>
            We may modify this Agreement at any time. Continued use of the Application after changes constitutes acceptance of the modified Agreement.
          </p>
        </section>

        <section>
          <h2>13. Governing Law</h2>
          <p>
            This Agreement is governed by the laws of the State of California, without regard to its conflict of law principles.
          </p>
        </section>

        <section>
          <h2>14. Contact Information</h2>
          <p>
            For questions about this Agreement, please contact us at:
          </p>
          <ul>
            <li>Email: legal@missionmind.app</li>
            <li>Address: 123 Mission Street, Suite 100, San Francisco, CA 94105</li>
          </ul>
        </section>
      </div>
    </div>
  );
}