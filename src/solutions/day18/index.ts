import { Solution } from '../../utilities/solver.ts';

type Position = {
	x: number;
	y: number;
	z: number;
	s: string;
}

export default class Day18 implements Solution {
	solvePart1(input: string[]) {
		const space = new Array(25).fill(0).map(() => new Array(25).fill(0).map(() => new Array(25).fill(0)));

		input.forEach((i) => {
			const [x,y,z] = i.split(',').map(q => parseInt(q));
			space[x+1][y+1][z+1] = 1;
		});

		let surface = 0;

		for(let x = 0; x < space.length; x++) {
			for(let y = 0; y < space[x].length; y++) {
				for (let z = 0; z < space[x][y].length; z++) {
					if(space[x][y][z] === 1) {
						if(space[x-1][y][z] === 0) {
							surface++;
						}
						if(space[x+1][y][z] === 0) {
							surface++;
						}
						if(space[x][y-1][z] === 0) {
							surface++;
						}
						if(space[x][y+1][z] === 0) {
							surface++;
						}
						if(space[x][y][z-1] === 0) {
							surface++;
						}
						if(space[x][y][z+1] === 0) {
							surface++;
						}
					}
				}
			}
		}
		return surface;
	}

	solvePart2(input: string[]) {
		const space = new Array(23).fill(0).map(() => new Array(23).fill(0).map(() => new Array(23).fill(0)));

		input.forEach((i) => {
			const [x,y,z] = i.split(',').map(q => parseInt(q));
			space[x+1][y+1][z+1] = 1;
		});

		let surface = 0;


		const visited = this.traverse({ x: 0, y: 0, z: 0, s: '0,0,0'}, space);
		for(let x = 1; x < space.length-1; x++) {
			for(let y = 1; y < space[x].length-1; y++) {
				for (let z = 1; z < space[x][y].length-1; z++) {
					if(space[x][y][z] === 1) {
						let counter = 0;
						if(space[x-1][y][z] === 0 && visited.has(`${x-1},${y},${z}`)) {
							surface++;
						}
						if(space[x+1][y][z] === 0 && visited.has(`${x+1},${y},${z}`)) {
							surface++;
						}
						if(space[x][y-1][z] === 0 && visited.has(`${x},${y-1},${z}`)) {
							surface++;
						}
						if(space[x][y+1][z] === 0 && visited.has(`${x},${y+1},${z}`)) {
							surface++;
						}
						if(space[x][y][z-1] === 0 && visited.has(`${x},${y},${z-1}`)) {
							surface++;
						}
						if(space[x][y][z+1] === 0 && visited.has(`${x},${y},${z+1}`)) {
							surface++;
						}
					}
				}
			}
		}

		return surface;
	}

	traverse(current: Position, space: number[][][]) {
		const toVisit: Position[] = [current];
		const visited = new Set<string>();

		do {
			const p = toVisit.shift()!;
			visited.add(p.s);
			toVisit.push(...this.getNeighbors(p, space).filter(c => !visited.has(c.s) && !toVisit.find(f => f.s === c.s) && space[c.x][c.y][c.z] === 0));
		} while(toVisit.length);

		return visited;
	}

	getNeighbors({x,y,z}: Position, space: number[][][]) {
		const neighbors: Position[] = [];
		
		if(x !== 0) {
			neighbors.push({x: x-1, y,z, s:`${x-1},${y},${z}`});
		}

		if(x !== space.length-1) {
			neighbors.push({x: x+1, y,z, s:`${x+1},${y},${z}`});
		}

		if(y !== 0) {
			neighbors.push({x, y:y-1,z, s:`${x},${y-1},${z}`});
		}

		if(y !== space[0].length-1) {
			neighbors.push({x, y:y+1,z, s:`${x},${y+1},${z}`});
		}

		if(z !== 0) {
			neighbors.push({x, y, z: z-1, s:`${x},${y},${z-1}`});
		}

		if(z !== space[0][0].length-1) {
			neighbors.push({x, y,z:z+1, s:`${x},${y},${z+1}`});
		}
		
		
		return neighbors;
	}
}
