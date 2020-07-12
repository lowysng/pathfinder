import { Node, getSolution, objectsAreEquivalent } from './util';

export const bfs = (pathfinder, markExplored) => {
    // Breadth-First Search
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return getSolution(node);
    const frontier = [node];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        node = frontier.shift();
        explored.push(node.state);
        markExplored(node.state);
        pathfinder.getSurroundingNodesCoords(node.state).forEach(coords => {
            let child = new Node(coords, node);
            if (!explored.some(c => objectsAreEquivalent(c, coords)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, coords))) {
                if (pathfinder.goalTest(coords)) {
                    solution = getSolution(child);
                }
                frontier.push(child);
            };
        })
    }

    return solution;
}