import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

export function SignUpTerms({ sx, ...other }) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: 'block',
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {'Kaydolarak, şunları kabul ediyorum: '}
      <Link underline="always" color="text.primary">
        Hizmet şartları
      </Link>
      {' ve '}
      <Link underline="always" color="text.primary">
        Gizlilik politikası
      </Link>
      .
    </Box>
  );
}
