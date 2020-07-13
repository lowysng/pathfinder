import { Node, getChildNode, getSolution, objectsAreEquivalent, eucledian, manhattan } from './util';

export const bfs = pathfinder => {
    // Breadth-First Search
    let node = new Node(pathfinder.startCoords, null, null, 0);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
        node = frontier.shift();
        explored.push(node.state);
        pathfinder.getPossibleActions(node.state).forEach(action => {
            let child = getChildNode(pathfinder, node, action);
            if (child.state) {
                if (!explored.some(c => objectsAreEquivalent(c, child.state)) 
                && !frontier.some(n => objectsAreEquivalent(n.state, child.state))) {
                    if (pathfinder.goalTest(child.state)) {
                        solution = getSolution(child);
                    }
                    frontier.push(child);
                };
            }
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const dfs = pathfinder => {
    // Depth-First Search
    let node = new Node(pathfinder.startCoords, null, null, 0);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
        node = frontier.shift();
        explored.push(node.state);
        pathfinder.getPossibleActions(node.state).forEach(action => {
            let child = getChildNode(pathfinder, node, action);
            if (!explored.some(c => objectsAreEquivalent(c, child.state)) 
            && !frontier.some(n => objectsAreEquivalent(n.state, child.state))) {
                if (pathfinder.goalTest(child.state)) {
                    solution = getSolution(child);
                }
                frontier.unshift(child);
            };
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const bestfs = (pathfinder, heuristic) => {
    let node = new Node(pathfinder.startCoords, null, null, 0);
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
        pathfinder.getPossibleActions(node.state).forEach(action => {
            let child = getChildNode(pathfinder, node, action);
            if (child.state) {
                if (!explored.some(c => objectsAreEquivalent(c, child.state)) 
                && !frontier.some(n => objectsAreEquivalent(n.state, child.state))) {
                    frontier.unshift(child);
                    frontier.sort((a, b) => (heuristic(pathfinder.endCoords, a.state) < heuristic(pathfinder.endCoords, b.state)) ? -1 : 1);
                }
            }
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}

export const a_star = (pathfinder, heuristic) => {
    let node = new Node(pathfinder.startCoords, null, null, 0);
    let solution = null;
    if (pathfinder.goalTest(node.state)) return { solution: getSolution(node), explored: [] };

    const frontier = [node];
    const frontier_history = [];
    const explored = [];

    let i = 0;

    while (frontier.length > 0 && !solution) {
        frontier_history.push(frontier.map(n => n.state));
        node = frontier.shift();
        if (pathfinder.goalTest(node.state)) solution = getSolution(node);
        explored.push(node.state);
        pathfinder.getPossibleActions(node.state).forEach(action => {
            let child = getChildNode(pathfinder, node, action);
            if (child.state) {
                let childInExplored = explored.some(c => objectsAreEquivalent(c, child.state));
                let childInFrontier = frontier.some(n => objectsAreEquivalent(n.state, child.state));
                if (!childInExplored && !childInFrontier) {
                    frontier.unshift(child);
                    frontier.sort((a, b) => (heuristic(pathfinder.endCoords, a.state) + a.path_cost < heuristic(pathfinder.endCoords, b.state) + b.path_cost) ? -1 : 1);
                }
                else if (childInFrontier) {
                    let found = frontier.find(node => objectsAreEquivalent(node.state, child.state));
                    if ((found.path_cost + heuristic(pathfinder.endCoords, found.state) > child.path_cost + heuristic(pathfinder.endCoords, child.state))) {
                        found = child;
                    }
                }
            }
        })
    }

    return { solution: solution, explored: explored, frontier: frontier_history };
}