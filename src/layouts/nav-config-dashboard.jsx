import { paths } from 'src/routes/paths';
import { useState, useEffect } from 'react';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const NavConfigDashboard = () => {
  const rolesString = localStorage.getItem('userRoles');
  let roles = [];
  roles = JSON.parse(rolesString) || [];

  const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

  const ICONS = {
    dashboard: icon('ic-dashboard'),
    organization: icon('ic-organization'),
    permit: icon('ic-permit'),
    numbering: icon('ic-numbering'),
    log: icon('ic-log'),
  };

  // ----------------------------------------------------------------------

  const filterItems = (items) =>
  items
    .filter((item) => {
      if (item.roles && !item.roles.some((role) => roles.includes(role))) {
        return false;
      }
      return true;
    })
    .map((item) =>
      item.children ? { ...item, children: filterItems(item.children) } : item
    );

  const navData = [
    {
      subheader: 'GENEL BAKIŞ',
      items: filterItems([
        { title: 'Başlangıç', path: paths.dashboard.root, icon: ICONS.dashboard },
      ]),
    },
    {
      subheader: 'HİZMETLER',
      items: filterItems([
        {
          title: 'Ruhsat',
          path: paths.dashboard.permit.root,
          icon: ICONS.permit
        },
        {
          title: 'Numarataj',
          path: paths.dashboard.numbering.root,
          icon: ICONS.numbering,
          children: [
            { title: 'Ortak Alan', path: paths.dashboard.numbering.common_area },
            { title: 'Numarataj Alanları', path: paths.dashboard.numbering.areas },
            { title: 'Rapor', path: paths.dashboard.numbering.report },
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
            { title: 'Hesap', path: paths.dashboard.user.account },
            { title: 'Kullanıcılar', path: paths.dashboard.user.list, roles: ['Admin'] },
          ],
        },
        { title: 'Log', path: paths.dashboard.log, icon: ICONS.log, roles: ['Admin'] },
      ]),
    },
  ];

  return navData;
};

export default NavConfigDashboard;
