'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../../services/AuthService/AuthContext';
import { MedicineProvider } from '../../services/medicineService/MedicineContext';
import { BannerProvider } from '../../services/bannerService/BannerContext';
import { OrderProvider } from '../../services/orderService/OrderContext';

const ThemeModeContext = createContext({
  isLightTheme: false,
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export default function Providers({ children }) {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'light') {
      setIsLightTheme(true);
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsLightTheme((prev) => {
      const newVal = !prev;
      localStorage.setItem('themeMode', newVal ? 'light' : 'dark');
      if (newVal) {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      return newVal;
    });
  };

  const muiTheme = createTheme({
    palette: {
      mode: isLightTheme ? 'light' : 'dark',
      primary: {
        main: '#6366f1', // Indigo-500
      },
      background: {
        default: isLightTheme ? '#f8fafc' : '#09090b',
        paper: isLightTheme ? '#ffffff' : '#18181b',
      },
      text: {
        primary: isLightTheme ? '#0f172a' : '#fafafa',
        secondary: isLightTheme ? '#64748b' : '#a1a1aa',
      },
      divider: isLightTheme ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
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
            backgroundColor: isLightTheme ? '#ffffff' : '#18181b',
            borderColor: isLightTheme ? '#e2e8f0' : '#27272a',
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
            backgroundColor: isLightTheme ? '#ffffff' : '#18181b',
            borderColor: isLightTheme ? '#e2e8f0' : '#27272a',
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
              backgroundColor: isLightTheme ? 'rgba(0, 0, 0, 0.02)' : 'rgba(9, 9, 11, 0.5)',
              fontSize: '0.75rem',
              '& fieldset': {
                borderColor: isLightTheme ? '#e2e8f0' : '#27272a',
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
            backgroundColor: isLightTheme ? 'rgba(0, 0, 0, 0.02)' : 'rgba(9, 9, 11, 0.5)',
            fontSize: '0.75rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isLightTheme ? '#e2e8f0' : '#27272a',
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
            borderColor: isLightTheme ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          },
          head: {
            fontWeight: 700,
            color: isLightTheme ? '#64748b' : '#a1a1aa',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
  });

  // Prevent SSR flash/hydration mismatch by rendering blank shell or base providers until client is mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={{ isLightTheme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        <AuthProvider>
          <MedicineProvider>
            <BannerProvider>
              <OrderProvider>
                {children}
              </OrderProvider>
            </BannerProvider>
          </MedicineProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
