import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserEditForm } from '../user-edit-form';

// ----------------------------------------------------------------------

export function UserEditView({ user: currentUser, userId }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Kullanıcı Düzenle"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Başlagıç', href: paths.dashboard.root },
          { name: 'Organizasyon' },
          { name: 'Kullanıcı Listesi', href: paths.dashboard.user.list },
          { name: currentUser?.firstName + ' ' + currentUser?.lastName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserEditForm currentUser={currentUser} userId={userId} />
    </DashboardContent>
  );
}
