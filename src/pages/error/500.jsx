import { Helmet } from 'react-helmet-async';

import { View500 } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `500 Sunucu Hatası! | Hata` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <View500 />
    </>
  );
}
