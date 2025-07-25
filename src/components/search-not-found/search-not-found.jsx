import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SearchNotFound({ query, sx, slotProps, ...other }) {
  if (!query) {
    return (
      <Typography variant="body2" {...slotProps?.description}>
        Lütfen anahtar kelimeleri giriniz
      </Typography>
    );
  }

  return (
    <Box
      sx={[
        {
          gap: 1,
          display: 'flex',
          borderRadius: 1.5,
          textAlign: 'center',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography
        variant="h6"
        {...slotProps?.title}
        sx={[
          { color: 'text.primary' },
          ...(Array.isArray(slotProps?.title?.sx)
            ? (slotProps?.title?.sx ?? [])
            : [slotProps?.title?.sx]),
        ]}
      >
        Bulunamadı
      </Typography>

      <Typography variant="body2" {...slotProps?.description}>
        &nbsp; <strong>{`"${query}"`}</strong> için hiçbir sonuç bulunamadı.
        <br /> Yazım hatalarını kontrol etmeyi veya tam kelimeleri kullanmayı deneyin.
      </Typography>
    </Box>
  );
}
