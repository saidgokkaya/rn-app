import { useEffect, useState } from 'react';

import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { NeighbourhoodEditForm } from '../neighbourhood-edit';

// ----------------------------------------------------------------------

export function NeighbourhoodView() {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Numarataj/mahalles`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setSchemas(data);
      } catch (error) {
      }
    };

    fetchSchemas();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Mahalle"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Numarataj' },
          { name: 'Ortak Alan', href: paths.dashboard.numbering.common_area },
          { name: 'Numarataj Alanları', href: paths.dashboard.numbering.areas },
          { name: 'Mahalle' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NeighbourhoodEditForm currentSchema={schemas} />
    </DashboardContent>
  );
}
