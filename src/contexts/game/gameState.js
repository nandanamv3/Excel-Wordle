import { useCallback, useContext, useEffect, useState } from 'react';
import GameContext from './gameContext';
import { boardDefault, boardEvalDefault } from '../../Words';
import { ApiContext } from '../api/apiContext';
import { getErrMsg } from '../../hooks/errorParser';

const maxAttempts = 5;
/**
 * GuessEval: 
 * 0: not in word
 * 1: in word but not in position
 * 2: in word and in position
 */

export function GameState({ children }) {
    const { axiosWordlePrivate, refreshToken } = useContext(ApiContext);

    const [wordLength, setWordLength] = useState(5);
    const [board, setBoard] = useState(boardDefault);
    const [boardEval, setBoardEval] = useState(boardEvalDefault);
    const [wordDayId, setWordDayId] = useState(0);

    const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letter: 0 });

    // Can be used for history
    // eslint-disable-next-line no-unused-vars
    const [correctWord, setCorrectWord] = useState("");
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [gameOver, setGameOver] = useState({
        gameOver: false,
        guessedWord: false,
    });

    const [gameSeriesStarted, setGameSeriesStarted] = useState(false);
    const [gameSeriesOver, setGameSeriesOver] = useState(false);

    const [currentStatusLoading, setCurrentStatusLoading] = useState(true);
    const [error, setError] = useState('');


    const registerIfNotRegistered = useCallback(
        async function () {
            try {
                setCurrentStatusLoading(true);
                setError('');
                const registerStatusRes = await axiosWordlePrivate.get('/register-status');
                const { registered, launched, finished } = registerStatusRes.data;

                setGameSeriesStarted(launched);
                setGameSeriesOver(finished);

                if (!finished && !registered) {
                    await axiosWordlePrivate.post('/register');
                }

            } catch (error) {
                setError(getErrMsg(error));
            } finally {
                setCurrentStatusLoading(false);
            }
        },
        [axiosWordlePrivate]
    );

    const getCurrentStatus = useCallback(
        async function () {
            try {
                setCurrentStatusLoading(true);
                setError('');
                await registerIfNotRegistered();
                setError('');
                const response = await axiosWordlePrivate.get('/current-status');
                const wordLength = response.data.wordlength;

                /**
                 * Backend sends guessEval as an array of stringified JSON
                 */
                const boardEvalArr = [];
                response.data.attempts.guessEval.forEach((evalStr) => {
                    boardEvalArr.push(JSON.parse(evalStr));
                });

                const fullBoardEval = new Array(maxAttempts).fill("").map(() => new Array(wordLength).fill(0));

                for (let i = 0; i < boardEvalArr.length; i++) {
                    for (let j = 0; j < boardEvalArr[i].length; j++) {
                        fullBoardEval[i][j] = boardEvalArr[i][j];
                    }
                }

                const disabledLetters = new Set();

                const boardArray = new Array(maxAttempts).fill("").map(() => new Array(wordLength).fill(""));
                const guessedWords = response.data.attempts.guessWords;
                for (let i = 0; i < guessedWords.length; i++) {
                    for (let j = 0; j < guessedWords[i].length; j++) {
                        boardArray[i][j] = guessedWords[i][j];

                        if (fullBoardEval[i][j] === 0) {
                            disabledLetters.add(guessedWords[i][j]);
                        }
                    }
                }

                /**
                 * For attempts which contain repeated letters, but solution has single letter
                 * the evaluation will be '0' thus we remove all okay letters (1, 2) from disabledLetters
                 * eg: Solution: LIFE, Attempt: IFFY
                 */
                for (let i = 0; i < guessedWords.length; i++) {
                    for (let j = 0; j < guessedWords[i].length; j++) {
                        if (fullBoardEval[i][j] === 1 || fullBoardEval[i][j] === 2) {
                            disabledLetters.delete(guessedWords[i][j]);
                        }
                    }
                }

                setDisabledLetters(Array.from(disabledLetters));
                setBoardEval(fullBoardEval);
                setBoard(boardArray);
                setWordLength(wordLength);
                setWordDayId(response.data.attempts.wordDayId);
                setCurrAttempt({ attempt: response.data.attempts.attempts, letter: 0 });

                setGameOver({
                    gameOver: response.data.attempts.success || response.data.attempts.attempts === maxAttempts,
                    guessedWord: response.data.attempts.success,
                })
            } catch (error) {
                setError(getErrMsg(error));
            } finally {
                setCurrentStatusLoading(false);
            }
        },
        [axiosWordlePrivate, registerIfNotRegistered]
    );

    const submitWord = useCallback(
        async function (word, wordDayId) {
            try {
                setCurrentStatusLoading(true);
                setError('');
                const submitRes = await axiosWordlePrivate.post('/submit-word', {
                    word,
                    wordDayId,
                });
                // console.log('submitRes', submitRes.data.response);
                return submitRes.data.response;
            } catch (error) {
                if (error.response.status === 400 && error.response.data.error.includes('not valid')) {
                    alert('Not a valid Word');
                    return false;
                }
                setError(getErrMsg(error));
                return false;
            } finally {
                setCurrentStatusLoading(false);
            }
        }, [axiosWordlePrivate]
    );


    const onEnter = async () => {
        if (currAttempt.letter !== wordLength) return;

        let currWord = "";
        for (let i = 0; i < wordLength; i++) {
            currWord += board[currAttempt.attempt][i];
        }
        const submitData = await submitWord(currWord, wordDayId);

        if (!submitData) return;

        /**
         * Backend sends guessEval as an array of array of digits (0, 1, 2)
         */
        const boardEvalArr = [];
        submitData.guessEval.forEach((evalArr) => {
            boardEvalArr.push(evalArr);
        });

        const fullBoardEval = new Array(maxAttempts).fill("").map(() => new Array(wordLength).fill(0));

        for (let i = 0; i < boardEvalArr.length; i++) {
            for (let j = 0; j < boardEvalArr[i].length; j++) {
                fullBoardEval[i][j] = boardEvalArr[i][j];
            }
        }
        setBoardEval(fullBoardEval);

        const disabledLetters = new Set();

        const guessedWords = submitData.guessWords;
        for (let i = 0; i < guessedWords.length; i++) {
            for (let j = 0; j < guessedWords[i].length; j++) {
                board[i][j] = guessedWords[i][j];
                if (fullBoardEval[i][j] === 0) {
                    disabledLetters.add(guessedWords[i][j]);
                }
            }
        }
        /**
         * For attempts which contain repeated letters, but solution has single letter
         * the evaluation will be '0' thus we remove all okay letters (1, 2) from disabledLetters
         * eg: Solution: LIFE, Attempt: IFFY
         */
        for (let i = 0; i < guessedWords.length; i++) {
            for (let j = 0; j < guessedWords[i].length; j++) {
                if (fullBoardEval[i][j] === 1 || fullBoardEval[i][j] === 2) {
                    disabledLetters.delete(guessedWords[i][j]);
                }
            }
        }
        setDisabledLetters(Array.from(disabledLetters));


        setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
        setGameOver({
            gameOver: submitData.success || submitData.attempts === maxAttempts,
            guessedWord: submitData.success,
        })
    };

    const onDelete = () => {
        if (currAttempt.letter === 0) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
        setBoard(newBoard);
        setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
    };

    const onSelectLetter = (key) => {
        if (currAttempt.letter > wordLength - 1) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter] = key;
        setBoard(newBoard);
        setCurrAttempt({
            attempt: currAttempt.attempt,
            letter: currAttempt.letter + 1,
        });
    };

    useEffect(() => {
        getCurrentStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axiosWordlePrivate, refreshToken]);

    return (
        <GameContext.Provider
            value={{
                board,
                boardEval,
                setBoard,
                currAttempt,
                setCurrAttempt,
                correctWord,
                onSelectLetter,
                onDelete,
                onEnter,
                setDisabledLetters,
                disabledLetters,
                gameOver,

                currentStatusLoading,
                error,
                gameSeriesOver,
                gameSeriesStarted,

                maxAttempts,
                wordLength,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

