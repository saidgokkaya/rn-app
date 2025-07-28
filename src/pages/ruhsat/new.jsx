import { Helmet } from 'react-helmet-async';

import { PermitCreateView } from 'src/sections/overview/ruhsat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ruhsat Ekle` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PermitCreateView />
    </>
  );
}
