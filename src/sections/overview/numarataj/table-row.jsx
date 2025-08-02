import { useState, useCallback, useEffect } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import Switch from '@mui/material/Switch';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function UseTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, onUpdateStatus }) {
  const [currentRow, setCurrentRow] = useState({
    ...row,
    isVisible: row.isVisible !== undefined ? row.isVisible : true,
  });
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const handleDownloadCertificate = async (isVisible) => {
    const token = localStorage.getItem('jwt_access_token');

    try {
      const res = await fetch(`${CONFIG.apiUrl}/Numarataj/download-certificate?id=${row.id}&visibilty=${isVisible}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        toast.error('Yazdırma penceresi açılamadı.');
      }
    } catch (err) {
      toast.error('PDF indirilemedi.');
    }
  };

  async function toggleCampaignStatus(id, isActive) {
    const token = localStorage.getItem('jwt_access_token');
    const nextLabel = isActive ? 'Pasif' : 'Aktif';
    const successMsg = isActive
      ? 'Numarataj başarıyla pasifleştirildi.'
      : 'Numarataj başarıyla aktifleştirildi.';

    try {
      const res = await fetch(
        `${CONFIG.apiUrl}/Numarataj/numbering-status?id=${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      onUpdateStatus(id, nextLabel);

      setCurrentRow((prev) => ({
        ...prev,
        isActive: nextLabel,
      }));

      toast.success(successMsg);
    } catch (error) {
      toast.error('Bir hata oluştu.');
    }
  }

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem onClick={() => {
            handleDownloadCertificate(currentRow.isVisible);
            menuActions.onClose();
          }}>
            <Iconify icon="material-symbols:download-rounded" />
            İndir
          </MenuItem>
        </li>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <li>
          <MenuItem component={RouterLink} onClick={() => { toggleCampaignStatus(row.id, row.isActive === 'Aktif'); }}>
            <Iconify icon="fluent:status-16-filled" />
            {row.isActive === 'Aktif' ? 'Pasif yap' : 'Aktif yap'}
          </MenuItem>
        </li>
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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.id}</TableCell>
        
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.numaratajType}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.tcKimlikNo}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.adSoyad}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.telefon}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(currentRow.insertedDate)}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.mahalle}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.caddeSokak}</TableCell>
        
        <TableCell>
          {currentRow.numaratajType !== 'Yeni Bina' && (
            <Switch
              checked={currentRow.isVisible ?? true}
              onChange={() => {
                const newVisibility = !(currentRow.isVisible ?? true);
                setCurrentRow(prev => ({ ...prev, isVisible: newVisibility }));
              }}
              color="primary"
              inputProps={{ 'aria-label': 'Göster/Gizle' }}
            />
          )}
        </TableCell>

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

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
