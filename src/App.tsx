import * as React from 'react'
import { Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/components/auth/RequireAuth'
import { RequireOnboarding } from '@/components/auth/RequireOnboarding'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { FullPageSpinner } from '@/components/auth/RequireAuth'

const CustomerReviewPage = React.lazy(() => import('@/pages/CustomerReviewPage'))
const LandingPage = React.lazy(() => import('@/pages/LandingPage'))
const DesignPreviewPage = React.lazy(() => import('@/pages/DesignPreviewPage'))
const TestimonialPreviewPage = React.lazy(() => import('@/pages/TestimonialPreviewPage'))
const WallOfLovePage = React.lazy(() => import('@/pages/WallOfLovePage'))
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'))
const SignUpPage = React.lazy(() => import('@/pages/auth/SignUpPage'))
const ForgotPasswordPage = React.lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('@/pages/auth/ResetPasswordPage'))
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/OnboardingPage'))
const DashboardHomePage = React.lazy(() => import('@/pages/dashboard/DashboardHomePage'))
const DashboardReviewsPage = React.lazy(() => import('@/pages/dashboard/DashboardReviewsPage'))
const DashboardWallOfLovePage = React.lazy(() => import('@/pages/dashboard/DashboardWallOfLovePage'))
const DashboardQrPage = React.lazy(() => import('@/pages/dashboard/DashboardQrPage'))
const DashboardSettingsPage = React.lazy(() => import('@/pages/dashboard/DashboardSettingsPage'))

function App() {
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/r/:slug" element={<CustomerReviewPage />} />
        <Route path="/w/:slug" element={<WallOfLovePage />} />
        <Route path="/preview/testimonial" element={<TestimonialPreviewPage />} />
        <Route path="/preview/design" element={<DesignPreviewPage />} />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
    </React.Suspense>
  )
}

export default App
