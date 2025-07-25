import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const _account = [
  { label: 'Başlangıç', href: paths.dashboard.root, icon: ICONS.dashboard },
];
