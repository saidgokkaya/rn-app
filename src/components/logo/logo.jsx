import { forwardRef } from 'react';
import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles'; // useTheme eklendi
import { RouterLink } from 'src/routes/components';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 120,
  height: 40,
  textDecoration: 'none',
}));

export const Logo = forwardRef(({ className, href = '/', logoPath, ...props }, ref) => {
  const theme = useTheme(); // Temayı alıyoruz

  // Tema açık ise light logo, koyu ise dark logo seçimi
  const logoSrc =
    theme.palette.mode === 'dark'
      ? '/logo/dark-logo-single.png'
      : '/logo/logo-single.png';

  return (
    <StyledLink
      component={RouterLink}
      className={className}
      {...props}
    >
      <img
        src={logoSrc}
        alt="Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </StyledLink>
  );
});

export default Logo;
