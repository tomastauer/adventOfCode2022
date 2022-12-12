import { Solution } from '../../utilities/solver.ts';

export default class Day12 implements Solution {
	positions: {x: number, y: number}[] = [];
	
	solvePart1(input: string[]) {
		let start = { x: 0, y: 0}
		let end = { x: 0, y : 0}

		const grid = input.map((r, y) => r.split('').map((c, x) => {
			if(c === 'S') {
				start = { x, y };
				return [1, 0];
			} else if (c === 'E') {
				end = { x, y };
				return [26, -1];
			} else {
				return [c.charCodeAt(0) - 96, -1];
			}
		})) as [number, number][][];

		this.positions.push(start);

		for(let i = 0; i < this.positions.length; i++) {
			const current = this.positions[i];
			this.traverse(current, grid);
		}


	
		return grid[end.y][end.x][1];
	}

	traverse(position: {x: number, y: number}, grid: [number, number][][]) {
		
		const leftPosition = { x: position.x - 1, y: position.y};
		const rightPosition = { x: position.x + 1, y: position.y};
		const upPosition = { x: position.x, y: position.y - 1};
		const downPosition = { x: position.x, y: position.y + 1};
		
		const current = grid[position.y][position.x];
		const left = grid[leftPosition.y][leftPosition.x];
		const right = grid[rightPosition.y][rightPosition.x];
		const down = grid[downPosition.y]?.[downPosition.x];
		const up = grid[upPosition.y]?.[upPosition.x];

		if(left && left[1] === -1 && left[0] - current[0] <=1) {
			left[1] = current[1] + 1;
			this.positions.push(leftPosition);
		}
		
		if(right && right[1] === -1 && right[0] - current[0] <=1) {
			right[1] = current[1] + 1;
			this.positions.push(rightPosition);
		}

		if(down && down[1] === -1 && down[0] - current[0] <=1) {
			down[1] = current[1] + 1;
			this.positions.push(downPosition);
		}

		if(up && up[1] === -1 && up[0] - current[0] <=1) {
			up[1] = current[1] + 1;
			this.positions.push(upPosition);
		}
	}

	solvePart2(input: string[]) {
		let end = { x: 0, y : 0}

		const starts: {x: number, y: number}[] = [];

		input.forEach((r, y) => r.split('').forEach((c, x) => {
			if(c === 'S' || c === 'a') {
				starts.push({x,y});
			} 
		}));

		const results = starts.map(s => {
			const grid = input.map((r, y) => r.split('').map((c, x) => {
				if(c === 'S') {
					return [1, -1];
				} else if (c === 'E') {
					end = { x, y };
					return [26, -1];
				} else {
					return [c.charCodeAt(0) - 96, -1];
				}
			})) as [number, number][][];

			grid[s.y][s.x][1] = 0;

			this.positions = [];
			this.positions.push(s);

			for(let i = 0; i < this.positions.length; i++) {
				const current = this.positions[i];
				this.traverse(current, grid);
			}

			return grid[end.y][end.x][1];
		})

	
		return Math.min(...results.filter(r => r>0));
	}
}
