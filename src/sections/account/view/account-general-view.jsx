import { AccountGeneral } from '../account-general';
import { AccountUserGeneral } from '../account-user-general';

// ----------------------------------------------------------------------

export function AccountGeneralView() {
  const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isAdmin = roles.includes('Admin');

  if (!isAdmin) {
    return <AccountUserGeneral />;
  }
  return <AccountGeneral />;
}
