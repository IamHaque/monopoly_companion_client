import { Box, Button } from '@mui/material';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

function ThemeSwitcher({ mode, setMode }) {
  const switchTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Box position="absolute" right={8} top={8}>
      <Button
        variant="outlined"
        size="small"
        onClick={switchTheme}
        startIcon={
          mode === 'light' ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )
        }
      >
        {mode}
      </Button>
    </Box>
  );
}

export default ThemeSwitcher;
