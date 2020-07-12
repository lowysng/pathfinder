import React, { useState } from 'react';
import Matrix from './Matrix';
import { initializeMatrix, Pathfinder } from './util';
import { bfs } from './search';
import './App.css';

function App() {

    const NUM_ROWS = Math.floor(window.innerHeight/25); // 38 rows
    const NUM_COLS = Math.floor(window.innerWidth/25) - 2; // 74 columns
    const START_COORDS = { x: 7, y: 7 };
    const END_COORDS = { x: 8, y: 8};
    // const END = { 
    //     x: Math.floor(Math.random() * NUM_COLS), 
    //     y: Math.floor(Math.random() * NUM_ROWS)
    // };
    
    const [matrix, setMatrix] = useState(initializeMatrix(NUM_ROWS, NUM_COLS, START_COORDS, END_COORDS));
    const updateMatrix = newMatrix => setMatrix(newMatrix);

    const pathfinder = new Pathfinder(START_COORDS, END_COORDS, { numRows: NUM_ROWS, numCols: NUM_COLS });
    console.log(bfs(pathfinder, updateMatrix));

    return (
        <>
            <Matrix matrix={matrix}/>
            <button onClick={updateMatrix}>Step</button>
        </>
    )
}

export default App;