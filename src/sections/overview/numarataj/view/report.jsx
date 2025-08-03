import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2';
import { Iconify } from 'src/components/iconify';

import { DashboardContent } from 'src/layouts/dashboard';
import { CONFIG } from 'src/global-config';

import { WidgetSummary } from '../chart-general';
import { AppCurrentDownload } from '../app-current-download';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

const typeMap = {
  0: 'Özel İşyeri',
  1: 'Resmi Kurum',
  2: 'Yeni Bina',
  3: 'Saha Çalışması',
  4: 'Adres Tespit'
};

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

export function OverviewNumberingView() {
  const [dailyChartData, setDailyChartData] = useState({ categories: [], series: [] });
  const [weeklyChartData, setWeeklyChartData] = useState({ categories: [], series: [] });
  const [mahalleChartData, setMahalleChartData] = useState({ categories: [], series: [] });
  const [summary, setSummary] = useState({ typeCounts: {}, totalCount: 0 });

  useEffect(() => {
    const token = localStorage.getItem('jwt_access_token');

    axios
      .get(`${CONFIG.apiUrl}/Numarataj/last-7-days`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const raw = res.data;
        const categories = raw.map((d) => d.day);
        const typeSet = new Set();
        raw.forEach((d) => d.types.forEach((t) => typeSet.add(t.type)));
        const types = Array.from(typeSet).sort();
        const series = types.map((typeId) => {
          const name = typeMap[typeId] ?? 'Bilinmeyen';
          return {
            name,
            data: raw.map((day) => {
              const found = day.types.find((t) => t.type === typeId);
              return found ? found.count : 0;
            }),
          };
        });

        setDailyChartData({ categories, series });
      })
      .catch((err) => {
        console.error('Günlük veri alınamadı:', err);
      });

    axios
      .get(`${CONFIG.apiUrl}/Numarataj/last-4-weeks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const raw = res.data;
        const categories = raw.map((d) => getYearWeekLabel(d.weekStart || d.WeekStart));

        const typeSet = new Set();
        raw.forEach((week) => week.types.forEach((t) => typeSet.add(t.type ?? t.Type)));
        const types = Array.from(typeSet).sort();

        const series = types.map((typeId) => {
          const name = typeMap[typeId] ?? 'Bilinmeyen';
          return {
            name,
            data: raw.map((week) => {
              const found = week.types.find((t) => (t.type ?? t.Type) === typeId);
              return found ? (found.count ?? found.Count) : 0;
            }),
          };
        });

        setWeeklyChartData({ categories, series });
      })
      .catch((err) => {
      });

    axios.get(`${CONFIG.apiUrl}/Numarataj/chart-data-mahalle`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const data = res.data;

        setMahalleChartData({
          categories: data.categories,
          series: data.series.map(s => ({
            name: s.name,
            data: s.data
          }))
        });
      })
      .catch((err) => {
        console.error('Mahalle bazlı veri alınamadı:', err);
      });

    axios.get(`${CONFIG.apiUrl}/Numarataj/numberings-count`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setSummary(res.data);
      })
      .catch(err => {
        console.error('Summary data fetch error:', err);
      });
  }, []);

  function getYearWeekLabel(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    const diff = target - firstThursday;
    const weekNum = 1 + Math.round(diff / (7 * 24 * 3600 * 1000));

    return `${year} ${weekNum}. Hafta`;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <WidgetSummary
            title="Toplam"
            total={summary.totalCount}
            color="info"
            icon={<Iconify icon="solar:chart-outline" width={60} />}
          />
        </Grid>

        {typeKeys.map(typeKey => (
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

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="Toplam Veri Dağılımı"
            chart={{
              series: [
                { label: 'Özel İşyeri', value: summary.typeCounts?.['Özel İşyeri'] ?? 0 },
                { label: 'Resmi Kurum', value: summary.typeCounts?.['Resmi Kurum'] ?? 0 },
                { label: 'Yeni Bina', value: summary.typeCounts?.['Yeni Bina'] ?? 0 },
                { label: 'Saha Çalışması', value: summary.typeCounts?.['Saha Çalışması'] ?? 0 },
                { label: 'Adres Tespit', value: summary.typeCounts?.['Adres Tespit'] ?? 0 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Günlük Kaydedilen Veri"
            subheader="Son 7 günde oluşturulan kayıtlar"
            chart={dailyChartData}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Haftalık Kaydedilen Veri"
            subheader="Son 4 haftada oluşturulan kayıtlar"
            chart={weeklyChartData}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsConversionRates
            title="Mahalle Bazlı Veri"
            subheader="Mahallelerin Numarataj kayıtları"
            chart={mahalleChartData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
