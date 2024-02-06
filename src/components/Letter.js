import React, { useContext } from "react";
import GameContext from "../contexts/game/gameContext";

function Letter({ letterPos, attemptVal }) {
  const { board, currAttempt, boardEval } =
    useContext(GameContext);

  const letter = board[attemptVal][letterPos];
  const correct = boardEval[attemptVal][letterPos] === 2;
  const almost = boardEval[attemptVal][letterPos] === 1;
  const letterState =
    currAttempt.attempt > attemptVal ?
      (correct ? "correct" : almost ? "almost" : "error") : ''

  return (
    <div
      className="letter"
      id={letterState}
      key={`${letterPos}-${attemptVal}-${boardEval[letterPos][attemptVal]}`}
    >
      {letter}
    </div>
  );
}

export default Letter;
