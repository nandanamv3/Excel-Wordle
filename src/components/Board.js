import React, { useContext } from "react";
import Letter from "./Letter";
import GameContext from "../contexts/game/gameContext";

function Board() {
  const { wordLength, maxAttempts, boardEval } = useContext(GameContext);

  function row(attemptVal) {
    const letters = [];
    for (let letterPos = 0; letterPos < wordLength; letterPos++) {
      letters.push(
        <Letter
          letterPos={letterPos}
          attemptVal={attemptVal}
          key={`${letterPos}-${attemptVal}-${boardEval[attemptVal][letterPos]}`}
        />
      );
    }
    return (
      <div className="row" key={`${attemptVal}`}>
        {letters}
      </div>
    );
  }

  const rows = [];
  for (let attemptVal = 0; attemptVal < maxAttempts; attemptVal++) {
    rows.push(row(attemptVal));
  }

  return (
    <div className="board">
      {" "}
      {rows}
    </div>
  );
}

export default Board;
