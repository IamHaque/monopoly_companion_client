import { SnackbarProvider } from 'notistack';

import { Container, CssBaseline } from '@mui/material';

import { AlertInfo, AlertError, AlertSuccess, AlertWarning } from './alert';
import Div100vh from './div100vh';

function Layout({ children }) {
  return (
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
      <Div100vh style={{ display: 'grid' }}>
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
      </Div100vh>
    </SnackbarProvider>
  );
}

export default Layout;
