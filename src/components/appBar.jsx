import { useContext, useState } from 'react';
import {
  Box,
  Menu,
  AppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';

import MoreIcon from '@mui/icons-material/MoreVert';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { MainContext } from '../context/mainContext';

function CustomAppBar({ logout, player }) {
  const { theme, toggleTheme } = useContext(MainContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const capitalize = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSharing = async () => {
    if (!player) return;

    if (navigator.share) {
      const shareDetails = {
        url: `http://localhost:5173/joinGame?gameId=${player?.roomId}`,
        title: 'Play Monopoly with me',
        text: `${capitalize(player?.name)} has invited you to play Monopoly.`,
      };
      try {
        await navigator
          .share(shareDetails)
          .then(() =>
            console.log('Hooray! Your content was shared to tha world')
          );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      console.log('Web share is currently not supported on this device.');
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          logout();
          handleMenuClose();
        }}
      >
        Exit Game
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Game #{player?.roomId}
          </Typography>

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
            <IconButton size="large" color="inherit" onClick={toggleTheme}>
              {theme === 'light' ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>

            <IconButton size="large" color="inherit" onClick={logout}>
              <LogoutOutlinedIcon />
            </IconButton>

            {/* <IconButton
              edge="end"
              size="large"
              color="inherit"
              aria-haspopup="true"
              aria-controls={menuId}
              onClick={handleProfileMenuOpen}
            >
              <MoreIcon />
            </IconButton> */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* {renderMenu} */}
    </Box>
  );
}

export default CustomAppBar;
