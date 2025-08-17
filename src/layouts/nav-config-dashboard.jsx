import { paths } from 'src/routes/paths';
import { useState, useEffect } from 'react';

import { CONFIG } from 'src/global-config';
import axios from 'axios';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const NavConfigDashboard = () => {
  const rolesString = localStorage.getItem('userRoles');
  let roles = [];
  roles = JSON.parse(rolesString) || [];

  const [permissions, setPermissions] = useState({
    ruhsatView: false,
    numaratajView: false,
  });

  const [loading, setLoading] = useState(true);

  const icon = (name) => (
    <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
  );

  const ICONS = {
    dashboard: icon('ic-dashboard'),
    organization: icon('ic-organization'),
    permit: icon('ic-permit'),
    numbering: icon('ic-numbering'),
    log: icon('ic-log'),
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');
        const res = await axios.get(`${CONFIG.apiUrl}/Organization/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPermissions({
          ruhsatView: res.data?.ruhsatView ?? false,
          numaratajView: res.data?.numaratajView ?? false,
        });
      } catch (error) {
        console.error('İzinler alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const filterItems = (items) =>
    items
      .filter((item) => {
        if (item.roles && !item.roles.some((role) => roles.includes(role))) {
          return false;
        }

        if (item.permissionKey && !permissions[item.permissionKey]) {
          return false;
        }

        return true;
      })
      .map((item) =>
        item.children
          ? { ...item, children: filterItems(item.children) }
          : item
      );

  if (loading) return [];

  const navData = [
    {
      subheader: 'GENEL BAKIŞ',
      items: filterItems([
        {
          title: 'Başlangıç',
          path: paths.dashboard.root,
          icon: ICONS.dashboard,
        },
      ]),
    },
    {
      subheader: 'HİZMETLER',
      items: filterItems([
        {
          title: 'Ruhsat',
          path: paths.dashboard.permit.root,
          icon: ICONS.permit,
          roles: ['Ruhsat', 'Admin'],
          permissionKey: 'ruhsatView',
        },
        {
          title: 'Numarataj',
          path: paths.dashboard.numbering.root,
          icon: ICONS.numbering,
          permissionKey: 'numaratajView',
          roles: ['Numarataj', 'Admin'],
          children: [
            {
              title: 'Ortak Alan',
              path: paths.dashboard.numbering.common_area,
              roles: ['Numarataj', 'Admin'],
            },
            {
              title: 'Numarataj Alanları',
              path: paths.dashboard.numbering.areas,
              roles: ['Numarataj', 'Admin'],
            },
            {
              title: 'Rapor',
              path: paths.dashboard.numbering.report,
              roles: ['Numarataj', 'Admin'],
            },
          ],
        },
      ]),
    },
    {
      subheader: 'YÖNETİM',
      items: filterItems([
        {
          title: 'Organizasyon',
          path: paths.dashboard.user.root,
          icon: ICONS.organization,
          children: [
            { title: 'Hesap', icon: <Iconify icon="mdi:account-cog-outline" />, path: paths.dashboard.user.account },
            {
              title: 'Kullanıcılar',
              icon: <Iconify icon="flowbite:users-outline" />,
              path: paths.dashboard.user.list,
              roles: ['Admin'],
            },
            {
              title: 'Pdf Şablonu',
              icon: <Iconify icon="hugeicons:pdf-02" />,
              path: paths.dashboard.user.pdf_format,
              roles: ['Admin'],
            },
          ],
        },
        {
          title: 'Log',
          path: paths.dashboard.log,
          icon: ICONS.log,
          roles: ['Admin'],
        },
      ]),
    },
  ];

  return navData;
};

export default NavConfigDashboard;