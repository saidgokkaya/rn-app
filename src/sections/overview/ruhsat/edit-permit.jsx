import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
  Paper,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';

export function PermitForm({ data, id }) {
  const navigate = useNavigate();

  const [turs, setTurs] = useState([]);
  const [activities, setActivities] = useState([]);

  const [selectedTurId, setSelectedTurId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('');

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseForm, setWarehouseForm] = useState({});

  const [ruhsatNo, setruhsatNo] = useState('');
  const [tcKimlikNo, settcKimlikNo] = useState('');
  const [adi, setadi] = useState('');
  const [soyadi, setsoyadi] = useState('');
  const [isyeriUnvani, setisyeriUnvani] = useState('');
  const [adres, setadres] = useState('');
  const [not, setnot] = useState('');
  const [ada, setada] = useState('');
  const [parsel, setparsel] = useState('');
  const [pafta, setpafta] = useState('');
  const [verilisTarihi, setverilisTarihi] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  const token = useMemo(() => localStorage.getItem('jwt_access_token'), []);

  const isGSM = useMemo(() => {
    const tur = turs.find(t => t.id === selectedTurId);
    return tur && tur.name.toLowerCase() === 'gayrisıhhi müessese';
  }, [selectedTurId, turs]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Sadece JPG, JPEG veya PNG formatındaki dosyalar desteklenir.');
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  useEffect(() => {
    const fetchTur = async () => {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/ruhsat-turu`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTurs(data);
      } catch (error) {
        console.error('Ruhsat türleri alınamadı:', error);
      }
    };

    const fetchActivity = async () => {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/activities`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Aktiviteler alınamadı:', error);
      }
    };

    fetchTur();
    fetchActivity();
  }, [token]);

  useEffect(() => {
    if (!id) return;
    setSelectedTurId(data.ruhsatTuruId);
    setSelectedActivityId(data.faaliyetKonusuId);
    setruhsatNo(data.ruhsatNo);
    settcKimlikNo(data.tcKimlikNo);
    setadi(data.adi);
    setsoyadi(data.soyadi);
    setisyeriUnvani(data.isyeriUnvani);
    setverilisTarihi(dayjs(data.verilisTarihi));
    setada(data.ada);
    setparsel(data.parsel);
    setpafta(data.pafta);
    setadres(data.adres);
    setnot(data.not);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    if (turs.length > 0 && activities.length > 0 && (!isGSM || classes.length > 0)) {
      setSelectedClassId(data.ruhsatSinifiId);
      if (data.warehouses) {
        const initialForm = {};
        Object.entries(data.warehouses).forEach(([id, depo]) => {
          initialForm[id] = depo.bilgi || '';
        });
        setWarehouseForm(initialForm);
        setWarehouses(data.warehouses);
      }
    }
  }, [id, turs, classes, isGSM]);

  useEffect(() => {
    if (!selectedTurId || !isGSM) {
      setClasses([]);
      setSelectedClassId('');
      setWarehouses([]);
      setWarehouseForm({});
      return;
    }

    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/classes-type?ruhsatTuruId=${selectedTurId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Sınıflar alınamadı:', error);
        toast.error('Ruhsat sınıfları alınamadı');
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [selectedTurId, isGSM, token]);

  const handleWarehouseChange = (id, value) => {
    setWarehouseForm(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('id', id);
      formData.append('image', selectedFile);
      formData.append('activityId', selectedActivityId);
      formData.append('turId', selectedTurId);
      formData.append('classId', selectedClassId || '');
      formData.append('ruhsatNo', ruhsatNo);
      formData.append('tcKimlikNo', tcKimlikNo);
      formData.append('adi', adi);
      formData.append('soyadi', soyadi);
      formData.append('isyeriUnvani', isyeriUnvani);
      formData.append('verilisTarihi', verilisTarihi ? dayjs(verilisTarihi).format('YYYY-MM-DD') : '');
      formData.append('ada', ada);
      formData.append('parsel', parsel);
      formData.append('pafta', pafta);
      formData.append('adres', adres);
      formData.append('not', not);

      if (isGSM && selectedClassId) {
        formData.append('warehouses', JSON.stringify(warehouseForm));
      }

      const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      toast.success('Ruhsat başarıyla kaydedildi');
      navigate('/dashboard/permit');
    } catch (error) {
      toast.error('Kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={5}>
                <FormControl fullWidth>
                  <InputLabel>Faaliyet Konusu</InputLabel>
                  <Select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    label="Faaliyet Konusu"
                  >
                    {activities.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <ListItemText
                          primary={x.name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <FormControl fullWidth disabled>
                  <InputLabel>Ruhsat Türü</InputLabel>
                  <Select
                    value={selectedTurId}
                    onChange={(e) => setSelectedTurId(e.target.value)}
                    label="Ruhsat Türü"
                  >
                    {turs.map((x) => (
                      <MenuItem key={x.id} value={x.id}>
                        <ListItemText
                          primary={x.name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {isGSM && (
                <>
                  <Grid item xs={12} sm={6} md={5}>
                    <FormControl fullWidth disabled>
                      <InputLabel>Ruhsat Sınıfı</InputLabel>
                      <Select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        label="Ruhsat Sınıfı"
                      >
                        {loadingClasses && <MenuItem disabled>Yükleniyor...</MenuItem>}
                        {!loadingClasses && classes.map(c => (
                          <MenuItem key={c.id} value={c.id}>
                            <ListItemText primary={c.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                  </Grid>
                </>
              )}

              {isGSM && selectedClassId && (
                <Grid item xs={12} sm={6} md={11}>
                  <Typography variant="h6" gutterBottom>Depolar</Typography>

                  {loadingWarehouses ? (
                    <CircularProgress size={24} />
                  ) : Object.keys(warehouses).length === 0 ? (
                    <Box mt={2}>
                      <Typography variant="body1" color="textSecondary">
                        <Button variant="text" onClick={() => navigate('/dashboard/permit/warehouse')}>
                          Buraya tıklayarak depo ekleyebilirsiniz
                        </Button>
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {Object.entries(warehouses).map(([id, depo]) => (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                          <TextField
                            fullWidth
                            label={depo.depoAdi}
                            value={warehouseForm[id] !== undefined ? warehouseForm[id] : depo.bilgi || ''}
                            onChange={(e) => handleWarehouseChange(id, e.target.value)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="Ruhsat No"
                  value={ruhsatNo}
                  onChange={(e) => setruhsatNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="TC. / Vergi No"
                  value={tcKimlikNo}
                  onChange={(e) => settcKimlikNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="Adı"
                  value={adi}
                  onChange={(e) => setadi(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="Soyadı"
                  value={soyadi}
                  onChange={(e) => setsoyadi(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="İşyeri Ünvanı"
                  value={isyeriUnvani}
                  onChange={(e) => setisyeriUnvani(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <DatePicker
                  label="Veriliş Tarihi"
                  value={verilisTarihi}
                  onChange={(newValue) => setverilisTarihi(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="text"
                  fullWidth
                  label="Ada"
                  value={ada}
                  onChange={(e) => setada(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="text"
                  fullWidth
                  label="Parsel"
                  value={parsel}
                  onChange={(e) => setparsel(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  type="text"
                  fullWidth
                  label="Pafta"
                  value={pafta}
                  onChange={(e) => setpafta(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="Adres"
                  value={adres}
                  onChange={(e) => setadres(e.target.value)}
                  multiline
                  minRows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1}>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  type="text"
                  fullWidth
                  label="Açıklama / Not"
                  value={not}
                  onChange={(e) => setnot(e.target.value)}
                  multiline
                  minRows={4}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 2 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={5}>
                <Button variant="outlined" component="label" fullWidth>
                  Görsel Yükle (JPG, JPEG, PNG)
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}></Grid>
              <Grid item xs={12} sm={6} md={3}>
                {(previewUrl || data?.imageUrl) && (
                  <Box
                    component="img"
                    src={previewUrl || `/permit-photo/${data?.imageUrl}`}
                    alt="Önizleme"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>
    </Box>
  );
}
