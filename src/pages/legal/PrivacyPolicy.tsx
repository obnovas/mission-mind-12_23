import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { format } from 'date-fns';

export function PrivacyPolicy() {
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
          <Shield className="h-8 w-8 text-accent-600" />
          <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="text-sm text-neutral-500">
          Last updated: {format(new Date(), 'MMMM d, yyyy')}
        </p>

        <section className="mt-8">
          <h2>Introduction</h2>
          <p>
            Mission Mind ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Name and email address</li>
            <li>Profile information you provide</li>
            <li>Authentication data from third-party providers (e.g., Google)</li>
          </ul>

          <h3>Contact Management Data</h3>
          <ul>
            <li>Contact information you input</li>
            <li>Interaction history and notes</li>
            <li>Journey progress and prayer requests</li>
            <li>Group memberships and relationships</li>
          </ul>

          <h3>Usage Information</h3>
          <ul>
            <li>Device information and IP address</li>
            <li>Browser type and settings</li>
            <li>Usage patterns and preferences</li>
            <li>Error logs and performance data</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To authenticate your identity and manage your account</li>
            <li>To personalize your experience</li>
            <li>To improve our application and develop new features</li>
            <li>To communicate with you about service-related matters</li>
            <li>To ensure the security of our platform</li>
          </ul>
        </section>

        <section>
          <h2>Data Storage and Security</h2>
          <p>
            We use industry-standard security measures to protect your data:
          </p>
          <ul>
            <li>Encryption in transit and at rest</li>
            <li>Secure database infrastructure through Supabase</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
          </ul>
        </section>

        <section>
          <h2>Data Sharing and Third Parties</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li>Service providers who assist in operating our platform</li>
            <li>Third-party authentication providers (e.g., Google)</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@missionmind.app</li>
            <li>Address: 123 Mission Street, Suite 100, San Francisco, CA 94105</li>
          </ul>
        </section>
      </div>
    </div>
  );
}