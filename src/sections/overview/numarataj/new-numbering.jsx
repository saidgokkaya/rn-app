import React, { useEffect, useState, useMemo } from 'react';
import {
  Grid, TextField, Box, Button, MenuItem, FormControl,
  InputLabel, Select, CircularProgress, Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';

export function NumberingForm() {
  const NUMARATAJ = {
    OZEL_ISYERI: 0,
    RESMI_KURUM: 1,
    YENI_BINA: 2,
    SAHA_CALISMASI: 3,
    ADRES_TESPIT: 4
  };

  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem('jwt_access_token'), []);

  const [tcKimlikNo, setTcKimlikNo] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [caddeSokak, setCaddeSokak] = useState('');
  const [disKapi, setDisKapi] = useState('');
  const [icKapiNo, setIcKapiNo] = useState('');
  const [siteAdi, setSiteAdi] = useState('');
  const [eskiAdres, setEskiAdres] = useState('');
  const [blokAdi, setBlokAdi] = useState('');
  const [adresNo, setAdresNo] = useState('');
  const [isYeriUnvani, setIsYeriUnvani] = useState('');
  const [ada, setAda] = useState('');
  const [parsel, setParsel] = useState('');
  const [numaratajType, setNumaratajType] = useState(0);
  const [mahalleId, setMahalleId] = useState('');
  const [mahalleler, setMahalleler] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMahalleler = async () => {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Numarataj/mahalles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setMahalleler(data);
      } catch (error) {
        toast.error('Mahalleler alınamadı');
      }
    };
    fetchMahalleler();
  }, [token]);

  const handleSubmit = async () => {
    if (!adSoyad) return toast.error('Lütfen Ad Soyad giriniz.');
    if (!mahalleId) return toast.error('Lütfen Mahalle seçiniz.');
    if (!caddeSokak) return toast.error('Lütfen Cadde / Sokak giriniz.');
    if (!disKapi) return toast.error('Lütfen Dış Kapı No giriniz.');

    try {
      setLoading(true);

      const payload = {
        tcKimlikNo,
        adSoyad,
        telefon,
        caddeSokak,
        disKapi,
        icKapiNo,
        siteAdi,
        eskiAdres,
        blokAdi,
        adresNo,
        isYeriUnvani,
        ada,
        parsel,
        numaratajType,
        mahalleId
      };

      const response = await fetch(`${CONFIG.apiUrl}/Numarataj/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      toast.success('Numarataj bilgisi başarıyla kaydedildi.');
      navigate('/dashboard/numbering/common-areas');
    } catch (error) {
      toast.error('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySubmit = async () => {
    if (!adSoyad) return toast.error('Lütfen Ad Soyad giriniz.');
    if (!mahalleId) return toast.error('Lütfen Mahalle seçiniz.');
    if (!caddeSokak) return toast.error('Lütfen Cadde / Sokak giriniz.');
    if (!disKapi) return toast.error('Lütfen Dış Kapı No giriniz.');

    try {
      setLoading(true);

      const payload = {
        tcKimlikNo,
        adSoyad,
        telefon,
        caddeSokak,
        disKapi,
        icKapiNo,
        siteAdi,
        eskiAdres,
        blokAdi,
        adresNo,
        isYeriUnvani,
        ada,
        parsel,
        numaratajType,
        mahalleId
      };

      const response = await fetch(`${CONFIG.apiUrl}/Numarataj/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      toast.success('Numarataj bilgisi başarıyla kaydedildi.');
    } catch (error) {
      toast.error('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel>Numarataj Tipi</InputLabel>
              <Select
                value={numaratajType}
                onChange={(e) => setNumaratajType(Number(e.target.value))}
                label="Numarataj Tipi"
              >
                <MenuItem value={0}>Özel İşyeri</MenuItem>
                <MenuItem value={1}>Resmi Kurum</MenuItem>
                <MenuItem value={2}>Yeni Bina</MenuItem>
                <MenuItem value={3}>Saha Çalışması</MenuItem>
                <MenuItem value={4}>Adres Tespit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="TC Kimlik No" value={tcKimlikNo} onChange={(e) => setTcKimlikNo(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Ad Soyad" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>Mahalle Seç</InputLabel>
                  <Select value={mahalleId} onChange={(e) => setMahalleId(e.target.value)} label="Mahalle Seç">
                    {mahalleler.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Cadde / Sokak" value={caddeSokak} onChange={(e) => setCaddeSokak(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Site Adı" value={siteAdi} onChange={(e) => setSiteAdi(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.YENI_BINA, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Dış Kapı No" value={disKapi} onChange={(e) => setDisKapi(e.target.value)} fullWidth inputProps={{ maxLength: 6 }} helperText={`${disKapi.length}/6`}/>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="İç Kapı No" value={icKapiNo} onChange={(e) => setIcKapiNo(e.target.value)} fullWidth inputProps={{ maxLength: 6 }} helperText={`${icKapiNo.length}/6`}/>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {numaratajType === NUMARATAJ.ADRES_TESPIT && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Eski Adres" value={eskiAdres} onChange={(e) => setEskiAdres(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.YENI_BINA, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Ada" value={ada} onChange={(e) => setAda(e.target.value)} fullWidth inputProps={{ maxLength: 6 }} helperText={`${ada.length}/6`}/>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.SAHA_CALISMASI, NUMARATAJ.YENI_BINA, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Parsel" value={parsel} onChange={(e) => setParsel(e.target.value)} fullWidth inputProps={{ maxLength: 6 }} helperText={`${parsel.length}/6`}/>
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.ADRES_TESPIT, NUMARATAJ.RESMI_KURUM, NUMARATAJ.OZEL_ISYERI].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Adres No" value={adresNo} onChange={(e) => setAdresNo(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {numaratajType === NUMARATAJ.OZEL_ISYERI && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="İşyeri Ünvanı" value={isYeriUnvani} onChange={(e) => setIsYeriUnvani(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}

          {[NUMARATAJ.OZEL_ISYERI, NUMARATAJ.YENI_BINA].includes(numaratajType) && (
            <>
              <Grid item xs={12} sm={5}>
                <TextField label="Blok Adı" value={blokAdi} onChange={(e) => setBlokAdi(e.target.value)} fullWidth />
              </Grid>
              <Grid item xs={12} sm={1}></Grid>
            </>
          )}
        </Grid>
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Kaydet'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopySubmit}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Kopya Oluştur'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
