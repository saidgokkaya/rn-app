import { useEffect, useState } from 'react';

import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ClassEditForm } from '../class-edit';

// ----------------------------------------------------------------------

export function ClassView() {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/classes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setSchemas(data);
      } catch (error) {
        console.error('Takvim şemaları alınırken hata oluştu:', error);
      }
    };

    fetchSchemas();
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ruhsat Sınıfı"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Ruhsat', href: paths.dashboard.permit.root },
          { name: 'Ruhsat Sınıfı' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ClassEditForm currentSchema={schemas} />
    </DashboardContent>
  );
}
