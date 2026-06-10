'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar
} from '@mui/material';

function Brands() {
  const brandsList = [
    { name: 'Pfizer Ltd', logo: 'Pz', country: 'USA', rating: '5.0' },
    { name: 'Abbott Healthcare', logo: 'Ab', country: 'USA', rating: '4.9' },
    { name: 'GlaxoSmithKline', logo: 'GSK', country: 'UK', rating: '4.8' },
    { name: 'Cipla India', logo: 'Cp', country: 'India', rating: '4.9' },
    { name: 'Novartis AG', logo: 'Nv', country: 'Switzerland', rating: '4.7' },
    { name: 'Sun Pharma', logo: 'Sun', country: 'India', rating: '4.6' },
    { name: 'Lupin Corp', logo: 'Lp', country: 'India', rating: '4.5' },
    { name: 'Zydus Cadila', logo: 'Zy', country: 'India', rating: '4.4' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
          Pharmaceutical Brands
        </Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>
          Affiliated manufacturing partners and drug brand catalogs.
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {brandsList.map((brand, i) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={i}>
            <Card
              className="glass"
              sx={{
                textAlign: 'center',
                p: 3,
                '&:hover': { borderColor: 'var(--foreground)' },
                transition: 'all 0.3s',
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(147, 51, 234, 0.1)',
                  color: '#a855f7',
                  fontWeight: 705,
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                }}
              >
                {brand.logo}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'var(--foreground)',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {brand.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mt: 0.5 }}>
                {brand.country} • ★ {brand.rating}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Brands;
