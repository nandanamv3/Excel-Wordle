import "./App.css";
import React from "react";
import Game from "./pages/Game";
import { ApiState } from './contexts/api/apiState';
import { UserState } from './contexts/user/userState';
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { GameState } from "./contexts/game/gameState";

function App() {

  return (
    <ApiState>
      <UserState>
        <GameState>
          <div className="App">
            <Navbar />
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          </div>
        </GameState>
      </UserState>
    </ApiState>
  );
}

export default App;
