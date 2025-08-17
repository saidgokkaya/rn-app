import React, { useState, useEffect } from 'react';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { Box, Grid, Radio, RadioGroup, FormControlLabel, Button, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function AccountPdfSelectedView() {
  const images = [
    { id: 0, src: '/layout-frame/default.png' },
    { id: 1, src: '/layout-frame/gold-css.png' },
    { id: 2, src: '/layout-frame/green-css.png' },
    { id: 3, src: '/layout-frame/two-gold-css.png' },
    { id: 4, src: '/layout-frame/gold.jpg' },
    { id: 5, src: '/layout-frame/black.png' },
  ];

  useEffect(() => {
    const fetchSelectedId = async () => {
      try {
        const token = localStorage.getItem('jwt_access_token');
        const response = await fetch(`${CONFIG.apiUrl}/Organization/selected-pdf-format`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setSelectedId(data.selectedId);
      } catch (error) {
      }
    };

    fetchSelectedId();
  }, []);

  const [selectedId, setSelectedId] = useState('');

  const handleSave = (async () => {
    try {
      const token = localStorage.getItem('jwt_access_token');
      const response = await fetch(`${CONFIG.apiUrl}/Organization/pdf-format?cerceve=${selectedId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      toast.success("Pdf Şablonu başarıyla güncellendi!");
      window.location.href = "/dashboard/user/pdf-format";
    } catch (error) {
      toast.error("Bir hata oluştu!");
    }
  });

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Pdf Şablonu"
          links={[
            { name: 'Başlangıç', href: paths.dashboard.root },
            { name: 'Organizasyon' },
            { name: 'Pdf Şablonu' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <RadioGroup
            row
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <Grid container spacing={3}>
              {images.map((image) => (
                <Grid item xs={4} key={image.id}>
                  <FormControlLabel
                    value={image.id}
                    control={<Radio />}
                    label={
                      <Box
                        component="img"
                        src={image.src}
                        alt={image.id}
                        sx={{ width: 300, height: 400 }}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>

          <Box mt={3} display="flex">
            <Button variant="contained" onClick={handleSave} sx={{ ml: 'auto' }}>
              Kaydet
            </Button>
          </Box>
        </Card>
      </DashboardContent>
    </>
  );
}
