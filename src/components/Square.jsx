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

export default Square;
