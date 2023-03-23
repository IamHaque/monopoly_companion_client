import { createContext, useReducer } from 'react';

import { actions, mainReducer, initialState } from './mainReducer';

export const MainContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const value = {
    user: state.user,
    theme: state.theme,
    player: state.player,
    socket: state.socket,
    players: state.players,
    history: state.history,
    createGame: (username, callback) => {
      dispatch({
        type: actions.CREATE_ROOM,
        payload: {
          username,
          callback,
        },
      });
    },
    joinGame: (roomId, username, callback) => {
      dispatch({
        type: actions.JOIN_ROOM,
        payload: {
          roomId,
          username,
          callback,
        },
      });
    },
    rejoinGame: (roomId, username, playerId, callback) => {
      dispatch({
        type: actions.REJOIN_ROOM,
        payload: {
          roomId,
          username,
          playerId,
          callback,
        },
      });
    },
    exitGame: () => {
      dispatch({ type: actions.EXIT_ROOM });
    },
    initializePlayer: (player) => {
      dispatch({
        type: actions.INIT_PLAYER,
        payload: {
          player,
        },
      });
    },
    paySalary: (playerId) => {
      dispatch({ type: actions.PAY_SALARY, payload: { playerId } });
    },
    updateHistory: (history) => {
      dispatch({ type: actions.UPDATE_HISTORY, payload: { history } });
    },
    updatePlayers: (players) => {
      dispatch({ type: actions.UPDATE_PLAYERS, payload: { players } });
    },
    updatePlayerBalance: ({ playerId, fromBank, balance }) => {
      dispatch({
        type: actions.PLAYER_UPDATE_BALANCE,
        payload: { playerId, fromBank, balance },
      });
    },
    updatePlayerStatus: (status) => {
      dispatch({
        type: actions.UPDATE_PLAYER_STATUS,
        payload: { status },
      });
    },
    toggleTheme: () => {
      dispatch({ type: actions.TOGGLE_THEME });
    },
    setTheme: (theme) => {
      dispatch({ type: actions.SET_THEME, payload: { theme } });
    },
    resetState: () => {
      dispatch({ type: actions.RESET_STATE });
    },
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};
