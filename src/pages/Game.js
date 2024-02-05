import "./Game.css";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import { useContext } from "react";
import GameOver from "../components/GameOver";
import { AppContext } from "../App";

function Game() {
    const { gameOver } = useContext(AppContext);
    return (
        <div className="game">
            <Board />
            {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>

    );
}

export default Game;
