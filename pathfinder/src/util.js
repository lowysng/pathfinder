export const fillMatrix = (row, width, fillWith) => {
    const matrix = [];
    for (let i = 0; i < row; i++) {
        const zeroRow = Array(width).fill(fillWith);
        matrix.push(zeroRow);
    }
    return matrix;
}

export const pixelFlags = {
    start: 0,
    end: 1,
    frontier: 2,
    explored: 3,
}

export const getPixelStyle = pixelFlag => {
    const pixelStyle = {
        width: '25px',
        height: '25px',
        border: '1px solid #d3d3d3',
        marginLeft: '-1px',
        marginTop: '-1px',
        backgroundColor: '#FFFFFF',
    }
    if (pixelFlag == pixelFlags.start) {
        pixelStyle.backgroundColor = '#32B739';
    } else if (pixelFlag == pixelFlags.end) {
        pixelStyle.backgroundColor = '#B73239';
    }
    return pixelStyle;
}