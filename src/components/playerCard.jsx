import {
  Card,
  Stack,
  Button,
  Typography,
  CardContent,
  CardActions,
} from '@mui/material';

import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

function PlayerCard({
  player,
  actionsDisabled,
  handleModalOpen,
  currentPlayerId,
  payPlayerSalary,
  loggedInAsBanker,
}) {
  return (
    <Card
      sx={{
        borderTop: `4px solid ${player?.color ? player?.color : 'transparent'}`,
      }}
    >
      <CardContent>
        <Stack
          mb={3}
          gap={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography textTransform="capitalize" variant="h6">
            {player?.name}
            {currentPlayerId === player?.id && ' (Me)'}
          </Typography>

          {player?.status === 'online' ? (
            <CheckCircleOutlinedIcon color="success" />
          ) : (
            <HighlightOffOutlinedIcon color="error" />
          )}
        </Stack>

        <Typography variant="h3" fontWeight="light">
          ₹{player?.balance}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          disabled={currentPlayerId === player?.id || actionsDisabled}
          onClick={() => handleModalOpen(player?.id)}
        >
          Trade
        </Button>

        {loggedInAsBanker && (
          <>
            <Button
              size="small"
              disabled={actionsDisabled}
              onClick={() => handleModalOpen(player?.id, true)}
            >
              Trade As Bank
            </Button>

            <Button
              size="small"
              disabled={actionsDisabled}
              onClick={() => {
                payPlayerSalary(player?.id);
              }}
            >
              Pay Salary
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}

export default PlayerCard;
