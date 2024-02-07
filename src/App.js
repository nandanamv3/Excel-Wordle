import "./App.css";
import React from "react";
import Game from "./pages/Game/Game";
import { ApiState } from './contexts/api/apiState';
import { UserState } from './contexts/user/userState';
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { GameState } from "./contexts/game/gameState";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import HowToPlay from "./pages/HowToPlay/HowToPlay";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home />
    ),
  },
  {
    path: "/game",
    element: (
      <ProtectedRoute>
        <Game />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <Leaderboard />
    ),
  },
  {
    path: "/how-to-play",
    element: (
      <HowToPlay />
    ),
  }
]);


function App() {

  return (
    <ApiState>
      <UserState>
        <GameState>
          <div className="App">
            <Navbar />
            <RouterProvider router={router} />
          </div>
        </GameState>
      </UserState>
    </ApiState>
  );
}

export default App;
