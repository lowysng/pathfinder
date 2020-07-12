import { Node, generateChildNode, getSolution, objectsAreEquivalent, initializeMatrix } from './util';

export const bfs = (pathfinder, updateMatrix) => {
    const matrix = initializeMatrix(pathfinder.canvasDimensions.numRows, pathfinder.canvasDimensions.numCols, pathfinder.startCoords, pathfinder.endCoords);
    // Breadth-first Search
    let i = 0;
    let node = new Node(pathfinder.startCoords, null, null, 0);
    if (pathfinder.goalTest(node.state)) return getSolution(node);
    const frontier = [node];
    const explored = [];
    while (frontier.length != 0) {
        console.log(i);
        frontier.forEach(node => console.log(JSON.stringify(node.state)))
        node = frontier.shift();
        explored.push(node.state);
        console.log("expanding :" + JSON.stringify(node.state));
        // explored.forEach(state => console.log(state));
        pathfinder.getSurroundingNodes(node.state).forEach(toNode => {
            let child = generateChildNode(pathfinder, node, toNode);
            if (!explored.some(nodeState => objectsAreEquivalent(nodeState, child.state)) 
            && !frontier.some(node => objectsAreEquivalent(node.state, child.state))) {
                if (pathfinder.goalTest(child.state)) return getSolution(child);
                frontier.push(child);
            }
        })
        explored.forEach(state => {
            matrix[state.y][state.x] = matrix[state.y][state.x] + 1
            updateMatrix(matrix);
        })
        if (i == 1) break;
        i += 1;
    }
    return "FAILURE";
}

