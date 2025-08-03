import { Helmet } from 'react-helmet-async';

import { OverviewNumberingView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Rapor` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewNumberingView />
    </>
  );
}
