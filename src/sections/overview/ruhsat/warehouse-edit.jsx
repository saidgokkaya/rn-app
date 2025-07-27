import { useState, useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CONFIG } from 'src/global-config';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

const NewTourSchema = zod.object({
  name: zod.array(
    zod.object({
      id: zod.any().optional(),
      name: zod.string().min(1, { message: 'Name is required!' }),
      ruhsatSinifiId: zod.number({ required_error: 'Ruhsat sınıfı seçilmelidir!' }),
    })
  ).min(1, { message: 'En az bir depo gereklidir!' }),
});

export function WareHouseEditForm({ currentSchema }) {
  const [ruhsaSiniflari, setRuhsatSiniflari] = useState([]);
  const [loadingRuhsatSiniflari, setLoadingRuhsatSiniflari] = useState(false);

  const defaultValues = {
    name: currentSchema?.map((item) =>
      typeof item === 'string'
        ? { name: item, ruhsatSinifiId: undefined }
        : {
            id: item.id,
            name: item.name,
            ruhsatSinifiId: item.ruhsatSinifiId ?? undefined,
          }
    ) ?? [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewTourSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'name',
  });

  useEffect(() => {
    const fetchRuhsatTurleri = async () => {
      try {
        setLoadingRuhsatSiniflari(true);
        const token = localStorage.getItem('jwt_access_token');
        const res = await fetch(`${CONFIG.apiUrl}/Ruhsat/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRuhsatSiniflari(data);
      } catch (e) {
        toast.error('Ruhsat sınıfları yüklenemedi.');
      } finally {
        setLoadingRuhsatSiniflari(false);
      }
    };
    fetchRuhsatTurleri();
  }, []);

  useEffect(() => {
    if (currentSchema) {
      reset({
        name: currentSchema.map((item) =>
          typeof item === 'string'
            ? { name: item, ruhsatSinifiId: undefined }
            : {
                id: item.id,
                name: item.name,
                ruhsatSinifiId: item.ruhsatSinifiId ?? undefined,
              }
        ),
      });
    }
  }, [currentSchema, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = localStorage.getItem('jwt_access_token');

      const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/add-warehouse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.map((item) => ({
            id: item.id,
            name: item.name,
            ruhsatSinifiId: item.ruhsatSinifiId,
          })),
        }),
      });

      if (!response.ok) {
        toast.error('Lütfen tüm alanları doldurup tekrar deneyiniz!');
        return;
      }

      toast.success('Depo başarıyla güncellendi!');
      setTimeout(() => {
        window.location.href = '/dashboard/permit';
      }, 1000);
    } catch (error) {
      toast.error('Lütfen tüm alanları doldurup tekrar deneyiniz!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ mx: 'auto', ml: 5, mr: 5 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mx: 'auto', mb: 3 }}>
            Depo
          </Typography>

          <Stack spacing={2}>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="hidden" {...register(`name.${index}.id`)} />

                <TextField
                  fullWidth
                  {...register(`name.${index}.name`)}
                  label={`Depo ${index + 1}`}
                  variant="outlined"
                />

                <Controller
                  name={`name.${index}.ruhsatSinifiId`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      select
                      fullWidth
                      label="Ruhsat Sınıfı"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      disabled={loadingRuhsatSiniflari}
                    >
                      {ruhsaSiniflari.map((rt) => (
                        <MenuItem key={rt.id} value={rt.id}>
                          {rt.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <IconButton onClick={() => remove(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="contained"
              onClick={() => append({ id: null, name: '', ruhsatSinifiId: undefined })}
              sx={{ mt: 1 }}
            >
              Yeni Depo Ekle
            </Button>
          </Stack>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Kaydet
          </LoadingButton>
        </Box>
      </Stack>
    </Form>
  );
}
