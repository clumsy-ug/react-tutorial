import Square from "./Square";
import calculateWinner from "./CalculateWinner";

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

export default Board;
