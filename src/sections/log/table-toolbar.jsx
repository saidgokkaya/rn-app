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
        sx={{ width: '18%' }}
        label="E-Posta"
        value={currentFilters.userEmail}
        onChange={handleFilterChange('userEmail')}
        placeholder="E-Posta"
      />

      <TextField
        sx={{ width: '18%' }}
        label="Ad Soyad"
        value={currentFilters.userName}
        onChange={handleFilterChange('userName')}
        placeholder="Ad Soyad"
      />

      <TextField
        sx={{ width: '18%' }}
        label="Ana Modül"
        value={currentFilters.baseModule}
        onChange={handleFilterChange('baseModule')}
        placeholder="Ana Modül"
      />

      <TextField
        sx={{ width: '18%' }}
        label="Alt Modül"
        value={currentFilters.moduleName}
        onChange={handleFilterChange('moduleName')}
        placeholder="Alt Modül"
      />

      <TextField
        sx={{ width: '18%' }}
        label="Yapılan İşlem"
        value={currentFilters.processName}
        onChange={handleFilterChange('processName')}
        placeholder="Yapılan İşlem"
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
