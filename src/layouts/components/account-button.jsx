import { useState, useEffect } from 'react';

import { CONFIG } from 'src/global-config';
import { jwtDecode } from 'jwt-decode';
import { m } from 'framer-motion';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AccountButton({ photoURL, displayName, sx, ...other }) {
  const [user, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  const token = localStorage.getItem('jwt_access_token');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Organization/drawer`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setImageSrc(`/user/${data.photoUrl}`);
        } else {
          console.error('API hatası:', response.status);
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };
    if (token) {fetchUserData();}
  }, [token]);

  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
        slotProps={{
          primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
          secondaryBorder: { sx: { color: 'warning.main' } },
        }}
      >
        <Avatar src={imageSrc || undefined} alt={user ? `${user.firstName.charAt(0).toUpperCase()}` : ''} sx={{ width: 1, height: 1 }}>
          {(!imageSrc && user?.firstName) ? user.firstName.charAt(0).toUpperCase() : ''}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  );
}
