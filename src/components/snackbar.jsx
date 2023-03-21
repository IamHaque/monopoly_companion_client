import { useContext, useState } from 'react';

import { Alert, Slide, Snackbar } from '@mui/material';

import { MainContext } from '../context/mainContext';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function SnackbarToast() {
  const [open, setOpen] = useState(false);
  const { toast, hideToast } = useContext(MainContext);
  console.log(toast);

  useState(() => {
    setOpen(toast?.show === true);
  }, [toast]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    hideToast();
    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        key={'top center'}
        onClose={handleClose}
        autoHideDuration={5000}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.severity || 'info'} onClose={handleClose}>
          {toast?.message || 'Notification'}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackbarToast;
