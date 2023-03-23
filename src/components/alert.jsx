import { SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef, useCallback } from 'react';
import { Alert } from '@mui/material';

export const AlertError = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <Alert severity="error" sx={{ width: '100%' }} onClose={handleDismiss}>
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export const AlertWarning = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <Alert severity="warning" sx={{ width: '100%' }} onClose={handleDismiss}>
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export const AlertInfo = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <Alert severity="info" sx={{ width: '100%' }} onClose={handleDismiss}>
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});

export const AlertSuccess = forwardRef(({ id, ...props }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref}>
      <Alert severity="success" sx={{ width: '100%' }} onClose={handleDismiss}>
        {props.message}
      </Alert>
    </SnackbarContent>
  );
});
