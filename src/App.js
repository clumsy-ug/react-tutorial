// 降順にしてから適当な箇所に戻って、プレイを続けると行列表示がおかしくなってる
// 勝者の3個だけではなくすべてが赤色になってしまう

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

function Board({ xIsNext, squares, onPlay, rowColHistory, setRowColHistory, indexes, setIndexes }) {
    function handleClick(i, row, col) {
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
        
        // 既存プロパティを直接変更する(mutable)必要がある？ので、参照を共有しないようにshallow copyではなくdeep copyする
        const newRowColHistory = JSON.parse(JSON.stringify(rowColHistory));
        newRowColHistory[i].row = row;
        newRowColHistory[i].col = col;
        setRowColHistory(newRowColHistory)
        console.log(`今押されたのは${row}行${col}列です`);
        const newIndexes = [ ...indexes ];
        newIndexes.push(i);
        setIndexes(newIndexes);
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
    const [isAcsending, setIsAcsending] = useState(true);
    const [rowColHistory, setRowColHistory] = useState(Array.from({ length: 9 }, () => ({ row: null, col: null })));
    const [indexes, setIndexes] = useState([null]);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    let moves = history.map((_, move) => {
        let description;
        if (move > 0) {
            const index = indexes[move];
            if (move === currentMove) {
                description = `You are at move #${move} / (${rowColHistory[index].row},${rowColHistory[index].col})`;
            } else {
                description = `Go to move #${move} / (${rowColHistory[index].row},${rowColHistory[index].col})`;
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

    if (!isAcsending) moves.reverse();

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
                />
            </div>
            <div className="game-info">
                <button style={{ marginLeft: "30px" }} onClick={() => setIsAcsending(!isAcsending)}>
                    {isAcsending ? "降順で並べ替え" : "昇順で並べ替え"}
                </button>
                <button onClick={() => window.location.reload()} style={{ marginInline: '5px' }}>ブラウザ再読み込み</button>
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
