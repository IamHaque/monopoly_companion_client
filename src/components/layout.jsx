import { useContext, useMemo } from 'react';
import { SnackbarProvider } from 'notistack';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';

import { AlertInfo, AlertError, AlertSuccess, AlertWarning } from './alert';
import { MainContext } from '../context/mainContext';
import themeConfig from '../theme';

function Layout({ children }) {
  const { theme } = useContext(MainContext);
  const customTheme = useMemo(() => createTheme(themeConfig(theme)), [theme]);

  return (
    <ThemeProvider theme={customTheme}>
      <SnackbarProvider
        Components={{
          warning: AlertWarning,
          success: AlertSuccess,
          default: AlertInfo,
          error: AlertError,
          info: AlertInfo,
        }}
        maxSnack={4}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Container
          maxWidth="lg"
          disableGutters
          className="app"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            flexDirection: 'column',
            justifyContent: 'start',
            bgcolor: 'background.default',
          }}
        >
          <CssBaseline />
          {children}
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Layout;
