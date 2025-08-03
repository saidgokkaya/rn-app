import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Kullanıcı Düzenle` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwt_access_token');
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Organization/user?userId=${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const imageSrc = data.photoUrl
          ? `/user/${data.photoUrl}`
          : '';

        setCurrentUser({
          ...data,
          photoURL: imageSrc,
        });
      } catch (error) {
      }
    };
    
    fetchData();
  }, [id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={currentUser} userId={id} />
    </>
  );
}
