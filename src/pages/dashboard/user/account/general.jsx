import { Helmet } from 'react-helmet-async';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Hesap` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountGeneralView />
    </>
  );
}
