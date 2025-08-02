import { Helmet } from 'react-helmet-async';

import { AreasView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Numarataj Alanları` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AreasView />
    </>
  );
}
