import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function TableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveField = useCallback(
    (field) => {
      onResetPage();
      updateFilters({ [field]: '' });
    },
    [onResetPage, updateFilters]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Durum:" isShow={currentFilters.isActive !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.isActive}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>
      <FiltersBlock label="Belge No" isShow={!!currentFilters.id}>
        <Chip
          {...chipProps}
          label={currentFilters.id}
          onDelete={() => handleRemoveField('id')}
        />
      </FiltersBlock>

      <FiltersBlock label="Numarataj Tipi" isShow={!!currentFilters.numaratajType}>
        <Chip
          {...chipProps}
          label={currentFilters.numaratajType}
          onDelete={() => handleRemoveField('numaratajType')}
        />
      </FiltersBlock>

      <FiltersBlock label="TC Kimlik No" isShow={!!currentFilters.tcKimlikNo}>
        <Chip
          {...chipProps}
          label={currentFilters.tcKimlikNo}
          onDelete={() => handleRemoveField('tcKimlikNo')}
        />
      </FiltersBlock>

      <FiltersBlock label="Ad Soyad" isShow={!!currentFilters.adSoyad}>
        <Chip
          {...chipProps}
          label={currentFilters.adSoyad}
          onDelete={() => handleRemoveField('adSoyad')}
        />
      </FiltersBlock>

      <FiltersBlock label="Telefon" isShow={!!currentFilters.telefon}>
        <Chip
          {...chipProps}
          label={currentFilters.telefon}
          onDelete={() => handleRemoveField('telefon')}
        />
      </FiltersBlock>

      <FiltersBlock label="Mahalle" isShow={!!currentFilters.mahalle}>
        <Chip
          {...chipProps}
          label={currentFilters.mahalle}
          onDelete={() => handleRemoveField('mahalle')}
        />
      </FiltersBlock>

      <FiltersBlock label="Cadde Sokak" isShow={!!currentFilters.caddeSokak}>
        <Chip
          {...chipProps}
          label={currentFilters.caddeSokak}
          onDelete={() => handleRemoveField('caddeSokak')}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
