import { useState } from "react";

function Square({ value, onSquareClick, index, a, b, c }) {
    return (
        <button
            className="square"
            style={{ color: [a, b, c].includes(index) ? 'red' : 'black' }}
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay, rowColHistory, setRowColHistory, indexes, setIndexes, currentMove }) {
    function handleClick(i, row, col) {
        if (calculateWinner(squares)[0] || squares[i]) { // 既に勝者がいるor既にそのマスが埋まっている場合
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
        
        const newRowColHistory = rowColHistory.slice(0, currentMove + 1);
        newRowColHistory.push({ row, col });
        setRowColHistory(newRowColHistory)
        // console.log(`今押されたのは${row}行${col}列です`);
        const newIndexes = indexes.slice(0, currentMove + 1);
        newIndexes.push(i);
        setIndexes(newIndexes);
    }

    const [winner] = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        if (!squares.includes(null)) {
            status = 'Draw!';
        } else {
            status = "Next player: " + (xIsNext ? "X" : "O");
        }
    }

    const [, a, b, c] = calculateWinner(squares);

    return (
        <>
            <div className="status">{status}</div>

            {[0, 1, 2].map(row => (
                <div className="board-row" key={row}>
                    {[0, 1, 2].map(col => {
                        const index = row * 3 + col;
                        return (
                            <Square
                                key={index}
                                value={squares[index]}
                                onSquareClick={() => handleClick(index, row, col)}
                                winner={winner}
                                index={index}
                                a={a} b={b} c={c}
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

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

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], a, b, c];
        }
    }
    return [null];
}
