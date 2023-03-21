import { Box, Grid, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MainContext } from '../context/mainContext';
import PlayerCard from '../components/playerCard';
import TradeModal from '../components/tradeModal';
import CustomAppBar from '../components/appBar';
import AlertDialog from '../components/dialog';

function GamePage() {
  const {
    socket,
    player,
    players,
    exitGame,
    paySalary,
    updatePlayers,
    initializePlayer,
    updatePlayerStatus,
    updatePlayerBalance,
  } = useContext(MainContext);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!socket) {
      navigate('/');
      return;
    }

    socket.on('joined_room', (player) => {
      initializePlayer(player);

      const { id, name, roomId } = player;
      window.localStorage.setItem(
        'playerData',
        JSON.stringify({ id, name, roomId })
      );
    });

    socket.on('trade_request', (tradeInfo, callback) => {
      handleDialogOpen(tradeInfo, callback);
    });

    socket.on('update_player_data', ({ players }) => {
      updatePlayers(players);
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

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
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    navigate('/');
    exitGame();
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
    const capitalize = (str) => {
      return str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

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
    <>
      <CustomAppBar player={player} logout={handleLogout} />

      <Box px={4} py={4}>
        <Grid container spacing={2} columns={{ xs: 2, sm: 4, md: 8, lg: 12 }}>
          {players.map((el, index) => (
            <Grid item xs={2} sm={2} md={4} lg={4} key={index}>
              <PlayerCard
                player={el}
                payPlayerSalary={paySalary}
                currentPlayerId={player?.id}
                handleModalOpen={handleModalOpen}
                loggedInAsBanker={player?.isBanker === true}
              />
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
    </>
  );
}

export default GamePage;
