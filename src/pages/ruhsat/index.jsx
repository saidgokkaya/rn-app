import { Helmet } from 'react-helmet-async';

import { RuhsatListView } from 'src/sections/overview/ruhsat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ruhsat` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RuhsatListView />
    </>
  );
}
