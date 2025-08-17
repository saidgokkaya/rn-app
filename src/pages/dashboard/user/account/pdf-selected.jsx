import { Helmet } from 'react-helmet-async';

import { AccountPdfSelectedView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pdf Şablonu` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccountPdfSelectedView />
    </>
  );
}