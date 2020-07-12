import React, { useState } from 'react';
import Matrix from './Matrix';
import { initializeMatrix, Pathfinder } from './util';
import { bfs } from './search';
import './App.css';

function App() {

    const NUM_ROWS = Math.floor(window.innerHeight/25);
    const NUM_COLS = Math.floor(window.innerWidth/25);
    const START_COORDS = { x: 7, y: 7 };
    // const END_COORDS = { x: 8, y: 8};
    const END_COORDS = { 
        x: Math.floor(Math.random() * NUM_COLS), 
        y: Math.floor(Math.random() * NUM_ROWS)
    };
    
    const [matrix, setMatrix] = useState(initializeMatrix(NUM_ROWS, NUM_COLS, START_COORDS, END_COORDS));
    const pathfinder = new Pathfinder(START_COORDS, END_COORDS, { numRows: NUM_ROWS, numCols: NUM_COLS });
    
    const markExplored = coord => {
        const newMatrix = [...matrix];
        newMatrix[coord.y][coord.x] = 4;
        setMatrix(newMatrix);
    }

    const search = () => {
        const solution = bfs(pathfinder,  markExplored);
        const newMatrix = [...matrix];
        solution.forEach(coord => {
            newMatrix[coord.y][coord.x] = 5;
        })
        setMatrix(newMatrix);
    }

    return (
        <>
            <Matrix matrix={matrix}/>
            <button onClick={() => search()}>Search</button>
        </>
    )
}

export default App;