import React, { useEffect, useState } from 'react';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { CONFIG } from 'src/global-config';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'Ad zorunludur!' }),
  lastName: zod.string().min(1, { message: 'Soyad zorunludur!' }),
  mail: zod
    .string()
    .min(1, { message: 'E-Posta zorunludur!' })
    .email({ message: 'E-posta geçerli bir e-posta adresi olmalıdır!' }),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
});

// ----------------------------------------------------------------------

export function AccountUserGeneral() {

  const [currentUser, setCurrentUser] = useState({
    photoURL: '',
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
  });

  const defaultValues = {
    photoURL: '',
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
  };

  const fetchImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = () => resolve('');
    });
  };
  const token = localStorage.getItem('jwt_access_token');
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const payload = JSON.parse(jsonPayload);
  const userId = payload.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Organization/admin-user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Kullanıcı verisi alınamadı!');
        }

        const userData = await response.json();
        const imageSrc = await Promise.any([
          fetchImage(`/user/${userId}.png`)
        ]);

        setCurrentUser({
          ...userData,
          photoURL: imageSrc,
        });
      } catch (error) {
        toast.error('Veri alınırken bir hata oluştu');
      }
    };

    fetchUserData();
  }, []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const checkMailRes = await fetch(`${CONFIG.apiUrl}/Organization/check-mail-me`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail: data.mail, userId: userId }),
      });
  
      const checkResult = await checkMailRes.json();
  
      if (checkResult === 0) {
        toast.error("Bu e-posta adresi zaten kayıtlı!");
        return;
      }

      const response = await fetch(`${CONFIG.apiUrl}/Organization/update-only-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          mail: data.mail,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender
        })
      });

      const photo = methods.getValues('photoURL');
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("userId", userId);  
      const responsePhoto = await fetch(`${CONFIG.apiUrl}/Organization/update-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
      toast.success("Kullanıcı başarıyla güncellendi!");
    } catch (error) {
      toast.error("Bir hata oluştu!");
    }
  });

  const taskNumberLabel = currentUser.accountType === 'individual' ? 'TCKN' : 'Vergi No';

  return (
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                pt: 10,
                pb: 5,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Field.UploadAvatar
                name="photoURL"
                onChange={(event) => {
                  const file = event.target.files[0];
                  methods.setValue('photoURL', [file]);
                  
                }}
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    İzin verilen maksimum
                    <br /> *.png boyutu: {fData(3145728)}
                  </Typography>
                }
              />
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="firstName" label="Ad" />
                <Field.Text name="lastName" label="Soyad" />
                <Field.Text name="mail" label="E-Posta" />
                <Field.Phone name="phone" label="Telefon" />
              </Box>

              <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Kaydet
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
  );
}
