import "./Game.css";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import { useContext } from "react";
import GameOver from "../components/GameOver";
import GameContext from "../contexts/game/gameContext";

function Game() {
    const {
        gameOver,
        currentStatusLoading,
        error,
        gameSeriesOver,
        gameSeriesStarted,
        currAttempt
    } = useContext(GameContext);


    if (currentStatusLoading) {
        return (
            <div className="game">
                <span>Loading...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="game">
                <span>{error}</span>
            </div>
        )
    }

    if (!gameSeriesStarted) {
        return (
            <div className="game">
                <span>Game not started yet. Stay tuned!!</span>
            </div>
        )
    }

    if (gameSeriesOver) {
        return (
            <div className="game">
                <span>That's a wrap. See you at Excel!</span>
            </div>
        )
    }

    return (
        <div className="game">
            <Board />
            {gameOver.gameOver ? <GameOver 
                currAttempt={currAttempt}
                gameOver={gameOver}
                correctWord={undefined}
            /> : <Keyboard />}
        </div>

    );
}

export default Game;
