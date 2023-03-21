import { useContext, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

import router from './router';
import themeConfig from './theme';

import { MainContext } from './context/mainContext';

function App() {
  const { theme } = useContext(MainContext);
  const customTheme = useMemo(() => createTheme(themeConfig(theme)), [theme]);

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        className="app"
        color={(theme) => theme.palette.text.primary}
        bgcolor={(theme) => theme.palette.background.default}
      >
        <Container disableGutters maxWidth="lg">
          <RouterProvider router={router} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
