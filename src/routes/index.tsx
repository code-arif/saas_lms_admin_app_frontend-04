import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import TenantsPage from '@/pages/tenants/TenantsPage';
import TenantDetailPage from '@/pages/tenants/TenantDetailPage';
import PlansPage from '@/pages/plans/PlansPage';
import PlanFormPage from '@/pages/plans/PlanFormPage';
import SubscriptionsPage from '@/pages/subscriptions/SubscriptionsPage';
import CouponsPage from '@/pages/coupons/CouponsPage';
import CampaignsPage from '@/pages/campaigns/CampaignsPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'login',
                element: <LoginPage />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: 'dashboard',
                element: <DashboardPage />,
              },
              {
                path: 'tenants',
                element: <TenantsPage />,
              },
              {
                path: 'tenants/:uuid',
                element: <TenantDetailPage />,
              },
              {
                path: 'plans',
                element: <PlansPage />,
              },
              {
                path: 'plans/create',
                element: <PlanFormPage />,
              },
              {
                path: 'plans/:uuid/edit',
                element: <PlanFormPage />,
              },
              {
                path: 'subscriptions',
                element: <SubscriptionsPage />,
              },
              {
                path: 'coupons',
                element: <CouponsPage />,
              },
              {
                path: 'campaigns',
                element: <CampaignsPage />,
              },
              {
                path: 'analytics',
                element: <AnalyticsPage />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
              {
                path: 'profile',
                element: <ProfilePage />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
