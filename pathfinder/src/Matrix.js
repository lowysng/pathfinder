import React from 'react';
import { getPixelStyle } from './util';
import './App.css';

function Matrix({ matrix }) {
    return (
        <>
        {matrix.map((row, rowIdx) => (
            <div key={`${rowIdx}`} style={{ display: 'flex' }}>
                {row.map((pixel, colIdx) => (
                    <div 
                    key={`${rowIdx} ${colIdx}`}
                    style={getPixelStyle(pixel)}>
                    </div>
                ))}
            </div>
        ))}
        </>
    )
}

export default Matrix;