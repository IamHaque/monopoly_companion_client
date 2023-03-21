import { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  Stack,
  Button,
  Typography,
  ButtonGroup,
  InputAdornment,
} from '@mui/material';

import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

import Input from './input';

const modalContainer = {
  bgcolor: 'background.paper',
  boxShadow: 24,
  left: '50%',
  p: 3,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
};

const amountUpdateValues = [-100, -50, -10, -1, 0, 1, 10, 50, 100];

function TradeModal({ modal, onClose, handlePlayerBalanceUpdate }) {
  const [amount, setAmount] = useState({
    value: 0,
    error: null,
  });

  useEffect(() => {
    const currentAmount = Number(amount.value);
    if (amount.value !== '' && currentAmount >= 0) return;

    setAmount({
      ...amount,
      value: 0,
    });
  }, [amount]);

  const handleModalClose = () => {
    setAmount({
      value: 0,
      error: null,
    });

    onClose();
  };

  const handleAmountUpdate = (value) => {
    const updatedAmount = value === 0 ? 0 : Number(amount.value) + value;
    setAmount({
      error: null,
      value: updatedAmount,
    });
  };

  const handleTrade = (action) => {
    if (!validAmount(action)) return;

    const balance = Number(amount.value) * (action === 'take' ? -1 : 1);

    handlePlayerBalanceUpdate({
      balance,
      playerId: modal.tradeWith?.id,
      fromBank: modal.fromBank && modal.tradeAs?.isBanker,
    });
    handleModalClose();
  };

  const validAmount = (action) => {
    try {
      if (!amount.value) throw new Error('Enter an amount');
      if (amount.value < 0) throw new Error('Enter a valid amount');

      const balance = Number(amount.value);
      if (action === 'take' && balance > modal.tradeWith?.balance)
        throw new Error("Enter an amount less than player's balance");

      if (modal.fromBank && modal.tradeAs?.isBanker) return true;
      if (action === 'give' && balance > modal.tradeAs?.balance)
        throw new Error('Not enough balance to trade');

      return true;
    } catch (e) {
      setAmount({
        ...amount,
        error: e.message,
      });
      return false;
    }
  };

  return (
    <Modal open={modal.show} onClose={handleModalClose}>
      <Box sx={modalContainer} color={(theme) => theme.palette.text.primary}>
        <Stack
          mb={4}
          gap={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack gap={1} direction="row" alignItems="center">
            {modal?.fromBank ? (
              <AccountBalanceOutlinedIcon fontSize="large" />
            ) : (
              <PersonOutlineOutlinedIcon fontSize="large" />
            )}

            <ArrowForwardOutlinedIcon fontSize="small" />

            <Typography textTransform="capitalize" variant="h4">
              {modal.tradeWith?.name || 'Player'}
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight="light" color="text.secondary">
            ₹{modal.tradeWith?.balance || '0'}
          </Typography>
        </Stack>

        <Input
          width={100}
          type={'number'}
          label="Enter Amount"
          error={amount.error}
          value={amount.value}
          setValue={setAmount}
          inputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
        />

        <ButtonGroup fullWidth sx={{ mb: 4 }} variant="outlined">
          {amountUpdateValues.map((value, index) => (
            <Button key={index} onClick={() => handleAmountUpdate(value)}>
              {value}
            </Button>
          ))}
        </ButtonGroup>

        <Stack
          gap={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            fullWidth
            color="error"
            startIcon={<PersonRemoveOutlinedIcon />}
            onClick={() => handleTrade('take')}
          >
            Take money
          </Button>

          <Button
            fullWidth
            startIcon={<PersonAddOutlinedIcon />}
            onClick={() => handleTrade('give')}
          >
            Give money
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default TradeModal;
