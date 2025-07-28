import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermitForm } from '../new-permit';

// ----------------------------------------------------------------------

export function PermitCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ruhsat Ekle"
        links={[
          { name: 'Başlagıç', href: paths.dashboard.root },
          { name: 'Ruhsat', href: paths.dashboard.permit.root },
          { name: 'Yeni Ruhsat' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PermitForm />
    </DashboardContent>
  );
}
