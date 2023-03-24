import { useContext, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MainContext } from './context/mainContext';
import Layout from './components/layout';
import themeConfig from './theme';
import router from './router';

function App() {
  const { theme } = useContext(MainContext);
  const customTheme = useMemo(() => createTheme(themeConfig(theme)), [theme]);

  return (
    <ThemeProvider theme={customTheme}>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
