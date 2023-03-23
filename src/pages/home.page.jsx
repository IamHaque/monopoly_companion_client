import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';

import { MainContext } from '../context/mainContext';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { setTheme, rejoinGame } = useContext(MainContext);

  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    if (location?.state?.error) {
      enqueueSnackbar('Game not longer exists', {
        variant: 'error',
      });
    }

    const localTheme = window.localStorage.getItem('theme');
    if (localTheme) setTheme(localTheme);

    let localPlayerData = window.localStorage.getItem('playerData');
    if (!localPlayerData) return;

    const { id, name, roomId } = JSON.parse(localPlayerData);
    if (!id || !name || !roomId) return;

    setActiveRoom({ id, name, roomId });
  }, []);

  const handleRejoin = () => {
    if (!activeRoom) return;

    const callback = (error) => {
      if (!error) return;

      window.localStorage.setItem('playerData', JSON.stringify({}));
      setActiveRoom(null);
      return navigate('/', { state: { error: true } });
    };

    rejoinGame(activeRoom?.roomId, activeRoom?.name, activeRoom?.id, callback);
    navigate('/game', { state: { prevRoute: '/' } });
  };

  return (
    <Stack
      flexGrow="1"
      maxWidth="sm"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" mb={2} textAlign="center">
        Monopoly Companion
      </Typography>

      <Typography mb={5} px={5} textAlign="center">
        An easy way to manage finances in your game of monopoly from the
        browser.
      </Typography>

      <Stack gap={2} direction="row" flexWrap="wrap" justifyContent="center">
        <Button variant="contained" component={Link} to="/newGame">
          New Game
        </Button>

        <Button variant="outlined" component={Link} to="/joinGame">
          Join Game
        </Button>
      </Stack>

      {activeRoom && (
        <Stack
          p={2}
          mt={5}
          gap={1}
          boxShadow={2}
          direction="row"
          alignItems="center"
          minWidth="min(50%, 320px)"
          bgcolor="background.paper"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" textTransform="capitalize">
              {activeRoom?.name}
            </Typography>

            <Typography fontSize={'small'}>
              Room #{activeRoom?.roomId}
            </Typography>
          </Box>

          <Button size="large" onClick={handleRejoin}>
            Rejoin
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

export default HomePage;
