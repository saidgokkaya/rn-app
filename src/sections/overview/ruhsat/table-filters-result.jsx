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
      {/* Durum */}
      <FiltersBlock label="Durum:" isShow={currentFilters.isActive !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.isActive}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {/* Ruhsat No */}
      <FiltersBlock
        label="Ruhsat No"
        isShow={!!currentFilters.ruhsatNo}
      >
        <Chip
          {...chipProps}
          label={currentFilters.ruhsatNo}
          onDelete={() => handleRemoveField('ruhsatNo')}
        />
      </FiltersBlock>

      {/* T.C. Kimlik No */}
      <FiltersBlock
        label="T.C. Kimlik No"
        isShow={!!currentFilters.tcKimlikNo}
      >
        <Chip
          {...chipProps}
          label={currentFilters.tcKimlikNo}
          onDelete={() => handleRemoveField('tcKimlikNo')}
        />
      </FiltersBlock>

      {/* Ad Soyad */}
      <FiltersBlock
        label="Ad Soyad"
        isShow={!!currentFilters.fullName}
      >
        <Chip
          {...chipProps}
          label={currentFilters.fullName}
          onDelete={() => handleRemoveField('fullName')}
        />
      </FiltersBlock>

      {/* İşyeri Ünvanı */}
      <FiltersBlock
        label="İşyeri Ünvanı"
        isShow={!!currentFilters.isyeriUnvani}
      >
        <Chip
          {...chipProps}
          label={currentFilters.isyeriUnvani}
          onDelete={() => handleRemoveField('isyeriUnvani')}
        />
      </FiltersBlock>

      {/* Faaliyet Konusu */}
      <FiltersBlock
        label="Faaliyet Konusu"
        isShow={!!currentFilters.faaliyetKonusuName}
      >
        <Chip
          {...chipProps}
          label={currentFilters.faaliyetKonusuName}
          onDelete={() => handleRemoveField('faaliyetKonusuName')}
        />
      </FiltersBlock>

      {/* Ruhsat Türü */}
      <FiltersBlock
        label="Ruhsat Türü"
        isShow={!!currentFilters.ruhsatTuruName}
      >
        <Chip
          {...chipProps}
          label={currentFilters.ruhsatTuruName}
          onDelete={() => handleRemoveField('ruhsatTuruName')}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
