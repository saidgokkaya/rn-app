import { Helmet } from 'react-helmet-async';

import { NumaratajListView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Numarataj` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NumaratajListView />
    </>
  );
}
