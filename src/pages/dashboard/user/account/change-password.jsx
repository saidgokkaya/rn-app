import { Helmet } from 'react-helmet-async';

import { AccountChangePasswordView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Şifre Değiştirme` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountChangePasswordView />
    </>
  );
}
