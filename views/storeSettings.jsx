'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { settingsService } from '../services/settingsService/settingsService';

export default function StoreSettingsView({ activeTab }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [loadingGateway, setLoadingGateway] = useState(false);

  useEffect(() => {
    if (activeTab === 'payment-gateway') {
      const fetchGateway = async () => {
        setLoadingGateway(true);
        try {
          const data = await settingsService.getSetting('payment-gateway');
          if (data && data.value) {
            setRazorpayKeyId(data.value.razorpayKeyId || '');
            setRazorpayKeySecret(data.value.razorpayKeySecret || '');
          }
        } catch (err) {
          showToast('Failed to load payment credentials: ' + err.message, 'error');
        } finally {
          setLoadingGateway(false);
        }
      };
      fetchGateway();
    }
  }, [activeTab]);

  const handleGatewaySubmit = async (e) => {
    e.preventDefault();
    try {
      await settingsService.updateSetting('payment-gateway', {
        razorpayKeyId,
        razorpayKeySecret
      });
      showToast('Payment credentials saved successfully.');
    } catch (err) {
      showToast('Failed to save credentials: ' + err.message, 'error');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

      {/* STORE INFORMATION VIEW */}
      {activeTab === 'store-information' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Physical Store Information</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure physical store parameters, druggist licenses, and legal address indices.</Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); showToast('Store parameters saved.'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Registered Pharmacy Shop Name</Typography>
              <TextField fullWidth defaultValue="MedRx Wellness Pharmacy" />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Drug Retail License</Typography>
                <TextField fullWidth defaultValue="DL-38910-RX" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Registered Pharmacist Name</Typography>
                <TextField fullWidth defaultValue="Dr. Vivek Malhotra (D.Pharm)" />
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Store Address</Typography>
              <TextField fullWidth multiline rows={3} defaultValue="Plot 24, Outer Ring Road, Sector 4, Bangalore, Karnataka — 560001" />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
            >
              Save Information
            </Button>
          </Box>
        </Paper>
      )}

      {/* GST SETTINGS VIEW */}
      {activeTab === 'gst-settings' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>GST & Taxation Settings</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure CGST, SGST, and IGST tax rate brackets for medical formulations.</Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); showToast('GST config parameters successfully synchronized.'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>GSTIN Number</Typography>
                <TextField fullWidth defaultValue="29AAAAA0000A1Z5" />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Default GST Bracket</Typography>
                <Select fullWidth defaultValue="12%">
                  <MenuItem value="12%">12% GST (Standard Formulations)</MenuItem>
                  <MenuItem value="18%">18% GST (Medical Instruments)</MenuItem>
                  <MenuItem value="5%">5% GST (Life Saving Drugs)</MenuItem>
                  <MenuItem value="0%">0% Exempted</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
            >
              Update Taxes
            </Button>
          </Box>
        </Paper>
      )}

      {/* PAYMENT GATEWAY VIEW */}
      {activeTab === 'payment-gateway' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Payment Processor Gateways</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure Stripe or Razorpay API credentials for patient checkouts.</Typography>
          </Box>

          {loadingGateway ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: '#ec4899' }} />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleGatewaySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Razorpay Key ID</Typography>
                <TextField 
                  fullWidth 
                  value={razorpayKeyId} 
                  onChange={(e) => setRazorpayKeyId(e.target.value)} 
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Razorpay Key Secret</Typography>
                <TextField 
                  fullWidth 
                  type="password" 
                  value={razorpayKeySecret} 
                  onChange={(e) => setRazorpayKeySecret(e.target.value)} 
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
              >
                Save Credentials
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* EMAIL SETTINGS VIEW */}
      {activeTab === 'email-settings' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Email / SMTP Server Settings</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Configure SMTP servers to dispatch prescription notifications and purchase invoice PDFs.</Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); showToast('SMTP settings saved.'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>SMTP Host</Typography>
                <TextField fullWidth defaultValue="smtp.mailgun.org" />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>SMTP Port</Typography>
                <TextField fullWidth defaultValue="587" />
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Authorized Sender Address</Typography>
              <TextField fullWidth defaultValue="billing@medrxpharmacy.com" />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
            >
              Save Email Config
            </Button>
          </Box>
        </Paper>
      )}

      {/* SMS SETTINGS VIEW */}
      {activeTab === 'sms-settings' && (
        <Paper className="glass" sx={{ p: 3, maxWidth: 520 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>SMS Gateway Settings</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Connect Twilio / SMS portals to push shipping tracking links and OTP logins.</Typography>
          </Box>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); showToast('SMS Gateway settings updated.'); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Twilio Account SID</Typography>
              <TextField fullWidth defaultValue="AC82910398291039829" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#a1a1aa', mb: 1, display: 'block', textTransform: 'uppercase' }}>Twilio Auth Token</Typography>
              <TextField fullWidth type="password" defaultValue="secret_token_placeholder" />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ background: 'linear-gradient(to right, #ec4899, #9333ea)', color: 'white' }}
              >
                Save Twilio Token
              </Button>
              <Button
                variant="outlined"
                onClick={() => showToast('Test SMS dispatched to +91 99000-88877 via Twilio.')}
                sx={{ borderColor: 'var(--card-border)', color: '#a1a1aa', '&:hover': { color: 'white', borderColor: '#a1a1aa' } }}
              >
                Send Test SMS
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
