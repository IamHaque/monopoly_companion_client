import { useContext, useEffect, useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

import Input from '../components/input';
import { MainContext } from '../context/mainContext';

function JoinGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { joinGame } = useContext(MainContext);

  const [gameId, setGameId] = useState({ value: '', error: null });
  const [name, setName] = useState({ value: '', error: null });

  useEffect(() => {
    const query = new URLSearchParams(location?.search);
    const gameIdFromQuery = query.get('gameId');
    if (gameIdFromQuery) setGameId({ value: gameIdFromQuery, error: null });

    if (location?.state?.name) setName(location?.state?.name);
    if (location?.state?.gameId) setGameId(location?.state?.gameId);
  }, []);

  const handleClick = () => {
    if (!validGameID()) return;
    if (!validName()) return;

    joinGame(gameId.value, name.value, (error) => {
      if (!error) return;

      const state = {
        gameId: {
          ...gameId,
          error: error?.type === 'roomId' ? error.message : null,
        },
        name: {
          ...name,
          error: error?.type === 'username' ? error.message : null,
        },
      };

      return navigate('/joinGame', { state });
    });

    navigate('/game', { state: { prevRoute: '/joinGame' } });
  };

  const validGameID = () => {
    if (gameId.error) return false;

    if (gameId.value === '') {
      setGameId({
        ...gameId,
        error: 'Enter a game ID',
      });
      return false;
    }

    if (gameId.value.length < 5) {
      setGameId({
        ...gameId,
        error: 'Enter a valid game ID',
      });
      return false;
    }

    return true;
  };

  const validName = () => {
    if (name.error) return false;

    if (name.value === '') {
      setName({
        ...name,
        error: 'Enter a name',
      });
      return false;
    }

    if (name.value.length < 4) {
      setName({
        ...name,
        error: 'Enter a valid name',
      });
      return false;
    }

    return true;
  };

  return (
    <Stack
      flexGrow="1"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" mb={4}>
        Join an Existing Game
      </Typography>

      <Input
        width={'100'}
        error={gameId.error}
        value={gameId.value}
        setValue={setGameId}
        label="Enter game ID"
      />

      <Input
        width={'100'}
        error={name.error}
        value={name.value}
        setValue={setName}
        label="Enter your name"
      />

      <Stack gap={2} direction="row">
        <Button variant="outlined" onClick={handleClick}>
          Join Game
        </Button>

        <Button color="error" variant="outlined" component={Link} to="/">
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

export default JoinGamePage;
