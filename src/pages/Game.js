import "./Game.css";
import Board from "../components/Board";
import Keyboard from "../components/Keyboard";
import { useContext, useEffect } from "react";
import GameOver from "../components/GameOver";
import { AppContext } from "../App";
import { useWordleData } from "../hooks/useWordleData";

function Game() {
    const { gameOver } = useContext(AppContext);
    const { currentStatus, loading, error, getCurrentStatus } = useWordleData();

    useEffect(() => {
        getCurrentStatus();
    }, []);

    console.log('currentStatus', currentStatus);

    if (loading) {
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

    return (
        <div className="game">
            <Board />
            {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>

    );
}

export default Game;
