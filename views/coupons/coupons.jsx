'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';

export default function CouponsView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [coupons, setCoupons] = useState([
    { code: 'HEALTH20', discount: '20% OFF', desc: 'Valid on first 3 prescription orders', status: 'Active', expiry: '2026-12-31' },
    { code: 'LIFELINE', discount: '₹100 Off', desc: 'Min order value ₹500', status: 'Active', expiry: '2026-08-15' },
    { code: 'FREESHIP', discount: 'Free Shipping', desc: 'Valid on orders above ₹300', status: 'Expired', expiry: '2026-05-31' }
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '12px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Discount Coupons View */}
      {activeTab === 'coupons' && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Discount Coupons</Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Manage promotional discount codes for patients during checkout.</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                const code = prompt('Enter Coupon Code:');
                if (code) {
                  setCoupons([{ code: code.toUpperCase(), discount: '15% OFF', desc: 'Custom promotion coupon', status: 'Active', expiry: '2026-10-31' }, ...coupons]);
                  showToast(`Coupon ${code} added!`);
                }
              }}
            >
              Add Coupon
            </Button>
          </Box>

          <Grid container spacing={3}>
            {coupons.map((coupon, i) => (
              <Grid xs={12} sm={6} lg={4} key={i}>
                <Card className="glass" sx={{ p: 3, height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: coupon.status === 'Active' ? 'rgba(236,72,153,0.2)' : 'var(--card-border)', opacity: coupon.status === 'Active' ? 1 : 0.6 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--foreground)' }}>{coupon.code}</Typography>
                      <Chip label={coupon.status} size="small" color={coupon.status === 'Active' ? 'success' : 'default'} sx={{ fontSize: '9px', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#ec4899', mt: 1.5 }}>{coupon.discount}</Typography>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', mt: 0.5, display: 'block' }}>{coupon.desc}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#71717a', fontSize: '9px' }}>Expires: {coupon.expiry}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 'promotions' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Promotions & Campaigns</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Manage seasonal wellness programs and medicine banner discounts.</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { title: 'Monsoon Wellness Program', discount: 'Flat 15% off vitamins', range: '01 June — 30 June', status: 'Running' },
              { title: 'Senior Citizens Refill Drive', discount: 'Free home delivery + 20% flat', range: 'Permanent', status: 'Running' },
              { title: 'World Heart Day Cardiac special', discount: '₹200 discount on Cholesterol brands', range: 'Expired', status: 'Inactive' }
            ].map((prom, i) => (
              <Box key={i} sx={{ p: 2.5, border: '1px solid var(--card-border)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>{prom.title}</Typography>
                  <Typography variant="caption" sx={{ color: '#71717a' }}>{prom.discount} • Validity: {prom.range}</Typography>
                </Box>
                <Chip label={prom.status} size="small" sx={{ bgcolor: prom.status === 'Running' ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.05)', color: prom.status === 'Running' ? '#ec4899' : '#71717a', fontWeight: 700, fontSize: '9px' }} />
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
