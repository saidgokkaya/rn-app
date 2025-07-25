import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard } from 'src/auth/guard';

import RoleGuard from '../guards/role-guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
//App
const RuhsatPage = lazy(() => import('src/pages/ruhsat'));
const NumaratajPage = lazy(() => import('src/pages/numarataj'));
const LogPage = lazy(() => import('src/pages/log'));

// ----------------------------------------------------------------------

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const accountLayout = () => (
  <AccountLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AccountLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: 'user',
        children: [
          { index: true, element: (<RoleGuard allowedRoles={['Admin']}><UserListPage /></RoleGuard>) },
          { path: 'list', element: (<RoleGuard allowedRoles={['Admin']}><UserListPage /></RoleGuard>) },
          { path: 'new', element: (<RoleGuard allowedRoles={['Admin']}><UserCreatePage /></RoleGuard>) },
          { path: ':id/edit', element: (<RoleGuard allowedRoles={['Admin']}><UserEditPage /></RoleGuard>) },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },
      { path: 'permit', element: (<RuhsatPage />) },
      {
        path: 'numbering',
        children: [
          { index: true, element: (<NumaratajPage />) },
          { path: 'common-areas', element: (<NumaratajPage />) },
          { path: 'areas', element: (<NumaratajPage />) },
        ],
      },
      { path: 'log', element: (<RoleGuard allowedRoles={['Admin']}><LogPage /></RoleGuard>) },
    ],
  },
];
