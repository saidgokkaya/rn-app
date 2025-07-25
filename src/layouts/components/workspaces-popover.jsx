import { useState, useEffect, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';
import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ sx, ...other }) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Organization/workspace`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Veri çekilirken hata oluştu.');
        }

        const data = await response.json();

        setWorkspace({
          id: data.id,
          name: data.name,
        });
      } catch (error) {
        setWorkspace(null);
      }
    }

    fetchWorkspace();
  }, []);

  const buttonBg = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  const renderButton = () => (
    <ButtonBase
      disableRipple
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {workspace?.name || ''}
      </Box>

    </ButtonBase>
  );

  return (
    <>
      {renderButton()}
    </>
  );
}
