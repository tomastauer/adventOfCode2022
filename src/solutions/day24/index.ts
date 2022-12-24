import { Solution } from '../../utilities/solver.ts';

type Position = {
	x: number;
	y: number;
}

type State = {
	time: number;
	position: Position;
}

export default class Day24 implements Solution {
	solvePart1(input: string[]) {
		const map = input.map(i => i.split('').map(c => {
			if(c === '.') {
				return [];
			} else {
				return [c];
			}
		}));

		const start = {time: 0, position: {x: 1, y: 0}};
		const finish = {x:map[0].length-2,y:map.length-1};

		let newMap = map;

		const emptyPositions = [this.getEmptyPositions(map)];

		for(let i = 0; i < 1000; i++) {
			newMap = this.iterate(newMap);
			emptyPositions.push(this.getEmptyPositions(newMap));
		}

		return this.dfs(start, finish, emptyPositions);
	}

	solvePart2(input: string[]) {
		const map = input.map(i => i.split('').map(c => {
			if(c === '.') {
				return [];
			} else {
				return [c];
			}
		}));

		const start = {time: 0, position: {x: 1, y: 0}};
		const finish = {x:map[0].length-2,y:map.length-1};

		let newMap = map;

		const emptyPositions = [this.getEmptyPositions(map)];

		for(let i = 0; i < 1000; i++) {
			newMap = this.iterate(newMap);
			emptyPositions.push(this.getEmptyPositions(newMap));
		}

		const firstRun = this.dfs(start, finish, emptyPositions);
		const secondRun = this.dfs({time: firstRun, position: {x: finish.x, y: finish.y}}, {x: 1, y: 0}, emptyPositions);
		const thirdRun = this.dfs({time: secondRun, position: {x: start.position.x, y:start.position.y}}, finish, emptyPositions);
		
		return thirdRun;
	}

	dfs(start: State, finish: Position, emptyPositions: Position[][]) {
		const states: State[] = [start];
		const seen = new Set<string>();

		let shortestPath = Infinity;

		let state: State;
		while(states.length) {
			state = states.pop()!;
			const serialized = `${state.time},${state.position.x},${state.position.y}`;
			if(seen.has(serialized)) {
				continue;
			}

			seen.add(serialized);

			const e = emptyPositions[state.time + 1];

			if(!e) {
				continue;
			}

			if(state.time >= shortestPath) {
				continue;
			}
			
			if(state.position.x === finish.x && state.position.y === finish.y) {
				shortestPath = Math.min(state.time, shortestPath);
				continue;
			}

			if(e.find(({x, y}) => x === state.position.x - 1 && y === state.position.y)) {
				states.push({time: state.time + 1, position: {x: state.position.x - 1, y: state.position.y}});
			}

			if(e.find(({x, y}) => x === state.position.x + 1 && y === state.position.y)) {
				states.push({time: state.time + 1, position: {x: state.position.x + 1, y: state.position.y}});
			}

			if(e.find(({x, y}) => x === state.position.x && y === state.position.y - 1)) {
				states.push({time: state.time + 1, position: {x: state.position.x, y: state.position.y - 1}});
			}

			if(e.find(({x, y}) => x === state.position.x && y === state.position.y + 1)) {
				states.push({time: state.time + 1, position: {x: state.position.x, y: state.position.y + 1}});
			}

			if(e.find(({x, y}) => x === state.position.x && y === state.position.y)) {
				states.push({time: state.time + 1, position: {x: state.position.x, y: state.position.y}});
			}
		}

		return shortestPath;
	}

	iterate(map: string[][][]) {
		const newMap: string[][][] = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0).map(() => []));

		for(let y = 0; y < map.length; y++) {
			for(let x = 0; x < map[y].length; x++) {
				if(map[y][x][0] === '#') {
					newMap[y][x].push('#');
					continue;
				}

				map[y][x].forEach(c => {
					if(c === '>') {
						if(x === map[y].length - 2) {
							newMap[y][1].push('>')
						} else {
							newMap[y][x+1].push('>')
						}
					}

					if(c === '<') {
						if(x === 1) {
							newMap[y][map[y].length-2].push('<')
						} else {
							newMap[y][x-1].push('<')
						}
					}

					if(c === 'v') {
						if(y === map.length-2) {
							newMap[1][x].push('v')
						} else {
							newMap[y+1][x].push('v')
						}
					}

					if(c === '^') {
						if(y === 1) {
							newMap[map.length-2][x].push('^')
						} else {
							newMap[y-1][x].push('^')
						}
					}
				})
				
			}
		}

		return newMap;
	}

	getEmptyPositions(map: string[][][]) {
		const positions: Position[] = [];

		map.forEach((m, y) => {
			m.forEach((mm, x) => {
				if(!mm.length) {
					positions.push({x, y});
				}
			})
		});

		return positions;
	}
}
