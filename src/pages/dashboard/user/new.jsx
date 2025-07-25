import { Helmet } from 'react-helmet-async';

import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Kullanıcı Ekle` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
