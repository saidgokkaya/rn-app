import { useEffect, useState } from 'react';
import Page403 from 'src/pages/error/403';

export default function RoleGuard({ children, allowedRoles = [] }) {
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const access = allowedRoles.some((role) => storedRoles.includes(role));
    setHasAccess(access);
  }, [allowedRoles]);

  if (hasAccess === null) {
    return null;
  }

  if (!hasAccess) {
    return <Page403 />;
  }

  return children;
}
