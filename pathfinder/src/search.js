import { Node, getSolution, objectsAreEquivalent } from './util';

export const bfs = pathfinder => {
    // Breadth-First Search
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        node = frontier.shift();
        explored.push(node.state);
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

    return { solution: solution, explored: explored };
}

export const dfs = pathfinder => {
    // Depth-First Search
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        node = frontier.shift();
        explored.push(node.state);
        pathfinder.getSurroundingNodesCoords(node.state).forEach(coords => {
            let child = new Node(coords, node);
            if (!explored.some(c => objectsAreEquivalent(c, coords)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, coords))) {
                if (pathfinder.goalTest(coords)) {
                    solution = getSolution(child);
                }
                frontier.unshift(child);
            };
        })
    }

    return { solution: solution, explored: explored };
}

export const bestfs = pathfinder => {
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        node = frontier.shift();
        if (pathfinder.goalTest(node.state)) solution = getSolution(node);
        explored.push(node.state);
        pathfinder.getSurroundingNodesCoords(node.state).forEach(coords => {
            let child = new Node(coords, node);
            if (!explored.some(c => objectsAreEquivalent(c, coords)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, coords))) {
                frontier.unshift(child);
                frontier.sort((a, b) => pathfinder.heuristics(a.state) - pathfinder.heuristics(b.state));
            }
        })
    }

    return { solution: solution, explored: explored };

}