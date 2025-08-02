import React, { useState, lazy, Suspense } from 'react';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Grid from '@mui/material/Grid';
import { Tabs, Tab, Box } from '@mui/material';
import Button from '@mui/material/Button';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { href } from 'react-router';

const NumaratajTypeList = lazy(() => import('./numbering-type-list'));

const NUMARATAJ = {
  OZEL_ISYERI: 0,
  RESMI_KURUM: 1,
  YENI_BINA: 2,
  SAHA_CALISMASI: 3,
  ADRES_TESPIT: 4
};

const tabLabels = [
  { label: 'Özel İşyeri', value: NUMARATAJ.OZEL_ISYERI },
  { label: 'Resmi Kurum', value: NUMARATAJ.RESMI_KURUM },
  { label: 'Yeni Bina', value: NUMARATAJ.YENI_BINA },
  { label: 'Saha Çalışması', value: NUMARATAJ.SAHA_CALISMASI },
  { label: 'Adres Tespit', value: NUMARATAJ.ADRES_TESPIT },
];

export function AreasView() {
  const [currentTab, setCurrentTab] = useState(NUMARATAJ.OZEL_ISYERI);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Numarataj Alanları"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Numarataj' },
          { name: 'Ortak Alan', href: paths.dashboard.numbering.common_area },
          { name: 'Numarataj Alanları' },
        ]}
        action={
          <>
            <Button
              component={RouterLink}
              href={paths.dashboard.numbering.neighbourhood}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Mahalle
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.numbering.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Numarataj Ekle
            </Button>
          </>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 5 }}
      >
        {tabLabels.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <NumaratajTypeList type={currentTab} />
          </Suspense>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
