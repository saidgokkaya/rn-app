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
  { id: 'ruhsatNo', label: 'Ruhsat No', width: 100 },
  { id: 'tcKimlikNo', label: 'Vergi No', width: 100 },
  { id: 'fullName', label: 'Ad Soyad', width: 100 },
  { id: 'isyeriUnvani', label: 'İşyeri Ünvanı', width: 100 },
  { id: 'faaliyetKonusuName', label: 'Faaliyet Konusu', width: 100 },
  { id: 'ruhsatTuruName', label: 'Ruhsat Türü', width: 100 },
  { id: 'verilisTarihi', label: 'Veriliş Tarihi', width: 100 },
  { id: 'isActive', label: 'Durum', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function RuhsatListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = useSetState({ ruhsatNo: '', tcKimlikNo: '', fullName: '', isyeriUnvani: '', faaliyetKonusuName: '', ruhsatTuruName: '', isActive: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/permits`, {
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
  !!currentFilters.ruhsatNo ||
  !!currentFilters.tcKimlikNo ||
  !!currentFilters.fullName ||
  !!currentFilters.isyeriUnvani ||
  !!currentFilters.faaliyetKonusuName ||
  !!currentFilters.ruhsatTuruName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
  
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/delete-permit?id=${id}`, {
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
      const selectedPermitIds = table.selected;
  
      if (selectedPermitIds.length === 0) {
        toast.error('Silinecek kullanıcı seçilmedi!');
        return;
      }
      
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/delete-permits`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permitIds: selectedPermitIds })
      });
  
      const deleteRows = tableData.filter((row) => !selectedPermitIds.includes(row.id));
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

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Ruhsat"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Ruhsat' },
          ]}
          action={
            <>
              <Button
                component={RouterLink}
                href={paths.dashboard.permit.activity}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Faaliyet Konusu
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.permit.class}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Ruhsat Sınıfı
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.permit.warehouse}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Depo
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.permit.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Ruhsat Ekle
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
                        editHref={paths.dashboard.permit.edit(row.id)}
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
    ruhsatNo,
    tcKimlikNo,
    fullName,
    isyeriUnvani,
    faaliyetKonusuName,
    ruhsatTuruName,
    isActive,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Her bir filtre alanı için ayrı ayrı filtreleme
  if (ruhsatNo) {
    inputData = inputData.filter((item) =>
      item.ruhsatNo?.toLowerCase().includes(ruhsatNo.toLowerCase())
    );
  }

  if (tcKimlikNo) {
    inputData = inputData.filter((item) =>
      item.tcKimlikNo?.toLowerCase().includes(tcKimlikNo.toLowerCase())
    );
  }

  if (fullName) {
    inputData = inputData.filter((item) =>
      item.fullName?.toLowerCase().includes(fullName.toLowerCase())
    );
  }

  if (isyeriUnvani) {
    inputData = inputData.filter((item) =>
      item.isyeriUnvani?.toLowerCase().includes(isyeriUnvani.toLowerCase())
    );
  }

  if (faaliyetKonusuName) {
    inputData = inputData.filter((item) =>
      item.faaliyetKonusuName?.toLowerCase().includes(faaliyetKonusuName.toLowerCase())
    );
  }

  if (ruhsatTuruName) {
    inputData = inputData.filter((item) =>
      item.ruhsatTuruName?.toLowerCase().includes(ruhsatTuruName.toLowerCase())
    );
  }

  if (isActive !== 'all') {
    inputData = inputData.filter((item) => item.isActive === isActive);
  }

  return inputData;
}