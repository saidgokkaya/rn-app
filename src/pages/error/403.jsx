import { Helmet } from 'react-helmet-async';

import { View403 } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `403 Yasaklı! | Hata` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View403 />
    </>
  );
}
