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

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'Hepsi' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'name', label: 'Ad Soyad', width: 220 },
  { id: 'phone', label: 'Telefon', width: 200 },
  { id: 'title', label: 'Pozisyon', width: 180 },
  { id: 'dateOfBirth', label: 'Doğum Tarihi', width: 200 },
  { id: 'isActive', label: 'Durum', width: 100 },
  { id: '', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  
  // API'den alınan veriyi depolamak için state
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);  // Loading durumu için state

  const filters = useSetState({ name: '', isActive: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Organization/users`, {
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
    !!currentFilters.name || currentFilters.isActive !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
  
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Organization/delete-user?userId=${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
  
        toast.success('Silme işlemi başarılı!');
      } catch (error) {
        toast.error(error.message || "Silme işlemi başarısız!");
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedUserIds = table.selected;
  
      if (selectedUserIds.length === 0) {
        toast.error('Silinecek kullanıcı seçilmedi!');
        return;
      }
      
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Organization/delete-users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserIds })
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
  
      const deleteRows = tableData.filter((row) => !selectedUserIds.includes(row.id));
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
          heading="Kullanıcı Listesi"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Organizasyon' },
            { name: 'Kullanıcı Listesi' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Yeni Kullanıcı
            </Button>
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

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <UserTableFiltersResult
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.user.edit(row.id)}
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
  const { name, isActive } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (isActive !== 'all') {
    inputData = inputData.filter((user) => user.isActive === isActive);
  }

  return inputData;
}
