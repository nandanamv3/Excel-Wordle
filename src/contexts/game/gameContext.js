import { createContext } from 'react';
import { boardDefault } from '../../Words';

const GameContext = createContext({
    board: boardDefault,
    setBoard: () => { },
    currAttempt: { attempt: 0, letter: 0 },
    setCurrAttempt: () => { },
    correctWord: "",
    onSelectLetter: () => { },
    onDelete: () => { },
    onEnter: () => { },
    setDisabledLetters: () => { },
    disabledLetters: [],
    gameOver: { gameOver: false, guessedWord: false },

    maxAttempts: 5,
    wordLength: 5,
});

export default GameContext;
