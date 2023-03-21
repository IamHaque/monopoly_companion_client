import { createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/home.page';
import GamePage from './pages/game.page';
import ErrorPage from './pages/error.page';
import NewGamePage from './pages/newGame.page';
import JoinGamePage from './pages/joinGame.page';

export default createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/game',
    element: <GamePage />,
  },
  {
    path: '/newGame',
    element: <NewGamePage />,
  },
  {
    path: '/joinGame',
    element: <JoinGamePage />,
  },
]);
