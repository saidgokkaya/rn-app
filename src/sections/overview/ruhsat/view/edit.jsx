import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermitForm } from '../edit-permit';

// ----------------------------------------------------------------------

export function PermitEditView({ data, id }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ruhsat Düzenle"
        links={[
          { name: 'Başlagıç', href: paths.dashboard.root },
          { name: 'Ruhsat', href: paths.dashboard.permit.root },
          { name: data.ruhsatNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PermitForm data={data} id={id} />
    </DashboardContent>
  );
}
