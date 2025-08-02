import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    permit: {
      root: `${ROOTS.DASHBOARD}/permit`,
      new: `${ROOTS.DASHBOARD}/permit/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/permit/${id}/edit`,
      activity: `${ROOTS.DASHBOARD}/permit/activity`,
      warehouse: `${ROOTS.DASHBOARD}/permit/warehouse`,
      class: `${ROOTS.DASHBOARD}/permit/class`
    },
    numbering: {
      root: `${ROOTS.DASHBOARD}/numbering`,
      common_area: `${ROOTS.DASHBOARD}/numbering/common-areas`,
      areas: `${ROOTS.DASHBOARD}/numbering/areas`,
      neighbourhood: `${ROOTS.DASHBOARD}/numbering/neighbourhood`,
      new: `${ROOTS.DASHBOARD}/numbering/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/numbering/${id}/edit`,
    },
    log: `${ROOTS.DASHBOARD}/log`,
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
  },
};
