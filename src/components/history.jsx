import {
  List,
  Button,
  Dialog,
  ListItem,
  Typography,
  DialogTitle,
  ListItemText,
  ListItemIcon,
  DialogActions,
  DialogContent,
} from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';

import moment from 'moment/moment';

function HistoryDialog({ show, history, handleClose }) {
  const getListIcon = (type) => {
    if (type === 'success') return <PersonAddAlt1OutlinedIcon />;
    if (type === 'error') return <PersonRemoveAlt1OutlinedIcon />;
    return <InfoOutlinedIcon />;
  };

  return (
    <Dialog open={show} scroll={'paper'} onClose={handleClose}>
      <DialogTitle fontWeight="regular">Game History</DialogTitle>

      <DialogContent dividers={true}>
        {history && history.length > 0 ? (
          <List sx={{ p: 0 }}>
            {history
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(({ message, type, timestamp }, index) => (
                <ListItem key={timestamp} sx={{ p: 0 }}>
                  <ListItemIcon>{getListIcon(type)}</ListItemIcon>
                  <ListItemText
                    primary={message}
                    secondary={moment(timestamp).fromNow()}
                  />
                </ListItem>
              ))}
          </List>
        ) : (
          <Typography fontWeight="light">
            No game events have occurred yet!
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default HistoryDialog;
