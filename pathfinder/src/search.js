import { Node, getSolution, objectsAreEquivalent } from './util';

export const bfs = pathfinder => {
    // Breadth-First Search
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
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

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const dfs = pathfinder => {
    // Depth-First Search
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
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

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const bestfs = (pathfinder, heuristic) => {
    let node = new Node(pathfinder.startCoords, null);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
        node = frontier.shift();
        if (pathfinder.goalTest(node.state)) solution = getSolution(node);
        explored.push(node.state);
        pathfinder.getSurroundingNodesCoords(node.state).forEach(coords => {
            let child = new Node(coords, node);
            if (!explored.some(c => objectsAreEquivalent(c, coords)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, coords))) {
                frontier.unshift(child);
                switch (heuristic) {
                    case 'euc':
                        frontier.sort((a, b) => (pathfinder.eucledian(a.state) < pathfinder.eucledian(b.state)) ? -1 : 1);
                        break;
                    case 'man':
                        frontier.sort((a, b) => (pathfinder.manhattan(a.state) < pathfinder.manhattan(b.state)) ? -1 : 1);
                        break;
                }
            }
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const a_star = (pathfinder, heuristic) => {
    let node = new Node(pathfinder.startCoords, null, 0);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
        node = frontier.shift();
        if (pathfinder.goalTest(node.state)) solution = getSolution(node);
        explored.push(node.state);
        pathfinder.getSurroundingNodesCoords(node.state).forEach(coords => {
            let child = new Node(coords, node, node.path_cost + 1);
            if (!explored.some(c => objectsAreEquivalent(c, coords)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, coords))) {
                frontier.unshift(child);
                switch (heuristic) {
                    case 'euc':
                        frontier.sort((a, b) => (pathfinder.eucledian(a.state) + a.path_cost) < (pathfinder.eucledian(b.state) + b.path_cost) ? -1 : 1);
                        break;
                    case 'man':
                        frontier.sort((a, b) => (pathfinder.manhattan(a.state) + a.path_cost) < (pathfinder.manhattan(b.state) + b.path_cost) ? -1 : 1);
                        break;
                }
            }
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}