import { useState, useCallback, useEffect } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, editHref, onSelectRow, onDeleteRow }) {
  const [currentRow, setCurrentRow] = useState(row);  // Durumu izleyen state
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const renderQuickEditForm = () => (
    <UserQuickEditForm
      currentUser={currentRow}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
  );

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Düzenle
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Sil
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Sil"
      content="Silmek istediğinizden emin misiniz?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Sil
        </Button>
      }
    />
  );

  const handleStatusChange = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Organization/status-user?userId=${currentRow.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        let errorResponse = { message: "Sunucudan beklenmeyen bir hata döndü." };

        try {
          errorResponse = await response.json();
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }

        throw new Error(errorResponse.message || "Bir hata oluştu!");
      }

      const updatedStatus = currentRow.isActive === 'Aktif' ? 'Pasif' : 'Aktif';
      setCurrentRow((prevState) => ({
        ...prevState,
        isActive: updatedStatus,  // Durumu güncelle
      }));

      const statusMessage = updatedStatus === 'Aktif' ? 'aktif' : 'pasif';
      toast.success('Kullanıcı ' + statusMessage + ' hale getirildi!');
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "Silme işlemi başarısız!");
    }
  }, [currentRow]);

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{
              id: `${currentRow.id}-checkbox`,
              'aria-label': `${currentRow.id} checkbox`,
            }}
          />
        </TableCell>

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link
                component={RouterLink}
                href={editHref}
                color="inherit"
                sx={{ cursor: 'pointer' }}
              >
                {currentRow.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {currentRow.mail}
              </Box>
            </Stack>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.phone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.title}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.dateOfBirth}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (currentRow.isActive === 'Aktif' && 'success') ||
              (currentRow.isActive === 'Pasif' && 'error') ||
              'default'
            }
          >
            {currentRow.isActive}
          </Label>
        </TableCell>

        <TableCell>
          <Button
            variant="outlined"
            color={currentRow.isActive === 'Aktif' ? 'error' : 'success'}
            onClick={handleStatusChange}
          >
            {currentRow.isActive === 'Aktif' ? 'Pasif Yap' : 'Aktif Yap'}
          </Button>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color={menuActions.open ? 'inherit' : 'default'}
              onClick={menuActions.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>

      {renderQuickEditForm()}
      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
