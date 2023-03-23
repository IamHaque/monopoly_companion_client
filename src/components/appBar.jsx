import { useState, useContext } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Skeleton,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { MainContext } from '../context/mainContext';
import HistoryDialog from './history';

const capitalize = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function CustomAppBar({ logout, player }) {
  const { enqueueSnackbar } = useSnackbar();
  const { theme, history, toggleTheme } = useContext(MainContext);

  const [showHistory, setShowHistory] = useState(false);

  const handleSharing = async () => {
    if (!player) return;

    if (navigator.share) {
      const shareDetails = {
        url: `https://monopoly.subhanhaque.uk/joinGame?gameId=${player?.roomId}`,
        title: 'Play Monopoly with me',
        text: `${capitalize(player?.name)} has invited you to play Monopoly.`,
      };
      try {
        await navigator.share(shareDetails).then(() => {
          console.log('Hooray! Your content was shared to tha world');
          enqueueSnackbar('Link shared');
        });
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      console.log('Web share is currently not supported on this device.');
    }
  };

  const handleThemeToggle = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('theme', currentTheme);
    toggleTheme();
  };

  const showHistoryDialog = () => {
    setShowHistory(true);
  };

  const closeHistoryDialog = () => {
    setShowHistory(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {player ? (
            <Typography variant="h6" noWrap component="div">
              Game #{player?.roomId}
            </Typography>
          ) : (
            <Skeleton variant="h6" animation="wave" width={132} />
          )}

          {player && (
            <IconButton
              sx={{ ml: 2 }}
              size="large"
              color="inherit"
              onClick={handleSharing}
            >
              <ShareOutlinedIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box>
            <IconButton
              size="large"
              color="inherit"
              onClick={showHistoryDialog}
            >
              <RestoreOutlinedIcon />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              onClick={handleThemeToggle}
            >
              {theme === 'light' ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton size="large" color="inherit" onClick={logout}>
              <LogoutOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <HistoryDialog
        history={history}
        show={showHistory}
        handleClose={closeHistoryDialog}
      />
    </Box>
  );
}

export default CustomAppBar;
