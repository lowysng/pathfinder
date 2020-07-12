import React from 'react';
import Matrix from './Matrix';
import { fillMatrix } from './util';
import './App.css';

function App() {

    const num_rows = Math.floor(window.innerHeight/25); // 38 rows
    const num_cols = Math.floor(window.innerWidth/25) - 2; // 74 columns
    const matrix = fillMatrix(num_rows, num_cols, 2);

    const START = { x: 7, y: 7 };
    const END = { 
        x: Math.floor(Math.random() * num_rows), 
        y: Math.floor(Math.random() * num_cols)
    };

    matrix[START.x][START.y] = 0;
    matrix[END.x][END.y] = 1;

    return (
        <>
            <Matrix matrix={matrix}/>
        </>
    )
}

export default App;