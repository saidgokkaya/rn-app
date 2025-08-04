import { useEffect, useState } from 'react';
import axios from 'axios';
import { CONFIG } from 'src/global-config';
import { LoadingScreen } from 'src/components/loading-screen';
import Page403 from 'src/pages/error/403';

export default function PermissionGuard({ children, permissionKey }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');

        const res = await axios.get(`${CONFIG.apiUrl}/Organization/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const permission = res.data?.[permissionKey];
        setHasPermission(!!permission);
      } catch (error) {
        setHasPermission(false);
      }
    };

    fetchPermission();
  }, [permissionKey]);

  if (hasPermission === null) {
    return <LoadingScreen />;
  }

  if (!hasPermission) {
    return <Page403 />;
  }

  return children;
}