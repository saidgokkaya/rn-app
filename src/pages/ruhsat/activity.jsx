import { Helmet } from 'react-helmet-async';

import { ActivityView } from 'src/sections/overview/ruhsat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Faaliyet Konusu` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ActivityView />
    </>
  );
}
