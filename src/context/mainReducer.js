import socketIO from 'socket.io-client';

const connectToSocket = () => socketIO.connect('http://localhost:4000/');

const initialState = {
  players: [],
  player: null,
  socket: null,
  theme: 'light',
  salaryAmount: 200,
  toast: {
    show: false,
    message: null,
    severity: null,
  },
};

const actions = {
  EXIT_ROOM: 'EXIT_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  REJOIN_ROOM: 'REJOIN_ROOM',
  CREATE_ROOM: 'CREATE_ROOM',

  INIT_PLAYER: 'INIT_PLAYER',
  UPDATE_PLAYERS: 'UPDATE_PLAYERS',
  UPDATE_PLAYER_STATUS: 'UPDATE_PLAYER_STATUS',

  PAY_SALARY: 'PAY_SALARY',
  PLAYER_UPDATE_BALANCE: 'PLAYER_UPDATE_BALANCE',

  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
  TOGGLE_THEME: 'TOGGLE_THEME',
};

const mainReducer = (state, action) => {
  if (
    action.type === actions.CREATE_ROOM ||
    action.type === actions.JOIN_ROOM ||
    action.type === actions.REJOIN_ROOM
  ) {
    if (state.socket) state.socket.disconnect();
    const socket = connectToSocket();

    let event = 'create_room';
    const options = {
      username: action.payload.username,
    };

    if (action.type === actions.JOIN_ROOM) {
      event = 'join_room';
      options.roomId = action.payload.roomId;
    }

    if (action.type === actions.REJOIN_ROOM) {
      event = 'rejoin_room';
      options.roomId = action.payload.roomId;
      options.playerId = action.payload.playerId;
    }

    socket.emit(event, options, action.payload.callback);

    return {
      ...state,
      socket,
    };
  }

  if (action.type === actions.EXIT_ROOM) {
    if (state.socket) {
      state.socket.emit('exit_room', state.player?.id);
      state.socket.disconnect();
    }
    return { ...state, socket: null, user: null };
  }

  if (action.type === actions.INIT_PLAYER) {
    return { ...state, player: action.payload.player };
  }

  if (action.type === actions.UPDATE_PLAYERS) {
    return {
      ...state,
      players: [...action.payload.players],
      player: action.payload.players.find((el) => el?.id === state.player?.id),
    };
  }

  if (action.type === actions.PAY_SALARY) {
    if (state.socket) {
      state.socket.emit('pay_salary', action.payload.playerId);
    }

    const updatedPlayers = state.players.map((player) =>
      player.id === action.payload.playerId
        ? { ...player, balance: player.balance + state.salaryAmount }
        : player
    );

    return { ...state, players: updatedPlayers };
  }

  if (action.type === actions.PLAYER_UPDATE_BALANCE) {
    const options = { ...action.payload };
    if (!action.payload.fromBank) {
      options.currentPlayerId = state.player?.id;
    }

    if (state.socket && options.playerId !== options.currentPlayerId) {
      state.socket.emit('trade', options);
    }

    return { ...state };
  }

  if (action.type === actions.UPDATE_PLAYER_STATUS) {
    if (state.socket) {
      state.socket.emit('player_status_changed', {
        playerId: state.player?.id,
        status: action.payload.status,
      });
    }

    return { ...state };
  }

  if (action.type === actions.TOGGLE_THEME) {
    return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
  }

  if (action.type === actions.SHOW_TOAST) {
    return {
      ...state,
      toast: {
        show: true,
        message: action.payload.message,
        severity: action.payload.severity,
      },
    };
  }

  if (action.type === actions.HIDE_TOAST) {
    return {
      ...state,
      toast: {
        show: false,
        message: null,
        severity: null,
      },
    };
  }

  return { ...state };
};

export { actions, mainReducer, initialState };
