import { Helmet } from 'react-helmet-async';

import { LogListView } from 'src/sections/log/view';

// ----------------------------------------------------------------------

const metadata = { title: `Log Kayıtları` };

export default function OverviewAppPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LogListView />
    </>
  );
}
