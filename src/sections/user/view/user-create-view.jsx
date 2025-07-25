import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Kullanıcı Ekle"
        links={[
          { name: 'Başlagıç', href: paths.dashboard.root },
          { name: 'Organizasyon' },
          { name: 'Kullanıcı Listesi', href: paths.dashboard.user.list },
          { name: 'Yeni Kullanıcı' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
