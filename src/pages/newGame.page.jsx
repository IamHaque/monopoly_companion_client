import { useContext, useEffect, useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

import Input from '../components/input';
import { MainContext } from '../context/mainContext';

function NewGamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createGame } = useContext(MainContext);

  const [name, setName] = useState({ value: '', error: null });

  useEffect(() => {
    if (location?.state?.name) setName(location?.state?.name);
  }, []);

  const handleClick = () => {
    if (!validName()) return;

    createGame(name.value, (error) => {
      if (!error) return;

      const state = {
        name: {
          ...name,
          error: error.message,
        },
      };

      return navigate('/newGame', { state });
    });

    navigate('/game', { state: { prevRoute: '/newGame' } });
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
      minHeight="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" mb={4}>
        Create a New Game
      </Typography>

      <Input
        error={name.error}
        value={name.value}
        setValue={setName}
        label="Enter your name"
      />

      <Stack gap={2} direction="row">
        <Button variant="outlined" onClick={handleClick}>
          Create Game
        </Button>

        <Button color="error" variant="outlined" component={Link} to="/">
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
}

export default NewGamePage;
