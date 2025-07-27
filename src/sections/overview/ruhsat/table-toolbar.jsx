import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function TableToolbar({ filters, onResetPage }) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const handleFilterChange = useCallback(
    (field) => (event) => {
      onResetPage();
      updateFilters({ [field]: event.target.value });
    },
    [onResetPage, updateFilters]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
      }}
    >
      <TextField
      sx={{ width: '14%' }}
        label="Ruhsat No"
        value={currentFilters.ruhsatNo}
        onChange={handleFilterChange('ruhsatNo')}
        placeholder="Ruhsat No"
      />
      <TextField
      sx={{ width: '14%' }}
        label="Vergi No"
        value={currentFilters.tcKimlikNo}
        onChange={handleFilterChange('tcKimlikNo')}
        placeholder="Vergi No"
      />
      <TextField
      sx={{ width: '14%' }}
        label="Ad Soyad"
        value={currentFilters.fullName}
        onChange={handleFilterChange('fullName')}
        placeholder="Ad Soyad"
      />
      <TextField
      sx={{ width: '14%' }}
        label="İşyeri Ünvanı"
        value={currentFilters.isyeriUnvani}
        onChange={handleFilterChange('isyeriUnvani')}
        placeholder="İşyeri Ünvanı"
      />
      <TextField
      sx={{ width: '14%' }}
        label="Faaliyet Konusu"
        value={currentFilters.faaliyetKonusuName}
        onChange={handleFilterChange('faaliyetKonusuName')}
        placeholder="Faaliyet Konusu"
      />
      <TextField
      sx={{ width: '14%' }}
        label="Ruhsat Türü"
        value={currentFilters.ruhsatTuruName}
        onChange={handleFilterChange('ruhsatTuruName')}
        placeholder="Ruhsat Türü"
      />
    </Box>
  );
}
