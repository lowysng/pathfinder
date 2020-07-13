export const NODE_WIDTH = 30;
export const NODE_HEIGHT = 30;
const MANHATTAN_MUL = 9;
const EUCLEDIAN_MUL = 9;
const OCTILE_MUL = 2.5;
const CHEBYSHEV_MUL = 2.7;
const STRAIGHT_MOVE_COST = 2.7;
const DIAGONAL_MOVE_COST = 3;

export const manhattan = (a, b) => MANHATTAN_MUL * Math.abs(a.y - b.y) + Math.abs(a.x - b.x);
export const eucledian = (a, b) => EUCLEDIAN_MUL * ((a.y - b.y) ** 2) + ((a.x - b.x) ** 2) ** 0.5;
export const octile = (a, b) => OCTILE_MUL * Math.max(Math.abs(a.x-b.x), Math.abs(a.y-b.y)) + (Math.sqrt(2)-1)*(Math.min(Math.abs(a.x-b.x), Math.abs(a.y-b.y)));
export const chebyshev = (a, b) => CHEBYSHEV_MUL * Math.max(Math.abs(a.x-b.x), Math.abs(a.y-b.y));

export const initializeMatrix = (row, width, start, end) => {
    const matrix = [];
    for (let i = 0; i < row; i++) {
        const zeroRow = Array(width).fill(2);
        matrix.push(zeroRow);
    }
    matrix[start.y][start.x] = 0;
    matrix[end.y][end.x] = 1;
    return matrix;
}

