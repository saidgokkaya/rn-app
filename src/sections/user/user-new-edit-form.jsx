import React, { useEffect, useState } from 'react';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

export const NewUserSchema = zod.object({
  name: zod.string().min(1, { message: 'Organizasyon Adı zorunludur!' }),
  orgAddress: zod.string().min(1, { message: 'Organizasyon Adresi zorunludur!' }),
  zipCode: zod
    .string()
    .min(1, { message: 'Posta Kodu zorunludur!' })
    .regex(/^\d+$/, { message: 'Posta Kodu sadece sayısal değerlerden oluşmalıdır!' }),
  taskNumber: zod
    .string()
    .min(1, { message: 'Vergi No zorunludur!' })
    .regex(/^\d+$/, { message: 'Vergi No sadece sayısal değerlerden oluşmalıdır!' }),
  firstName: zod
    .string()
    .min(1, { message: 'Ad zorunludur!' })
    .refine((value) => value !== 'Ad', { message: 'Ad alanına gerçek bir değer giriniz!' }),
  lastName: zod
    .string()
    .min(1, { message: 'Soyad zorunludur!' })
    .refine((value) => value !== 'Soyad', { message: 'Soyad alanına gerçek bir değer giriniz!' }),
  mail: zod
    .string()
    .min(1, { message: 'E-Posta zorunludur!' })
    .email({ message: 'E-posta geçerli bir e-posta adresi olmalıdır!' })
    .refine((value) => value !== 'mail@example.com', { message: 'E-Posta alanına gerçek bir değer giriniz!' }),
  phone: schemaHelper
    .phoneNumber({ isValid: isValidPhoneNumber })
    .refine((value) => value !== '+905000000000', { message: 'Bu telefon numarası kabul edilemez!' }),
  title: zod
    .string()
    .min(1, { message: 'Ünvan zorunludur!' })
    .refine((value) => value !== 'Ünvan', { message: 'Ünvan alanına gerçek bir değer giriniz!' }),
  dateOfBirth: zod
    .string()
    .min(1, { message: 'Doğum Tarihi zorunludur!' }),
  address: zod
    .string()
    .min(1, { message: 'Adres zorunludur!' })
    .refine((value) => value !== 'Adres', { message: 'Adres alanına gerçek bir değer giriniz!' }),
  gender: zod.enum(['E', 'K'], { message: 'Cinsiyet seçmek zorunludur!' }),
  roles: zod.array(zod.number()),
});

// ----------------------------------------------------------------------

export function UserNewEditForm() {
  const roles = [
    { id: 5, name: "Meta Reklam Hesaplarını Görüntüleme" },
    { id: 3, name: "Meta Reklam Hesaplarını Yönetme" },
    { id: 6, name: "Google Reklam Hesaplarını Görüntüleme" },
    { id: 4, name: "Google Reklam Hesaplarını Yönetme" },
    { id: 7, name: "Görevleri Yönetme" },
  ];

  const [currentUser, setCurrentUser] = useState({
      photoURL: '',
      firstName: '',
      lastName: '',
      mail: '',
      phone: '',
      title: '',
      dateOfBirth: '',
      address: '',
      gender: '',
      roles: []
    });

  const defaultValues = {
    photoURL: '',
    firstName: '',
    lastName: '',
    mail: '',
    phone: '',
    title: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    roles: []
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');
        const userResponse = await fetch(`${CONFIG.apiUrl}/Organization/get-add-user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const userData = await userResponse.json();
        setCurrentUser(userData);
      } catch (error) {
        toast.error('Veri alınırken bir hata oluştu');
      }
    };

    fetchUserData();
  }, []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit( async (data) => {
    try {
        const token = localStorage.getItem('jwt_access_token');
        
        const checkMailRes = await fetch(`${CONFIG.apiUrl}/Register/check-mail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail: data.mail }),
        });
    
        const checkResult = await checkMailRes.json();
    
        if (checkResult === 0) {
          toast.error("Bu e-posta adresi zaten kayıtlı!");
          return;
        }

        const response = await fetch(`${CONFIG.apiUrl}/Organization/add-user`, {
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
            title: data.title,
            dateOfBirth: data.dateOfBirth,
            address: data.address,
            gender: data.gender,
            roles: data.roles,
          })
        });

        const user = await response.json();
        const userId = user.id;
        const photo = methods.getValues('photoURL');
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("userId", userId);  
        const responsePhoto = await fetch(`${CONFIG.apiUrl}/Register/add-photo`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorResponse = null;
          try {
            errorResponse = await response.json();
          } catch (parseError) {
            errorResponse = { message: "Sunucudan beklenmeyen bir hata döndü." };
          }
          console.log(errorResponse);
          throw new Error("Bir hata oluştu!");
        }
        toast.success("Kullanıcı başarıyla eklendi!");
        window.location.href = '/dashboard/user/list';
      } catch (error) {
        toast.error("Kullanıcı eklenemedi!");
      }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                pt: 6,
                pb: 5,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Box sx={{ mb: 5 }}>
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
              </Box>
              <Field.MultiSelect
                  name="roles"
                  label="Roller"
                  multiple
                  options={roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  }))}
                  sx={{
                    width: '100%',
                  }}
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
                <Field.Phone name="phone" label="Telefon" country='TR' />
                <Field.Text name="title" label="Ünvan" />
                <Field.DatePicker name="dateOfBirth" label="Doğum Tarihi" />
                <Field.Text name="address" multiline rows={4} label="Adres" />
                <Field.RadioGroup
                  name="gender"
                  label="Cinsiyet"
                  options={[
                    { value: 'E', label: 'Erkek' },
                    { value: 'K', label: 'Kadın' },
                  ]}
                />
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
