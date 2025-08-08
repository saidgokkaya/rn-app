import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function TableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveField = useCallback(
    (field) => {
      onResetPage();
      const resetValue = field === 'startDate' || field === 'endDate' ? null : '';
      updateFilters({ [field]: resetValue });
    },
    [onResetPage, updateFilters]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('tr-TR');
    } catch {
      return '';
    }
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="E-Posta" isShow={!!currentFilters.userEmail}>
        <Chip
          {...chipProps}
          label={currentFilters.userEmail}
          onDelete={() => handleRemoveField('userEmail')}
        />
      </FiltersBlock>

      <FiltersBlock label="Ad Soyad" isShow={!!currentFilters.userName}>
        <Chip
          {...chipProps}
          label={currentFilters.userName}
          onDelete={() => handleRemoveField('userName')}
        />
      </FiltersBlock>

      <FiltersBlock label="Ana Modül" isShow={!!currentFilters.baseModule}>
        <Chip
          {...chipProps}
          label={currentFilters.baseModule}
          onDelete={() => handleRemoveField('baseModule')}
        />
      </FiltersBlock>

      <FiltersBlock label="Alt Modül" isShow={!!currentFilters.moduleName}>
        <Chip
          {...chipProps}
          label={currentFilters.moduleName}
          onDelete={() => handleRemoveField('moduleName')}
        />
      </FiltersBlock>

      <FiltersBlock label="Yapılan İşlem" isShow={!!currentFilters.processName}>
        <Chip
          {...chipProps}
          label={currentFilters.processName}
          onDelete={() => handleRemoveField('processName')}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Başlangıç Tarihi"
        isShow={!!currentFilters.startDate}
      >
        <Chip
          {...chipProps}
          label={formatDate(currentFilters.startDate)}
          onDelete={() => handleRemoveField('startDate')}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Bitiş Tarihi"
        isShow={!!currentFilters.endDate}
      >
        <Chip
          {...chipProps}
          label={formatDate(currentFilters.endDate)}
          onDelete={() => handleRemoveField('endDate')}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
