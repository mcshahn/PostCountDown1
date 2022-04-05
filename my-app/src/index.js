import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  
  
  renderSquare(i) {
    return <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}

    />;
  }
  

  render() {
    return (
      

      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      historySquares: [{
        squares: Array(0).fill(null),
      }],
      stepNumber:0,
      xIsNext: true,
      historyCol: [],
      historyRow: [],
    }
  }
  handleClick(i){
    const historySquares = this.state.historySquares.slice(0, this.state.stepNumber+1);
    const current = historySquares[historySquares.length-1];
    const squares = current.squares.slice();
    const hisCol = this.state.historyCol.slice(0, this.state.stepNumber);
    const hisRow = this.state.historyRow.slice(0, this.state.stepNumber);
    const curCol = i%3;
    const curRow = Math.floor(i/3);
    // console.log("column: " + col + "row: " + row );
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      historySquares: historySquares.concat([{squares: squares, }]),
      historyCol: hisCol.concat(curCol),
      historyRow: hisRow.concat(curRow),
      stepNumber: historySquares.length,
      xIsNext: !this.state.xIsNext,
    }); 
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  render() {
    const historySquares = this.state.historySquares;
    const current = historySquares[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    // console.log("col: " + this.state.historyCol);
    // console.log("row: " + this.state.historyRow);
    // const col = this.state.col[this.state.stepNumber];
    // const row = this.state.row[this.state.stepNumber];
    const moves = historySquares.map((step, move) => {
      const desc = move ? 'Go to move #' + move: 'Go to game start';
 
      return (
        <li key={move}>
          <button onClick = {()=> this.jumpTo(move)}>{desc}</button>
          {<h3>Location: ({this.state.historyCol[move]},{this.state.historyRow[move]})</h3> }
        </li>
        
      );
    });
    
    
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }else if(historySquares.length<=9){
      status = 'Next player: ' + (this.state.xIsNext? 'X':'O');
    }else{
      status = "Draw!"
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



