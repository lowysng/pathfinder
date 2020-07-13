import React from 'react';
import ReactDOM from 'react-dom';
import { getNodeStyle } from './util';
import './App.css';

function Matrix({ matrix, toggleWall }) {
    return (
        <div className="matrix">
        {matrix.map((row, rowIdx) => (
            <div key={`${rowIdx}`} style={{ display: 'flex' }}>
                {row.map((node, colIdx) => (
                    <div 
                    key={`${rowIdx} ${colIdx}`}
                    style={getNodeStyle(node)}
                    onMouseOver={() => toggleWall(rowIdx, colIdx)}>
                    </div>
                ))}
            </div>
        ))}
        </div>
    )
}

export default Matrix;