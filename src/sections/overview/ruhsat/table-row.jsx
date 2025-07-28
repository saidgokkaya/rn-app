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
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function UseTableRow({ row, selected, editHref, onSelectRow, onDeleteRow, onUpdateStatus }) {
  const [currentRow, setCurrentRow] = useState(row);
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();
  const imageDialog = useBoolean();
  const scannedDialog = useBoolean();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDownloadCertificate = async () => {
    const token = localStorage.getItem('jwt_access_token');

    try {
      const res = await fetch(`${CONFIG.apiUrl}/Ruhsat/download-certificate?id=${row.id}`, {
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

  async function handleDeleteScannedFile() {
    const token = localStorage.getItem('jwt_access_token');

    try {
      const res = await fetch(`${CONFIG.apiUrl}/Ruhsat/delete-scanned-file?id=${currentRow.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentRow((prev) => ({
        ...prev,
        scannedFilePath: null,
      }));

      toast.success('PDF başarıyla silindi.');
      scannedDialog.onFalse();
    } catch (error) {
      toast.error('PDF silinirken bir hata oluştu.');
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error('Lütfen bir PDF dosyası seçin.');
      return;
    }
    if (selectedFile.type !== 'application/pdf') {
      toast.error('Sadece PDF dosyası yükleyebilirsiniz.');
      return;
    }

    setUploading(true);

    const token = localStorage.getItem('jwt_access_token');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('id', currentRow.id);

    try {
      const res = await fetch(`${CONFIG.apiUrl}/Ruhsat/upload-scanned-file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Yükleme başarısız');

      const data = await res.json();
      setCurrentRow((prev) => ({
        ...prev,
        scannedFilePath: data.scannedFilePath || prev.scannedFilePath,
      }));

      toast.success('Dosya başarıyla yüklendi.');
      scannedDialog.onFalse();
      setSelectedFile(null);
    } catch (error) {
      toast.error('Dosya yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  }

  async function toggleCampaignStatus(id, isActive) {
    const token = localStorage.getItem('jwt_access_token');
    const nextLabel = isActive ? 'Pasif' : 'Aktif';
    const successMsg = isActive
      ? 'Ruhsat başarıyla pasifleştirildi.'
      : 'Ruhsat başarıyla aktifleştirildi.';

    try {
      const res = await fetch(
        `${CONFIG.apiUrl}/Ruhsat/permit-status?id=${id}`,
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
            handleDownloadCertificate();
            menuActions.onClose();
          }}>
            <Iconify icon="material-symbols:download-rounded" />
            İndir
          </MenuItem>
        </li>
        <li>
          <MenuItem
            onClick={() => {
              imageDialog.onTrue();
              menuActions.onClose();
            }}
          >
            <Iconify icon="material-symbols:image-outline-rounded" />
            Görsel
          </MenuItem>
        </li>
        <li>
          <MenuItem
            onClick={() => {
              scannedDialog.onTrue();
              menuActions.onClose();
            }}
          >
            <Iconify icon="mi:document" />
            Taranmış Belge
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

  const renderImageDialog = () => (
    <Dialog open={imageDialog.value} onClose={imageDialog.onFalse} maxWidth="sm" fullWidth>
      <DialogTitle>Görsel Önizleme</DialogTitle>
      <DialogContent dividers>
        {currentRow.photoPath ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={`/permit-photo/${currentRow.photoPath}`}
              alt="Ruhsat Görseli"
              style={{ maxWidth: '100%', maxHeight: 400 }}
            />
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Iconify icon="material-symbols:warning" />
            <p>Görsel bulunamadı</p>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderScannedDialog = () => (
    <Dialog open={scannedDialog.value} onClose={() => {
      scannedDialog.onFalse();
      setSelectedFile(null);
    }} maxWidth="md" fullWidth>
      <DialogTitle>Taranmış Belge</DialogTitle>
      {currentRow.scannedFilePath ? (
        <DialogContent dividers sx={{ minHeight: 400 }}>
          <Box sx={{ height: '80vh' }}>
            <iframe
              src={`/permit-pdf/${currentRow.scannedFilePath}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="PDF Preview"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteScannedFile}
            >
              PDF'yi Sil
            </Button>
          </Box>
        </DialogContent>
      ) : (
        <DialogContent dividers sx={{ minHeight: 200 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              border: '1px dashed grey',
              borderRadius: 1,
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
              flexDirection: 'column',
            }}
          >
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              PDF Seç
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Button>

            {selectedFile && (
              <Typography
                variant="caption"
                sx={{ mt: 1, wordBreak: 'break-word', textAlign: 'center' }}
              >
                {selectedFile.name}
              </Typography>
            )}

            <Button
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              disabled={!selectedFile || uploading}
              onClick={handleUpload}
            >
              {uploading ? 'Yükleniyor...' : 'Yükle'}
            </Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.ruhsatNo}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.tcKimlikNo}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.fullName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.isyeriUnvani}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.faaliyetKonusuName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{currentRow.ruhsatTuruName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(currentRow.verilisTarihi)}</TableCell>

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
      {renderImageDialog()}
      {renderScannedDialog()}
    </>
  );
}
