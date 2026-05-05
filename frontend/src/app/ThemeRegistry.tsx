'use client';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary:    { main: '#4C763B', light: '#9AD872', dark: '#043915', contrastText: '#fff' },
      secondary:  { main: '#468432', light: '#B0CE88', dark: '#043915', contrastText: '#fff' },
      background: { default: '#EEF4E8', paper: '#ffffff' },
      text:       { primary: '#0D2414', secondary: '#5a7a4a' },
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
      h1: { fontWeight: 800, fontSize: '3.2rem',  letterSpacing: -1   },
      h2: { fontWeight: 800, fontSize: '2.6rem',  letterSpacing: -0.5 },
      h3: { fontWeight: 800, fontSize: '2.2rem',  letterSpacing: -0.3 },
      h4: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: -0.2 },
      h5: { fontWeight: 700, fontSize: '1.4rem'  },
      h6: { fontWeight: 600, fontSize: '1.15rem' },
      body1: { fontSize: '1rem',    lineHeight: 1.7  },
      body2: { fontSize: '0.925rem',lineHeight: 1.65 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
        `,
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)', fontSize: '0.95rem' },
          containedPrimary: {
            background: 'linear-gradient(135deg, #4C763B 0%, #468432 100%)',
            boxShadow: '0 4px 14px rgba(70,132,50,0.28)',
            '&:hover': { background: 'linear-gradient(135deg, #043915 0%, #4C763B 100%)', boxShadow: '0 6px 22px rgba(4,57,21,0.38)', transform: 'translateY(-1px)' },
            '&:active': { transform: 'translateY(0px)' },
          },
          outlinedPrimary: { borderColor: '#B0CE88', color: '#4C763B', '&:hover': { borderColor: '#4C763B', backgroundColor: 'rgba(154,216,114,0.08)', transform: 'translateY(-1px)' } },
        },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: 18, boxShadow: '0 2px 20px rgba(4,57,21,0.07), 0 0 0 1px rgba(176,206,136,0.18)', transition: 'all 0.25s ease' } },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10, backgroundColor: '#f7fbf4', fontSize: '1rem',
              '&:hover fieldset':       { borderColor: '#468432' },
              '&.Mui-focused fieldset': { borderColor: '#4C763B', borderWidth: 2 },
              '&.Mui-focused':          { backgroundColor: '#fff' },
              transition: 'background-color 0.2s',
            },
            '& .MuiInputLabel-root':            { fontSize: '0.975rem' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#4C763B' },
          },
        },
      },
      MuiChip:     { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
      MuiTooltip:  { styleOverrides: { tooltip: { backgroundColor: '#043915', borderRadius: 6, fontSize: 12 }, arrow: { color: '#043915' } } },
      MuiTableRow: { styleOverrides: { root: { '&:hover': { backgroundColor: 'rgba(154,216,114,0.04)' } } } },
      MuiTableCell:{ styleOverrides: { root: { fontSize: '0.925rem' } } },
    },
  }), []);

  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>;
}