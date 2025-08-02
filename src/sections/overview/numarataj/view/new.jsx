import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NumberingForm } from '../new-numbering';

// ----------------------------------------------------------------------

export function NumberingCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Numarataj Ekle"
        links={[
          { name: 'Başlagıç', href: paths.dashboard.root },
          { name: 'Numarataj' },
          { name: 'Ortak Alan', href: paths.dashboard.numbering.common_area },
          { name: 'Numarataj Alanları', href: paths.dashboard.numbering.areas },
          { name: 'Yeni Numarataj' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NumberingForm />
    </DashboardContent>
  );
}