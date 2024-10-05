import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
    return (
        <button
            className="square"
            style={{ color: value === winner ? 'red' : 'black' }}
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
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

    return (
        <>
            <div className="status">{status}</div>

            {[0, 1, 2].map((row) => (
                <div className="board-row">
                    {[0, 1, 2].map((col) => {
                        const index = row * 3 + col;
                        return (
                            <Square
                                key={index}
                                value={squares[index]}
                                onSquareClick={() => handleClick(index)}
                                winner={winner}
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
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [isAcsending, setIsAcsending] = useState(true);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }
    
    let moves = history.map((_, move) => {
        let description;
        if (move > 0) {
            if (move === currentMove) {
                description = "You are at move #" + move;
            } else {
                description = "Go to move #" + move;
            }
        } else {
            description = "Go to game start";
        }

        if (move === currentMove) {
            return (
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    {description}
                </span>
            );
        } else {
            return (
                <li key={move}>
                    <button onClick={() => setCurrentMove(move)}>{description}</button>
                </li>
            );
        }
    });

    if (!isAcsending) moves.reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button style={{ marginLeft: "30px" }} onClick={() => setIsAcsending(!isAcsending)}>
                    {isAcsending ? "降順で並べ替え" : "昇順で並べ替え"}
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
            return squares[a];
        }
    }
    return null;
}
