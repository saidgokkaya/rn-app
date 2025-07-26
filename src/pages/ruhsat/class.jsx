import { Helmet } from 'react-helmet-async';

import { ClassView } from 'src/sections/overview/ruhsat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ruhsat Sınıfı` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ClassView />
    </>
  );
}
