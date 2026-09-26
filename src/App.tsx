import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/components/auth/RequireAuth'
import { RequireOnboarding } from '@/components/auth/RequireOnboarding'
import { DashboardShell } from '@/components/layout/DashboardShell'
import CustomerReviewPage from '@/pages/CustomerReviewPage'
import LandingPage from '@/pages/LandingPage'
import DesignPreviewPage from '@/pages/DesignPreviewPage'
import TestimonialPreviewPage from '@/pages/TestimonialPreviewPage'
import WallOfLovePage from '@/pages/WallOfLovePage'
import LoginPage from '@/pages/auth/LoginPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'
import DashboardHomePage from '@/pages/dashboard/DashboardHomePage'
import DashboardReviewsPage from '@/pages/dashboard/DashboardReviewsPage'
import DashboardWallOfLovePage from '@/pages/dashboard/DashboardWallOfLovePage'
import DashboardQrPage from '@/pages/dashboard/DashboardQrPage'
import DashboardSettingsPage from '@/pages/dashboard/DashboardSettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/r/:slug" element={<CustomerReviewPage />} />
      <Route path="/w/:slug" element={<WallOfLovePage />} />
      <Route path="/preview/testimonial" element={<TestimonialPreviewPage />} />
      <Route path="/preview/design" element={<DesignPreviewPage />} />

      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <RequireOnboarding>
              <DashboardShell />
            </RequireOnboarding>
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="reviews" element={<DashboardReviewsPage />} />
        <Route path="wall-of-love" element={<DashboardWallOfLovePage />} />
        <Route path="qr" element={<DashboardQrPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
