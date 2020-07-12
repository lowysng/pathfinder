import React from 'react';
import { getNodeStyle } from './util';
import './App.css';

function Matrix({ matrix }) {
    return (
        <div className="matrix">
        {matrix.map((row, rowIdx) => (
            <div key={`${rowIdx}`} style={{ display: 'flex' }}>
                {row.map((node, colIdx) => (
                    <div 
                    key={`${rowIdx} ${colIdx}`}
                    style={getNodeStyle(node)}>
                    </div>
                ))}
            </div>
        ))}
        </div>
    )
}

export default Matrix;