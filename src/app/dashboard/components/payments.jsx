'use client';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

export default function PaymentsView({ activeTab }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* PAYMENTS AUDIT LOG VIEW */}
      {activeTab === 'transactions' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Transaction Audit Log</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Financial overview of patient payments received via Stripe/Razorpay.</Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tx ID</TableCell>
                  <TableCell>Order Ref</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { tx: 'TXN-99021-A', ord: 'ORD-1092', gateway: 'Razorpay UPI', amount: '₹195.00', time: '2026-06-02 21:10', status: 'Success' },
                  { tx: 'TXN-99020-B', ord: 'ORD-1091', gateway: 'Stripe Card', amount: '₹375.00', time: '2026-06-02 18:35', status: 'Success' },
                  { tx: 'TXN-99019-C', ord: 'ORD-1090', gateway: 'Razorpay Netbank', amount: '₹280.00', time: '2026-06-01 14:20', status: 'Success' }
                ].map((pay, i) => (
                  <TableRow key={i} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--foreground)' }}>{pay.tx}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa', fontWeight: 600 }}>{pay.ord}</TableCell>
                    <TableCell sx={{ color: '#a1a1aa' }}>{pay.gateway}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'white' }}>{pay.amount}</TableCell>
                    <TableCell sx={{ color: '#71717a', fontSize: '10px' }}>{pay.time}</TableCell>
                    <TableCell><Chip label={pay.status} size="small" color="success" sx={{ fontSize: '9px', fontWeight: 700 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 'refunds' && (
        <Paper className="glass" sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>Refund Requests</Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.5 }}>Audit log of customer orders that were cancelled and refunded.</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Refund ID</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Refund Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--foreground)' }}>REF-8801</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>ORD-1082</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'white' }}>₹140.00</TableCell>
                  <TableCell sx={{ color: '#a1a1aa' }}>Doctor prescription rejected</TableCell>
                  <TableCell><Chip label="Processed" size="small" color="success" sx={{ fontSize: '9px', fontWeight: 700 }} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
