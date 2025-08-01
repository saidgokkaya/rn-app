import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function AuthSplitSection({
  sx,
  method,
  methods,
  layoutQuery = 'md',
  title = 'Hoş Geldiniz',
  imgUrl = `${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`,
  subtitle = 'Ruhsat ve Numarataj Sistemine Giriş Yapın',
  ...other
}) {
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)})`,
              `url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`,
            ],
          }),
          px: 3,
          pb: 3,
          width: 1,
          maxWidth: 480,
          display: 'none',
          position: 'relative',
          pt: 'var(--layout-header-desktop-height)',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <div>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
            {subtitle}
          </Typography>
        )}
      </div>

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{ width: 1, aspectRatio: '4/3', objectFit: 'cover' }}
      />

      {!!methods?.length && method && (
        <Box component="ul" sx={{ gap: 2, display: 'flex' }}>
          {methods.map((option) => {
            return (
              <Box
                key={option.label}
                component="li"
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
