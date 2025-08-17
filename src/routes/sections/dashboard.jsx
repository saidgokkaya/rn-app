import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard } from 'src/auth/guard';

import RoleGuard from '../guards/role-guard';
import PermissionGuard from '../guards/permission';

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
const AccountPdfFormatPage = lazy(
  () => import('src/pages/dashboard/user/account/pdf-selected')
);
//App
const PermitPage = lazy(() => import('src/pages/ruhsat'));
const NewPermitPage = lazy(() => import('src/pages/ruhsat/new'));
const EditPermitPage = lazy(() => import('src/pages/ruhsat/edit'));
const ActivityPage = lazy(() => import('src/pages/ruhsat/activity'));
const ClassPage = lazy(() => import('src/pages/ruhsat/class'));
const WareHousePage = lazy(() => import('src/pages/ruhsat/warehouse'));
const NumaratajPage = lazy(() => import('src/pages/numarataj'));
const AreasPage = lazy(() => import('src/pages/numarataj/areas'));
const NeighbourhoodPage = lazy(() => import('src/pages/numarataj/neighbourhood'));
const NewNumberingPage = lazy(() => import('src/pages/numarataj/new'));
const EditNumberingPage = lazy(() => import('src/pages/numarataj/edit'));
const NumReportPage = lazy(() => import('src/pages/numarataj/report'));
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
          { path: 'pdf-format', element: (<RoleGuard allowedRoles={['Admin']}><AccountPdfFormatPage /></RoleGuard>) },
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
      {
        path: 'permit',
        children: [
          { index: true, element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><PermitPage /></RoleGuard></PermissionGuard>) },
          { path: 'new', element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><NewPermitPage /></RoleGuard></PermissionGuard>) },
          { path: ':id/edit', element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><EditPermitPage /></RoleGuard></PermissionGuard>) },
          { path: 'activity', element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><ActivityPage /></RoleGuard></PermissionGuard>) },
          { path: 'warehouse', element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><WareHousePage /></RoleGuard></PermissionGuard>) },
          { path: 'class', element: (<PermissionGuard permissionKey="ruhsatView"><RoleGuard allowedRoles={['Admin', 'Ruhsat']}><ClassPage /></RoleGuard></PermissionGuard>) },
        ],
      },
      {
        path: 'numbering',
        children: [
          { index: true, element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><NumaratajPage /></RoleGuard></PermissionGuard>) },
          { path: 'common-areas', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><NumaratajPage /></RoleGuard></PermissionGuard>) },
          { path: 'areas', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><AreasPage /></RoleGuard></PermissionGuard>) },
          { path: 'neighbourhood', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><NeighbourhoodPage /></RoleGuard></PermissionGuard>) },
          { path: 'new', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><NewNumberingPage /></RoleGuard></PermissionGuard>) },
          { path: ':id/edit', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><EditNumberingPage /></RoleGuard></PermissionGuard>) },
          { path: 'report', element: (<PermissionGuard permissionKey="numaratajView"><RoleGuard allowedRoles={['Admin', 'Numarataj']}><NumReportPage /></RoleGuard></PermissionGuard>) },
        ],
      },
      { path: 'log', element: (<RoleGuard allowedRoles={['Admin']}><LogPage /></RoleGuard>) },
    ],
  },
];
