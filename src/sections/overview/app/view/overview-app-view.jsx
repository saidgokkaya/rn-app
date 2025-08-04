import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { Iconify } from 'src/components/iconify';

import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/global-config';
import { SeoIllustration } from 'src/assets/illustrations';

import { AppWelcome } from '../app-welcome';
import { WidgetSummary } from '../chart-general';

const typeKeys = [
  "Özel İşyeri",
  "Resmi Kurum",
  "Yeni Bina",
  "Saha Çalışması",
  "Adres Tespit"
];

const typeColors = {
  "Özel İşyeri": "secondary",
  "Resmi Kurum": "warning",
  "Yeni Bina": "error",
  "Saha Çalışması": "info",
  "Adres Tespit": "secondary"
};

const typeIcons = {
  "Özel İşyeri": "famicons:business-outline",
  "Resmi Kurum": "ic:outline-castle",
  "Yeni Bina": "ph:building-apartment",
  "Saha Çalışması": "material-symbols:work-outline",
  "Adres Tespit": "solar:notebook-outline"
};

const getUserFromToken = () => {
  const token = localStorage.getItem('jwt_access_token');
  if (!token) return { firstName: '', lastName: '' };

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = new TextDecoder('utf-8').decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0))); 
    const jsonPayload = JSON.parse(decodedData);

    return {
      firstName: jsonPayload.firstName || '',
      lastName: jsonPayload.lastName || '',
    };
  } catch (error) {
    console.error('JWT çözümleme hatası:', error);
    return { firstName: '', lastName: '' };
  }
};

export function OverviewAppView() {
  const { firstName, lastName } = getUserFromToken();

  const [summary, setSummary] = useState({ typeCounts: {}, totalCount: 0 });
  const [permit, setPermit] = useState({ totalCount: 0, approvedCount: 0, unapprovedCount: 0 });

  const [organizationSettings, setOrganizationSettings] = useState({
    ruhsatView: false,
    numaratajView: false
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt_access_token');

    axios.get(`${CONFIG.apiUrl}/Organization/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setOrganizationSettings({
        ruhsatView: res.data?.ruhsatView ?? false,
        numaratajView: res.data?.numaratajView ?? false
      });
    }).catch(() => {});

    if (organizationSettings.numaratajView) {
      axios.get(`${CONFIG.apiUrl}/Numarataj/numberings-count`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setSummary(res.data);
      }).catch(() => {});
    }

    if (organizationSettings.ruhsatView) {
      axios.get(`${CONFIG.apiUrl}/Ruhsat/permits-count`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setPermit(res.data);
      }).catch(() => {});
    }
  }, [organizationSettings.numaratajView, organizationSettings.ruhsatView]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <AppWelcome
            title={`Hoşgeldiniz 👋 \n ${firstName} ${lastName}`}
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        {organizationSettings.ruhsatView && (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <WidgetSummary
                title="Toplam Ruhsat Kaydı"
                total={permit.totalCount}
                color="info"
                icon={<Iconify icon="humbleicons:certificate" width={60} />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <WidgetSummary
                title="Onaylı Ruhsatlar"
                total={permit.approvedCount}
                color="error"
                icon={<Iconify icon="iconamoon:certificate-badge" width={60} />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <WidgetSummary
                title="Onay Bekleyen Ruhsatlar"
                total={permit.unapprovedCount}
                color="warning"
                icon={<Iconify icon="la:certificate" width={60} />}
              />
            </Grid>
          </>
        )}

        {organizationSettings.numaratajView && (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <WidgetSummary
                title="Toplam Numarataj"
                total={summary.totalCount}
                color="info"
                icon={<Iconify icon="solar:chart-outline" width={60} />}
              />
            </Grid>

            {typeKeys.map((typeKey) => (
              <Grid key={typeKey} size={{ xs: 12, sm: 6, md: 2 }}>
                <WidgetSummary
                  title={typeKey}
                  total={summary.typeCounts[typeKey] ?? 0}
                  percent={
                    summary.totalCount > 0
                      ? Math.round((summary.typeCounts[typeKey] ?? 0) * 100 / summary.totalCount)
                      : 0
                  }
                  color={typeColors[typeKey]}
                  icon={<Iconify icon={typeIcons[typeKey]} width={60} />}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </DashboardContent>
  );
}