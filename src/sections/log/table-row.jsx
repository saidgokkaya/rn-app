import { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export function UseTableRow({ row, selected, onSelectRow }) {
  const [currentRow, setCurrentRow] = useState(row);

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {currentRow.userEmail}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {currentRow.userName}
              </Box>
            </Stack>
          </Box>
        </TableCell>
        
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.baseModule}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.moduleName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.processName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(currentRow.insertedDate)}</TableCell>
      </TableRow>
    </>
  );
}
