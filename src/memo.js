let moves = history.map((_, move) => {
    let description;
    if (move > 0) {
        const targetObj = rowColHistory[move - 1]; // moveに対応する着手位置を取得
        if (move === currentMove) {
            description = `You are at move #${move} (${targetObj.row}行 ${targetObj.col}列)`;
        } else {
            description = `Go to move #${move} (${targetObj.row}行 ${targetObj.col}列)`;
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
    );
});
