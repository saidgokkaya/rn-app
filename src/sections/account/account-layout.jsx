import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  organization: icon('ic-organization'),
};

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'Profil',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.dashboard.user.account,
  },
  {
    label: 'Güvenlik',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.dashboard.user.account}/change-password`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }) {
  const pathname = usePathname();

  return (
    <DashboardContent {...other}>
      <CustomBreadcrumbs
        heading="Hesap"
        links={[
          { name: 'Başlangıç', href: paths.dashboard.root },
          { name: 'Organizasyon' },
          { name: 'Hesap' },
        ]}
        sx={{ mb: 3 }}
      />

      <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      {children}
    </DashboardContent>
  );
}
