import { Box, Grid, Stack, Skeleton } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { MainContext } from '../context/mainContext';
import PlayerCard from '../components/playerCard';
import TradeModal from '../components/tradeModal';
import CustomAppBar from '../components/appBar';
import AlertDialog from '../components/dialog';

const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function GamePage() {
  const {
    socket,
    player,
    players,
    exitGame,
    paySalary,
    resetState,
    updateHistory,
    updatePlayers,
    initializePlayer,
    updatePlayerStatus,
    updatePlayerBalance,
  } = useContext(MainContext);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [dialog, setDialog] = useState({
    title: '',
    noText: '',
    message: '',
    yesText: '',
    show: false,
    yesHandler: () => {},
  });

  const [modal, setModal] = useState({
    show: false,
    tradeAs: null,
    tradeWith: null,
    fromBank: false,
  });

  const [canTrade, setCanTrade] = useState(true);

  useEffect(() => {
    if (!socket) navigate('/');
  }, [player]);

  useEffect(() => {
    if (!socket) return;

    function onPlayerJoin(player) {
      initializePlayer(player);

      const { id, name, roomId } = player;
      window.localStorage.setItem(
        'playerData',
        JSON.stringify({ id, name, roomId })
      );
    }

    function onDataUpdate({ history, players }) {
      updatePlayers(players);
      updateHistory(history);
    }

    function onActionLog({ message, type }) {
      const options = { variant: type };
      if (message.includes('joined') || message.includes('left')) {
        options.preventDuplicate = true;
      }
      enqueueSnackbar(`${message}`, options);
    }

    function onAlert({ message, type }) {
      enqueueSnackbar(`${message}`, { variant: type });
    }

    function onTradeRequest(tradeInfo) {
      handleDialogOpen(tradeInfo);
    }

    function onDisableTrade() {
      setCanTrade(false);
    }

    function onEnableTrade() {
      setCanTrade(true);
      setDialog({
        ...dialog,
        show: false,
      });
    }

    function onDisconnect() {
      resetState();
    }

    socket.on('joined_room', onPlayerJoin);
    socket.on('update_player_data', onDataUpdate);
    socket.on('trade_request', onTradeRequest);
    socket.on('disable_trade', onDisableTrade);
    socket.on('enable_trade', onEnableTrade);
    socket.on('alert', onAlert);
    socket.on('log_action', onActionLog);
    socket.on('disconnect', onDisconnect);

    // Tab has focus
    const handleFocus = async () => {
      updatePlayerStatus('online');
    };

    // Tab lost focus or closed
    const handleBlur = () => {
      setTimeout(() => {
        updatePlayerStatus('offline');
      }, 1000);
    };

    // Track if the user changes the tab to determine when they are online
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);

      socket.off('joined_room', onPlayerJoin);
      socket.off('update_player_data', onDataUpdate);
      socket.off('trade_request', onTradeRequest);
      socket.off('disable_trade', onDisableTrade);
      socket.off('enable_trade', onEnableTrade);
      socket.off('alert', onAlert);
      socket.off('log_action', onActionLog);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.setItem('playerData', JSON.stringify({}));
    enqueueSnackbar('Left game room');
    exitGame();
    navigate('/');
  };

  const handleModalOpen = (playerId, fromBank = false) => {
    const tradeWith = players.find((el) => el.id === playerId);
    setModal({
      fromBank,
      tradeWith,
      show: true,
      tradeAs: player,
    });
  };

  const handleModalClose = () => {
    setModal({
      show: false,
      tradeAs: null,
      tradeWith: null,
      fromBank: false,
    });
  };

  const handleDialogOpen = (data) => {
    const requestedAmount = Math.abs(data.balance);
    const requestedBy = capitalize(data.requestedBy);
    let message =
      data.balance < 0
        ? `${requestedBy} has requested ₹${requestedAmount} from you.`
        : `${requestedBy} is requesting to give you  ₹${requestedAmount}.`;

    setDialog({
      ...dialog,
      data,
      message,
      show: true,
      noText: 'Reject',
      yesText: 'Accept',
      title: `Trade with ${data.requestedBy}?`,
    });
  };

  const handleDialogClose = (action, data) => {
    setDialog({
      ...dialog,
      show: false,
    });

    if (!socket) return;

    socket.emit('trade_response', {
      ...data,
      action,
    });
  };

  return (
    <Stack flexGrow="1" width="100%">
      <CustomAppBar player={player} logout={handleLogout} />

      <Box px={4} py={4}>
        <Grid container spacing={2} columns={{ xs: 2, sm: 4, md: 8, lg: 12 }}>
          {player
            ? players.map((el, index) => (
                <Grid item xs={2} sm={2} md={4} lg={4} key={index}>
                  <PlayerCard
                    player={el}
                    actionsDisabled={!canTrade}
                    payPlayerSalary={paySalary}
                    currentPlayerId={player?.id}
                    handleModalOpen={handleModalOpen}
                    loggedInAsBanker={player?.isBanker === true}
                  />
                </Grid>
              ))
            : [1, 1, 1, 1].map((_, index) => (
                <Grid item xs={2} sm={2} md={4} lg={4} key={index}>
                  <Skeleton variant="rounded" animation="wave" height={195} />
                </Grid>
              ))}
        </Grid>
      </Box>

      <AlertDialog dialog={dialog} handleClose={handleDialogClose} />

      <TradeModal
        modal={modal}
        onClose={handleModalClose}
        handlePlayerBalanceUpdate={updatePlayerBalance}
      />
    </Stack>
  );
}

export default GamePage;
