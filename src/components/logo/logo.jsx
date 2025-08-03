import { forwardRef, useEffect, useState } from 'react';
import { CONFIG } from 'src/global-config';
import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import axios from 'axios';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 120,
  height: 40,
  textDecoration: 'none',
}));

export const Logo = forwardRef(({ className, href = '/', ...props }, ref) => {
  const theme = useTheme();
  const [logoSrc, setLogoSrc] = useState(
    theme.palette.mode === 'dark'
      ? '/logo/dark-logo-single.png'
      : '/logo/logo-single.png'
  );

  useEffect(() => {
    const token = localStorage.getItem('jwt_access_token');

    if (token) {
      axios
        .get(`${CONFIG.apiUrl}/organization/logo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const orgLogoUrl = res.data?.logoUrl;
          if (orgLogoUrl) {
            setLogoSrc(orgLogoUrl);
          }
        })
        .catch((err) => {
        });
    }
  }, [theme.palette.mode]);

  return (
    <StyledLink component={RouterLink} className={className} {...props}>
      <img
        src={logoSrc}
        alt="Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </StyledLink>
  );
});

export default Logo;