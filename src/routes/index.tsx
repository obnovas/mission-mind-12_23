import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { AuthGuard } from '../components/auth/AuthGuard';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { VerifyEmail } from '../pages/VerifyEmail';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { Dashboard } from '../pages/Dashboard';
import { Contacts } from '../pages/Contacts';
import { ContactDetails } from '../pages/ContactDetails';
import { Journeys } from '../pages/Journeys';
import { JourneyDetail } from '../pages/JourneyDetail';
import { PrayerRequests } from '../pages/PrayerRequests';
import { NetworkGroups } from '../pages/NetworkGroups';
import { Profile } from '../pages/Profile';
import { Documentation } from '../pages/Documentation';
import { PrivacyPolicy } from '../pages/legal/PrivacyPolicy';
import { EULA } from '../pages/legal/EULA';
import { Tools } from '../pages/Tools';
import { CalendarReportPage } from '../pages/CalendarReport';
import { SphereOfInfluencePage } from '../pages/SphereOfInfluence';
import { PrayerWeek } from '../pages/PrayerWeek';
import { CheckIns } from '../pages/CheckIns';
import { ApiDocs } from '../pages/ApiDocs';

export function AppRoutes() {
  return (
    <RouterRoutes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/eula" element={<EULA />} />
      <Route path="/api-docs" element={<ApiDocs />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Layout>
              <RouterRoutes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/:id" element={<ContactDetails />} />
                <Route path="/journeys" element={<Journeys />} />
                <Route path="/journeys/:id" element={<JourneyDetail />} />
                <Route path="/prayer-requests" element={<PrayerRequests />} />
                <Route path="/network-groups" element={<NetworkGroups />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/calendar" element={<CalendarReportPage />} />
                <Route path="/tools/influence" element={<SphereOfInfluencePage />} />
                <Route path="/tools/prayer-week" element={<PrayerWeek />} />
                <Route path="/check-ins" element={<CheckIns />} />
              </RouterRoutes>
            </Layout>
          </AuthGuard>
        }
      />
    </RouterRoutes>
  );
}