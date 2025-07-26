import { useState, useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CONFIG } from 'src/global-config';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

const NewTourSchema = zod.object({
  name: zod.array(
    zod.object({
      id: zod.any().optional(),
      name: zod.string().min(1, { message: 'Name is required!' }),
    })
  ).min(1, { message: 'At least one name is required!' }),
});

export function ActivityEditForm({ currentSchema }) {
  const defaultValues = {
    name: currentSchema?.map((item) =>
      typeof item === 'string' ? { name: item } : { id: item.id, name: item.name }
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
    if (currentSchema) {
      reset({
        name: currentSchema.map((item) =>
          typeof item === 'string' ? { name: item } : { id: item.id, name: item.name }
        ),
      });
    }
  }, [currentSchema, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = localStorage.getItem('jwt_access_token');

      const response = await fetch(`${CONFIG.apiUrl}/Ruhsat/add-activities`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name.map((item) => ({
            id: item.id,
            name: item.name,
          })),
        }),
      });

      if (!response.ok) {
        toast.error('Hata!');
        return;
      }

      toast.success('Faaliyet Konusu başarıyla güncellendi!');
      setTimeout(() => {
        window.location.href = '/dashboard/permit';
      }, 1000);
    } catch (error) {
      toast.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ mx: 'auto', ml: 5, mr: 5 }}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mx: 'auto', mb: 3 }}>
            Faaliyet Konuları
          </Typography>

          <Stack spacing={2}>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="hidden" {...register(`name.${index}.id`)} />

                <TextField
                  fullWidth
                  {...register(`name.${index}.name`)}
                  label={`Faaliyet Konusu ${index + 1}`}
                  variant="outlined"
                />

                <IconButton onClick={() => remove(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="contained"
              onClick={() => append({ id: null, name: '' })}
              sx={{ mt: 1 }}
            >
              Yeni Faaliyet Konusu Ekle
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
