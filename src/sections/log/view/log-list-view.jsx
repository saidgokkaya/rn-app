import { useState, useCallback, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import dayjs from 'dayjs';
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

import { DashboardContent } from 'src/layouts/dashboard';
import { _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

const STATUS_OPTIONS = [{ value: 'all', label: 'Hepsi' }];

const TABLE_HEAD = [
  { id: 'userEmail', label: 'Kullanıcı', width: 100 },
  { id: 'baseModule', label: 'Ana Modül', width: 100 },
  { id: 'moduleName', label: 'Alt Modül', width: 100 },
  { id: 'processName', label: 'Yapılan İşlem', width: 100 },
  { id: 'insertedDate', label: 'Tarih', width: 100 },
];

// ----------------------------------------------------------------------

export function LogListView() {
  const table = useTable();
  const confirmDialog = useBoolean();
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = useSetState({ userEmail: '', userName: '', baseModule: '', moduleName: '', processName: '', startDate: null, endDate: null, isActive: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Organization/log`, {
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

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ isActive: newValue });
    },
    [updateFilters, table]
  );
 
  const canReset =
  currentFilters.isActive !== 'all' ||
  !!currentFilters.userEmail ||
  !!currentFilters.userName ||
  !!currentFilters.baseModule ||
  !!currentFilters.moduleName ||
  !!currentFilters.processName ||
  !!currentFilters.startDate ||
  !!currentFilters.endDate; 

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('jwt_access_token');
      const ids = dataFiltered.map((row) => row.id);

      const response = await fetch(`${CONFIG.apiUrl}/Organization/log-export-excel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logIds: ids }),
      });

      if (!response.ok) {
        throw new Error('Excel indirme başarısız');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'log.xlsx');
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
          heading="Log"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Yönetim' },
            { name: 'Log' },
          ]}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const {
    userEmail,
    userName,
    baseModule,
    moduleName,
    processName,
    startDate,
    endDate,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  const trLower = (val) => val?.toLocaleLowerCase('tr-TR') || '';

  if (userEmail) {
    inputData = inputData.filter((item) =>
      trLower(item.userEmail).includes(trLower(userEmail))
    );
  }

  if (userName) {
    inputData = inputData.filter((item) =>
      trLower(item.userName).includes(trLower(userName))
    );
  }

  if (baseModule) {
    inputData = inputData.filter((item) =>
      trLower(item.baseModule).includes(trLower(baseModule))
    );
  }

  if (moduleName) {
    inputData = inputData.filter((item) =>
      trLower(item.moduleName).includes(trLower(moduleName))
    );
  }

  if (processName) {
    inputData = inputData.filter((item) =>
      trLower(item.processName).includes(trLower(processName))
    );
  }

  if (startDate) {
    console.log('denee');
    const start = dayjs(startDate).startOf('day');
    inputData = inputData.filter((item) => {
      return dayjs(item.insertedDate).isAfter(start) || dayjs(item.insertedDate).isSame(start);
    });
  }

  if (endDate) {
    const end = dayjs(endDate).endOf('day');
    inputData = inputData.filter((item) => {
      return dayjs(item.insertedDate).isBefore(end) || dayjs(item.insertedDate).isSame(end);
    });
  }

  return inputData;
}