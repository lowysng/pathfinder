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

export const nodeFlags = {
    start: 0,
    end: 1,
    unexplored: 2,
    frontier: 3,
    explored: 4,
}

export const getNodeStyle = nodeFlag => {
    const nodeStyle = {
        width: '25px',
        height: '25px',
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
        nodeStyle.backgroundColor = '#290c43';
    }
    return nodeStyle;
}

export class Node {
    constructor(state, parent, action, pathCost) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.pathCost = pathCost;
    }
}

export const generateChildNode = (agent, parent, action) => {
    return new Node(
        agent.transition(parent.state, action),
        parent,
        action,
        parent.pathCost + agent.stepCost(parent.state, action)
    )
}

export const getSolution = node => {
    if (node.parent === null) return [node.state];
    else return getSolution(node.parent).concat(node.state);
}

export class Pathfinder {
    constructor(startCoords, endCoords, canvasDimensions) {
        this.startCoords = startCoords;
        this.endCoords = endCoords;
        this.canvasDimensions = canvasDimensions;
    }

    transition = (fromCoords, toCoords) => toCoords;

    goalTest = nodeCoords => this.endCoords.x === nodeCoords.x && this.endCoords.y === nodeCoords.y;

    stepCost = (parentState, action) => 1;

    getSurroundingNodes = node => {
        const surroundingNodes = [];
        if (this.nodeIsAtXOfCanvas(node, 'top-left')) {
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y + 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'top-right')) {
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y + 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom-left')) {
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom-right')) {
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'top')) {
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y + 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'right')) {
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
            surroundingNodes.push({x: node.x, y: node.y + 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'bottom')) {
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
        } else if (this.nodeIsAtXOfCanvas(node, 'left')) {
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
            surroundingNodes.push({x: node.x, y: node.y + 1});
        } else {
            surroundingNodes.push({x: node.x + 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y + 1});
            surroundingNodes.push({x: node.x - 1, y: node.y});
            surroundingNodes.push({x: node.x, y: node.y - 1});
        }
        return surroundingNodes;
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
}

export const objectsAreEquivalent = (a, b) => {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}