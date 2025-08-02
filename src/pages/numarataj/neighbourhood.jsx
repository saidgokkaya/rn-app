import { Helmet } from 'react-helmet-async';

import { NeighbourhoodView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Mahalle` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NeighbourhoodView />
    </>
  );
}
