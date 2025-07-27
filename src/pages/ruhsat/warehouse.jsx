import { Helmet } from 'react-helmet-async';

import { WarehouseView } from 'src/sections/overview/ruhsat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Depo` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WarehouseView />
    </>
  );
}
