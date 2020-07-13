import React, { useState } from 'react';
import Matrix from './Matrix';
import { NODE_WIDTH, NODE_HEIGHT, initializeMatrix, Pathfinder, manhattan, eucledian, octile, chebyshev} from './util';
import { bfs, dfs, bestfs, a_star } from './search';
import './App.css';

function App() {

    const NUM_ROWS = Math.floor(window.innerHeight/NODE_HEIGHT);
    const NUM_COLS = Math.floor(window.innerWidth/NODE_WIDTH);
    const START_COORDS = { x: Math.floor(Math.random() * NUM_COLS), y: Math.floor(Math.random() * NUM_ROWS) };
    const END_COORDS = { x: Math.floor(Math.random() * NUM_COLS), y: Math.floor(Math.random() * NUM_ROWS) };
    // const START_COORDS = { x: 10, y: 10 };
    // const END_COORDS = { x: NUM_COLS - 10, y: NUM_ROWS - 10 };

    const [startCoords, setStartCoords] = useState(START_COORDS);
    const [endCoords, setEndCoords] = useState(END_COORDS);
    const initial_matrix = initializeMatrix(NUM_ROWS, NUM_COLS, startCoords, endCoords);
    const [matrix, setMatrix] = useState([...initial_matrix]);
    const [pathfinder, setPathfinder] = useState(new Pathfinder(startCoords, endCoords, { numRows: NUM_ROWS, numCols: NUM_COLS }));

    const search = (strategy, heuristic) => {
        const { solution, explored, frontier } = strategy(pathfinder, heuristic);

        explored.shift();
        frontier.shift();
        if (strategy === bestfs || strategy === a_star) {
            explored.pop();
            frontier.pop();
        };
        solution.shift();
        solution.pop();

        const firstCheckpoint = explored.length;
        const secondCheckpoint = explored.length + solution.length;

        for (let i = 0; i < firstCheckpoint; i++) {
            setTimeout(() => {
                const newMatrix = [...matrix];
                let frontierCoords = frontier[i];
                frontierCoords.forEach(c => { if (c.x !== endCoords.x || c.y !== endCoords.y) newMatrix[c.y][c.x] = 3 });
                newMatrix[explored[i].y][explored[i].x] = 4;
                setMatrix(newMatrix)
            }, 35 * i);
        }

        for (let i = firstCheckpoint; i < secondCheckpoint; i++) {
            setTimeout(() => {
                const newMatrix = [...matrix];
                newMatrix[solution[i - firstCheckpoint].y][solution[i - firstCheckpoint].x] = 5;
                setMatrix(newMatrix)
            }, 35 * i);
        }
    }

    const clear = () => {
        setMatrix([...initial_matrix]);
    };

    return (
        <>
            <Matrix matrix={matrix}/>
            <button onClick={() => search(bfs)}>Breadth-First Search</button>
            <button onClick={() => search(dfs)}>Depth-First Search</button>
            <div style={{display: 'flex'}}>
                <button onClick={() => search(bestfs, eucledian)}>Best-First Search (Eucledian)</button>
                <button onClick={() => search(bestfs, manhattan)}>Best-First Search (Manhattan)</button>
                <button onClick={() => search(bestfs, octile)}>Best-First Search (Octile)</button>
                <button onClick={() => search(bestfs, chebyshev)}>Best-First Search (Chebyshev)</button>
            </div>
            <div style={{display: 'flex'}}>
                <button onClick={() => search(a_star, eucledian)}>A* Search (Eucledian)</button>
                <button onClick={() => search(a_star, manhattan)}>A* Search (Manhattan)</button>
                <button onClick={() => search(a_star, octile)}>A* Search (Octile)</button>
                <button onClick={() => search(a_star, chebyshev)}>A* Search (Chebyshev)</button>
            </div>
            <button onClick={() => clear()}>Clear</button>
        </>
    )
}

export default App;