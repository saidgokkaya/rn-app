import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
        label="Belge No"
        value={currentFilters.id}
        onChange={handleFilterChange('id')}
        placeholder="Belge No"
        type="number"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />

      <TextField
        sx={{ width: '14%' }}
        label="TC Kimlik No"
        value={currentFilters.tcKimlikNo}
        onChange={handleFilterChange('tcKimlikNo')}
        placeholder="TC Kimlik No"
      />

      <TextField
        sx={{ width: '14%' }}
        label="Ad Soyad"
        value={currentFilters.adSoyad}
        onChange={handleFilterChange('adSoyad')}
        placeholder="Ad Soyad"
      />

      <TextField
        sx={{ width: '14%' }}
        label="Telefon"
        value={currentFilters.telefon}
        onChange={handleFilterChange('telefon')}
        placeholder="Telefon"
      />

      <TextField
        sx={{ width: '14%' }}
        label="Mahalle"
        value={currentFilters.mahalle}
        onChange={handleFilterChange('mahalle')}
        placeholder="Mahalle"
      />

      <TextField
        sx={{ width: '14%' }}
        label="Cadde Sokak"
        value={currentFilters.caddeSokak}
        onChange={handleFilterChange('caddeSokak')}
        placeholder="Cadde Sokak"
      />

      <DatePicker
        label="Başlangıç Tarihi"
        value={currentFilters.startDate ?? null}
        onChange={(newValue) => filters.setState({ startDate: newValue })}
        renderInput={(params) => <TextField {...params} size="small" />}
      />

      <DatePicker
        label="Bitiş Tarihi"
        value={currentFilters.endDate ?? null}
        onChange={(newValue) => filters.setState({ endDate: newValue })}
        renderInput={(params) => <TextField {...params} size="small" />}
      />
    </Box>
  );
}
