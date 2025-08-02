import { Helmet } from 'react-helmet-async';

import { NumberingCreateView } from 'src/sections/overview/numarataj/view';

// ----------------------------------------------------------------------

const metadata = { title: `Numarataj Ekle` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NumberingCreateView />
    </>
  );
}