export const getNodeStyle = nodeFlag => {
    const nodeFlags = {
        start: 0,
        end: 1,
        unexplored: 2,
        frontier: 3,
        explored: 4,
        solution: 5,
        wall: 6,
    }
    const nodeStyle = {
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`,
        border: '1px solid #d3d3d3',
        marginLeft: '-1px',
        marginTop: '-1px',
        backgroundColor: '#FFFFFF',
    }
    if (nodeFlag === nodeFlags.start) {
        nodeStyle.backgroundColor = '#32B739';
    } else if (nodeFlag === nodeFlags.end) {
        nodeStyle.backgroundColor = '#B73239';
    } else if (nodeFlag === nodeFlags.frontier) {
        nodeStyle.backgroundColor = '#b87fed';
    } else if (nodeFlag === nodeFlags.explored) {
        nodeStyle.backgroundColor = '#511884';
    } else if (nodeFlag === nodeFlags.solution) {
        nodeStyle.backgroundColor = '#FCD12A'
    } else if (nodeFlag === nodeFlags.wall) {
        nodeStyle.backgroundColor = '#000000'
    }
    return nodeStyle;
}

export class Node {
    constructor(state, parent, action, path_cost) {
        this.state = state;
        this.parent = parent;
        this.action = action; 
        this.path_cost = path_cost;
    }
}

export const getChildNode = (pathfinder, parent, action) => {
    return new Node(
        pathfinder.transitionModel(parent.state, action),
        parent,
        action,
        parent.path_cost + pathfinder.stepCost(action)
    )
}

export const getSolution = node => {
    if (node.parent === null) return [node.state];
    else return getSolution(node.parent).concat(node.state);
}

export class Pathfinder {
    constructor(startCoords, endCoords, canvasDimensions, matrix) {
        this.startCoords = startCoords;
        this.endCoords = endCoords;
        this.canvasDimensions = canvasDimensions;
        this.allowDiag = true;
        this.matrix = matrix;
    }

    goalTest = coords => {
        return coords.x === this.endCoords.x && coords.y === this.endCoords.y;
    }

    getPossibleActions = node => {
        const possibleActions = [];
        if (this.nodeIsAtXOfCanvas(node, 'top-left')) {
            possibleActions.push('move-right', 'move-bottom-right', 'move-bottom');
        } else if (this.nodeIsAtXOfCanvas(node, 'top-right')) {
            possibleActions.push('move-left', 'move-bottom-left', 'move-bottom');
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom-left')) {
            possibleActions.push('move-right', 'move-top-right', 'move-top');
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom-right')) {
            possibleActions.push('move-left', 'move-top-left', 'move-top');
        } else if (this.nodeIsAtXOfCanvas(node, 'top')) {
            possibleActions.push('move-left', 'move-bottom-left', 'move-bottom', 'move-bottom-right', 'move-right');
        } else if (this.nodeIsAtXOfCanvas(node, 'right')) {
            possibleActions.push('move-top', 'move-top-left', 'move-left', 'move-bottom-left', 'move-bottom');
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom')) {
            possibleActions.push('move-left', 'move-top-left', 'move-top', 'move-top-right', 'move-right');
        } else if (this.nodeIsAtXOfCanvas(node, 'left')) {
            possibleActions.push('move-top', 'move-top-right', 'move-right', 'move-bottom-right', 'move-bottom');
        } else {
            possibleActions.push('move-top-right', 'move-right',
            'move-bottom-right', 'move-bottom', 'move-bottom-left',
            'move-left', 'move-top-left', 'move-top');
        }
        return possibleActions;
    }

    nodeIsAtXOfCanvas = (node, x) => {
        const node_x = node.x;
        const node_y = node.y;
        const canvasRows = this.canvasDimensions.numRows;
        const canvasCols = this.canvasDimensions.numCols;
    
        const nodeAtLeftEdge = node_x === 0;
        const nodeAtTopEdge = node_y === 0;
        const nodeAtRightEdge = node_x === canvasCols - 1;
        const nodeAtBottomEdge =  node_y === canvasRows - 1;
    
        switch (x) {
            case 'top-left':
                if (nodeAtLeftEdge && nodeAtTopEdge) return true;
                return false;
            case 'top-right':
                if (nodeAtRightEdge && nodeAtTopEdge) return true;
                return false;
            case 'bottom-left':
                if (nodeAtLeftEdge && node_y === nodeAtBottomEdge) return true;
                return false;
            case 'bottom-right':
                if (nodeAtRightEdge && nodeAtBottomEdge) return true;
                return false;
            case 'top': 
                if (nodeAtTopEdge) return true;
                return false;
            case 'bottom': 
                if (nodeAtBottomEdge) return true;
                return false;
            case 'left':
                if (nodeAtLeftEdge) return true;
                return false;
            case 'right':
                if (nodeAtRightEdge) return true;
                return false;
            default:
                throw new Error('X unrecognized');
        }
    }

    transitionModel = (node, move) => {
        let newX, newY;
        const isNotAWall = () => this.matrix[newY][newX] !== 6;
        switch (move) {
            case 'move-top':
                newX = node.x;
                newY = node.y - 1;
                break;
            case 'move-top-right':
                newX = node.x + 1;
                newY = node.y - 1;
                break;
            case 'move-right':
                newX = node.x + 1;
                newY = node.y;
                break;
            case 'move-bottom-right':
                newX = node.x + 1;
                newY = node.y + 1;
                break;
            case 'move-bottom':
                newX = node.x;
                newY = node.y + 1;
                break;
            case 'move-bottom-left':
                newX = node.x - 1;
                newY = node.y + 1;
                break;
            case 'move-left':
                newX = node.x - 1;
                newY = node.y;
                break;
            case 'move-top-left':
                newX = node.x - 1;
                newY = node.y - 1;
                break;
        }
        if (isNotAWall()) return { x: newX, y: newY };
        else return null;
    }

    stepCost = move => {
        switch (move) {
            case 'move-top':
                return STRAIGHT_MOVE_COST;
            case 'move-top-right':
                return DIAGONAL_MOVE_COST;
            case 'move-right':
                return STRAIGHT_MOVE_COST;
            case 'move-bottom-right':
                return DIAGONAL_MOVE_COST;
            case 'move-bottom':
                return STRAIGHT_MOVE_COST;
            case 'move-bottom-left':
                return DIAGONAL_MOVE_COST;
            case 'move-left':
                return STRAIGHT_MOVE_COST;
            case 'move-top-left':
                return DIAGONAL_MOVE_COST;
        }
    }
    
}

export const objectsAreEquivalent = (a, b) => {
    return a.x === b.x && a.y === b.y;
}