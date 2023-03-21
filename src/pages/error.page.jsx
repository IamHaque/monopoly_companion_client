import { Link, useRouteError } from 'react-router-dom';

import { Button, Container, Stack, Typography } from '@mui/material';

function ErrorPage() {
  const error = useRouteError();

  return (
    <Stack
      minHeight="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" mb={2}>
        Error Page
      </Typography>

      <Typography>{error.statusText || error.message}</Typography>

      <Typography color={'gray'}>
        Sorry, an unexpected error has occurred.
      </Typography>

      <Button
        to="/"
        component={Link}
        size="small"
        sx={{ mt: 3 }}
        variant="outlined"
      >
        Go To Home
      </Button>
    </Stack>
  );
}

export default ErrorPage;
