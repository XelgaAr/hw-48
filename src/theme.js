import { createTheme } from '@mui/material/styles';

export function buildTheme(mode) {
  return createTheme({
    palette: {
      mode, primary: { main: mode === 'light' ? '#6354ba' : '#b5a5ff' },
      secondary: { main: '#387d70' },
      background: { default: mode === 'light' ? '#f6f7fb' : '#141624', paper: mode === 'light' ? '#ffffff' : '#202334' },
      text: { primary: mode === 'light' ? '#22263b' : '#f0f0f6', secondary: mode === 'light' ? '#687085' : '#aeb6ca' }
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h3: { fontWeight: 750, letterSpacing: '-0.045em' }, h5: { fontWeight: 700, letterSpacing: '-0.025em' },
      h6: { fontWeight: 700, fontSize: '1.05rem' }, button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 10 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: { styleOverrides: { root: { border: '1px solid', borderColor: mode === 'light' ? '#e8eaf1' : '#34394e', boxShadow: 'none' } } },
      MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
      MuiIconButton: { defaultProps: { size: 'small' } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 18 } } },
    },
  });
}
