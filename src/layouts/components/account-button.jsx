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

  const token = localStorage.getItem('jwt_access_token');
  let decoded = null;

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      window.location.href = '/login';
    }
  }

  const userId = decoded ? decoded.userId : null;

  const imageSrc = [
    `/user/${userId}.png`,
  ].find((src) => {
    const img = new Image();
    img.src = src;
    return img.complete;
  }) || user?.firstName?.charAt(0)?.toUpperCase();
  
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
        <Avatar src={imageSrc} alt={imageSrc} sx={{ width: 1, height: 1 }}>
          {imageSrc}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  );
}
