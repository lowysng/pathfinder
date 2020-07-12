import React, { useState } from 'react';
import Matrix from './Matrix';
import { initializeMatrix, Pathfinder } from './util';
import { bfs, dfs, bestfs } from './search';
import './App.css';

function App() {

    const NUM_ROWS = Math.floor(window.innerHeight/25);
    const NUM_COLS = Math.floor(window.innerWidth/25) - 1;
    const START_COORDS = { 
        x: Math.floor(Math.random() * NUM_COLS), 
        y: Math.floor(Math.random() * NUM_ROWS)
    };
    const END_COORDS = { 
        x: Math.floor(Math.random() * NUM_COLS), 
        y: Math.floor(Math.random() * NUM_ROWS)
    };
    
    const [matrix, setMatrix] = useState(initializeMatrix(NUM_ROWS, NUM_COLS, START_COORDS, END_COORDS));
    const pathfinder = new Pathfinder(START_COORDS, END_COORDS, { numRows: NUM_ROWS, numCols: NUM_COLS });

    const search = strategy => {
        const { solution, explored } = strategy(pathfinder);

        explored.shift();
        if (strategy === bestfs) explored.pop();
        solution.shift();
        solution.pop();

        const firstCheckpoint = explored.length;
        const secondCheckpoint = explored.length + solution.length;

        for (let i = 0; i < firstCheckpoint; i++) {
            setTimeout(() => {
                const newMatrix = [...matrix];
                newMatrix[explored[i].y][explored[i].x] = 4;
                setMatrix(newMatrix)
            }, 25 * i);
        }

        for (let i = firstCheckpoint; i < secondCheckpoint; i++) {
            setTimeout(() => {
                const newMatrix = [...matrix];
                newMatrix[solution[i - firstCheckpoint].y][solution[i - firstCheckpoint].x] = 5;
                setMatrix(newMatrix)
            }, 25 * i);
        }
    }

    return (
        <>
            <Matrix matrix={matrix}/>
            <button onClick={() => search(bfs)}>Breadth-First Search</button>
            <button onClick={() => search(dfs)}>Depth-First Search</button>
            <button onClick={() => search(bestfs)}>Best-First Search</button>
        </>
    )
}

export default App;