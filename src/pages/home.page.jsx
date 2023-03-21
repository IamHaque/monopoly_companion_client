import { useContext, useEffect, useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import { MainContext } from '../context/mainContext';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rejoinGame } = useContext(MainContext);

  const [alert, setAlert] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    if (location?.state?.alert) setAlert(location?.state?.alert);

    let localPlayerData = window.localStorage.getItem('playerData');
    if (!localPlayerData) return;

    const { id, name, roomId } = JSON.parse(localPlayerData);
    if (!id || !name || !roomId) return;

    setActiveRoom({ id, name, roomId });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }, [alert]);

  const handleRejoin = () => {
    if (!activeRoom) return;

    const callback = (error) => {
      if (!error) return;

      window.localStorage.clear();
      setActiveRoom(null);

      return navigate('/', {
        state: { alert: { message: error.message, severity: 'error' } },
      });
    };

    rejoinGame(activeRoom?.roomId, activeRoom?.name, activeRoom?.id, callback);
    navigate('/game', { state: { prevRoute: '/' } });
  };

  return (
    <Stack
      minHeight="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" mb={2}>
        Monopoly Companion
      </Typography>

      <Typography mb={5} maxWidth="sm" textAlign="center">
        An easy way to manage finances in your game of monopoly from the
        browser.
      </Typography>

      <Stack gap={2} direction="row">
        <Button variant="contained" component={Link} to="/newGame">
          New Game
        </Button>

        <Button variant="outlined" component={Link} to="/joinGame">
          Join Game
        </Button>
      </Stack>

      {alert && (
        <Alert sx={{ mt: 5 }} severity={alert?.severity}>
          {alert?.message || 'Alert'}
        </Alert>
      )}

      {activeRoom && (
        <Stack
          p={2}
          mt={5}
          gap={1}
          boxShadow={2}
          direction="row"
          minWidth="min(50%, 300px)"
          bgcolor="background.paper"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" textTransform="capitalize">
              {activeRoom?.name}
            </Typography>

            <Typography>Room #{activeRoom?.roomId}</Typography>
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
