import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const ChangePassWordSchema = zod
  .object({
    newPassword: zod.string().min(1, { message: 'Yeni şifre gerekiyor!' }).min(6, { message: 'Şifre en az 6 karakter olmalıdır!' }),
    confirmNewPassword: zod.string().min(1, { message: 'Şifreyi onaylamanız gerekiyor!' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Şifreler uyuşmuyor!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const showPassword = useBoolean();

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Organization/update-user-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: data.newPassword
        })
      });
      if (!response.ok) {
        let errorResponse = null;
        try {
          errorResponse = await response.json();
        } catch (parseError) {
          errorResponse = { message: "Sunucudan beklenmeyen bir hata döndü." };
        }
        
        throw new Error("Bir hata oluştu!");
      }
      toast.success("Şifre başarıyla güncellendi!");
      window.location.href = "/dashboard/user/account";
    } catch (error) {
      toast.error("Bir hata oluştu!");
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Field.Text
          name="newPassword"
          label="Yeni Şifre"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          helperText={
            <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="eva:info-fill" width={16} /> Şifre en az 6+ karakter olmalıdır
            </Box>
          }
        />

        <Field.Text
          name="confirmNewPassword"
          type={showPassword.value ? 'text' : 'password'}
          label="Yeni şifreyi onayla"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Kaydet
        </LoadingButton>
      </Card>
    </Form>
  );
}
