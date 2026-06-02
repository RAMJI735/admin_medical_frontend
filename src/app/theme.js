'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark', // Tells MUI to render appropriate defaults for text, inputs, etc.
    primary: {
      main: '#ec4899', // Pink-500
    },
    background: {
      default: 'var(--background)',
      paper: 'var(--card-bg)',
    },
    text: {
      primary: 'var(--foreground)',
      secondary: '#a1a1aa',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: 'inherit',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          borderRadius: '16px',
          borderStyle: 'solid',
          borderWidth: '1px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          borderRadius: '16px',
          borderStyle: 'solid',
          borderWidth: '1px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(9, 9, 11, 0.5)',
            fontSize: '0.75rem',
            '& fieldset': {
              borderColor: 'var(--card-border)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(236, 72, 153, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ec4899',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          backgroundColor: 'rgba(9, 9, 11, 0.5)',
          fontSize: '0.75rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--card-border)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(236, 72, 153, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ec4899',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
        head: {
          fontWeight: 700,
          color: '#a1a1aa',
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
  },
});
