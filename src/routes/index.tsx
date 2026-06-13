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
import GeneralSettingsPage from '@/pages/settings/GeneralSettingsPage';
import RegionSettingsPage from '@/pages/settings/RegionSettingsPage';
import SystemSettingsPage from '@/pages/settings/SystemSettingsPage';
import PaymentSettingsPage from '@/pages/settings/PaymentSettingsPage';
import EnvironmentSettingsPage from '@/pages/settings/EnvironmentSettingsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import LearnersPage from '@/pages/learners/LearnersPage';
import UsersPage from '@/pages/users/UsersPage';
import RolesPage from '@/pages/roles/RolesPage';
import PermissionsPage from '@/pages/permissions/PermissionsPage';
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
                path: 'settings/general',
                element: <GeneralSettingsPage />,
              },
              {
                path: 'settings/region',
                element: <RegionSettingsPage />,
              },
              {
                path: 'settings/system',
                element: <SystemSettingsPage />,
              },
              {
                path: 'settings/payment',
                element: <PaymentSettingsPage />,
              },
              {
                path: 'settings/environment',
                element: <EnvironmentSettingsPage />,
              },
              {
                path: 'profile',
                element: <ProfilePage />,
              },
              {
                path: 'users',
                element: <UsersPage />,
              },
              {
                path: 'roles',
                element: <RolesPage />,
              },
              {
                path: 'permissions',
                element: <PermissionsPage />,
              },
              {
                path: 'learners',
                element: <LearnersPage />,
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
