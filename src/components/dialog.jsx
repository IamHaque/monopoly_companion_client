import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

function AlertDialog({ dialog, handleClose }) {
  const closeAlertDialog = (action = 'reject') => {
    handleClose(action, dialog?.data);
  };

  return (
    <Dialog open={dialog?.show} onClose={() => closeAlertDialog()}>
      <DialogTitle>{dialog?.title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{dialog?.message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => closeAlertDialog()}>{dialog?.noText}</Button>
        <Button onClick={() => closeAlertDialog('accept')} autoFocus>
          {dialog?.yesText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;
