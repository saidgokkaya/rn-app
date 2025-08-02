import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NumberingForm } from '../edit-numbering';

// ----------------------------------------------------------------------

export function NumberingView({ data, id }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Numarataj Düzenle"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Numarataj' },
          { name: 'Ortak Alan', href: paths.dashboard.numbering.common_area },
          { name: 'Numarataj Alanları', href: paths.dashboard.numbering.areas },
          { name: data.id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NumberingForm data={data} id={id} />
    </DashboardContent>
  );
}
