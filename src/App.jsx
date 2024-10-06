import { useState } from "react";

import Board from "./components/Board";

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;
    const [isAscending, setIsAscending] = useState(true);
    const [rowColHistory, setRowColHistory] = useState([{}]);
    const [indexes, setIndexes] = useState([null]);

    function handlePlay(nextSquares) {
        const copyHistory = history.slice(0, currentMove + 1);
        const nextHistory = [...copyHistory, nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    let moves = history.map((_, move) => {
        let description;
        if (move > 0) {
            // console.log('rowColHistoryは', rowColHistory);
            if (move === currentMove) {
                description = `You are at move #${currentMove} / (${rowColHistory[move].row},${rowColHistory[move].col})`;
            } else {
                description = `Go to move #${move} / (${rowColHistory[move].row},${rowColHistory[move].col})`;
            }
        } else {
            description = "Go to game start";
        }

        return (
            <li key={move}>
                {move === currentMove ? (
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>{description}</span>
                ) : (
                    <button onClick={() => setCurrentMove(move)}>{description}</button>
                )}
            </li>
        )
    });

    if (!isAscending) moves.reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    rowColHistory={rowColHistory}
                    setRowColHistory={setRowColHistory}
                    indexes={indexes}
                    setIndexes={setIndexes}
                    currentMove={currentMove}
                />
            </div>
            <div className="game-info">
                <button style={{ marginLeft: "30px" }} onClick={() => setIsAscending(!isAscending)}>
                    {isAscending ? "降順で並べ替え" : "昇順で並べ替え"}
                </button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}
