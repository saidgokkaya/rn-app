import { useState, useCallback, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UseTableRow } from '../table-row';
import { TableToolbar } from '../table-toolbar';
import { TableFiltersResult } from '../table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'Hepsi' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'id', label: 'Belge No', width: 100 },
  { id: 'numaratajType', label: 'Numarataj Alanı', width: 100 },
  { id: 'tcKimlikNo', label: 'TC Kimlik No', width: 100 },
  { id: 'adSoyad', label: 'Ad Soyad', width: 100 },
  { id: 'telefon', label: 'Telefon', width: 100 },
  { id: 'insertedDate', label: 'Tarih', width: 100 },
  { id: 'mahalle', label: 'Mahalle', width: 100 },
  { id: 'caddeSokak', label: 'Cadde / Sokak', width: 100 },
  { id: 'isVisible', label: 'Pdf için Tckn ve Telefon Görünsün', width: 100 },
  { id: 'isActive', label: 'Durum', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function NumaratajListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = useSetState({ id: '', numaratajType: '', tcKimlikNo: '', adSoyad: '', telefon: '', mahalle: '', caddeSokak: '', disKapi: '', icKapiNo: '', isActive: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Numarataj/numberings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error('Veri çekerken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
  currentFilters.isActive !== 'all' ||
  !!currentFilters.id ||
  !!currentFilters.numaratajType ||
  !!currentFilters.tcKimlikNo ||
  !!currentFilters.adSoyad ||
  !!currentFilters.telefon ||
  !!currentFilters.mahalle ||
  !!currentFilters.caddeSokak ||
  !!currentFilters.disKapi ||
  !!currentFilters.icKapiNo;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
  
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Numarataj/delete-numbering?id=${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        toast.success('Silme işlemi başarılı!');
      } catch (error) {
        toast.error(error.message || "Silme işlemi başarısız!");
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedNumberingIds = table.selected;
  
      if (selectedNumberingIds.length === 0) {
        toast.error('Silinecek kullanıcı seçilmedi!');
        return;
      }
      
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Numarataj/delete-numberings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numberingIds: selectedNumberingIds })
      });
  
      const deleteRows = tableData.filter((row) => !selectedNumberingIds.includes(row.id));
      setTableData(deleteRows);
      
      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  
      toast.success('Silme işlemi başarılı!');
    } catch (error) {
      toast.error(error.message || "Silme işlemi başarısız!");
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ isActive: newValue });
    },
    [updateFilters, table]
  );

  const handleUpdateStatus = useCallback((id, newStatus) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isActive: newStatus } : item
      )
    );
  }, []);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Sil"
      content={
        <>
          <strong> {table.selected.length} </strong> öğeyi silmek istediğinizden emin misiniz?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Sil
        </Button>
      }
    />
  );

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('jwt_access_token');
      const ids = dataFiltered.map((row) => row.id);

      const response = await fetch(`${CONFIG.apiUrl}/Numarataj/export-excel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numberingIds: ids }),
      });

      if (!response.ok) {
        throw new Error('Excel indirme başarısız');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'numarataj.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error.message || 'Excel indirme sırasında hata oluştu');
    }
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Ortak Alan"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Numarataj' },
            { name: 'Ortak Alan' },
          ]}
          action={
            <>
              <Button
                component={RouterLink}
                href={paths.dashboard.numbering.report}
                variant="contained"
                startIcon={<Iconify icon="mynaui:chart-graph-solid" />}
              >
                Rapor
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.numbering.neighbourhood}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Mahalle
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.numbering.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Numarataj Ekle
              </Button>
            </>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={currentFilters.isActive}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.isActive) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'Aktif' && 'success') ||
                      (tab.value === 'Pasif' && 'error') ||
                      'default'
                    }
                  >
                    {['Aktif', 'Pasif'].includes(tab.value)
                      ? tableData.filter((user) => user.isActive === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}

            <Button
              startIcon={<Iconify icon="material-symbols:download" />}
              onClick={handleExportExcel}
              sx={{ ml: 'auto', mr: 2 }}
            >
              Excel İndir
            </Button>
          </Tabs>

          <TableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <TableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Sil">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UseTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.numbering.edit(row.id)}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const {
    id,
    isActive,
    numaratajType,
    tcKimlikNo,
    adSoyad,
    telefon,
    mahalle,
    caddeSokak,
    disKapi,
    icKapiNo,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  const trLower = (val) => val?.toLocaleLowerCase('tr-TR') || '';

  if (id !== undefined && id !== null && id !== '') {
    const idNumber = typeof id === 'string' ? parseInt(id, 10) : id;
    if (!isNaN(idNumber)) {
      inputData = inputData.filter((item) => item.id === idNumber);
    }
  }

  if (isActive !== 'all') {
    inputData = inputData.filter((item) => item.isActive === isActive);
  }

  if (numaratajType) {
    inputData = inputData.filter((item) =>
      trLower(item.numaratajType).includes(trLower(numaratajType))
    );
  }

  if (tcKimlikNo) {
    inputData = inputData.filter((item) =>
      trLower(item.tcKimlikNo).includes(trLower(tcKimlikNo))
    );
  }

  if (adSoyad) {
    inputData = inputData.filter((item) =>
      trLower(item.adSoyad).includes(trLower(adSoyad))
    );
  }

  if (telefon) {
    inputData = inputData.filter((item) =>
      trLower(item.telefon).includes(trLower(telefon))
    );
  }

  if (mahalle) {
    inputData = inputData.filter((item) =>
      trLower(item.mahalle).includes(trLower(mahalle))
    );
  }

  if (caddeSokak) {
    inputData = inputData.filter((item) =>
      trLower(item.caddeSokak).includes(trLower(caddeSokak))
    );
  }

  return inputData;
}