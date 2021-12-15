import { addBorder } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day15 implements Solution {
	solvePart1(input: string[]) {
		const grid = addBorder(
			input.map((i) => i.split('').map((s) => parseInt(s))),
			100000
		);

		return this.getShortestPath(grid);
	}

	solvePart2(input: string[]) {
		const inputGrid = input.map((i) => i.split('').map((s) => parseInt(s)));
		let grid: number[][] = new Array(input.length * 5)
			.fill(0)
			.map(() => new Array(input[0].length * 5).fill(0));

		for (let gy = 0; gy < 5; gy++) {
			for (let gx = 0; gx < 5; gx++) {
				for (let y = 0; y < inputGrid.length; y++) {
					for (let x = 0; x < inputGrid[0].length; x++) {
						const newValue = inputGrid[y][x] + gy + gx;
						grid[inputGrid.length * gy + y][inputGrid[0].length * gx + x] =
							newValue > 9 ? newValue % 9 : newValue;
					}
				}
			}
		}

		grid = addBorder(grid, 100000);
		return this.getShortestPath(grid);
	}

	private getAdjacent([y, x]: [number, number]) {
		return [
			[y - 1, x],
			[y + 1, x],
			[y, x - 1],
			[y, x + 1]
		];
	}

	private getShortestPath(grid: number[][]) {
		const shortestPath = new Array(grid.length)
			.fill(100000)
			.map(() => new Array(grid[0].length).fill(100000));
		shortestPath[1][1] = 0;

		const queue: [number, number][] = [[1, 1]];

		while (queue.length) {
			const [y, x] = queue.shift()!;
			this.getAdjacent([y, x])
				.filter(([ay, ax]) => grid[ay][ax] < 100000)
				.forEach(([ay, ax]) => {
					const newShortestPath = shortestPath[y][x] + grid[ay][ax];
					if (shortestPath[ay][ax] > newShortestPath) {
						shortestPath[ay][ax] = newShortestPath;
						queue.push([ay, ax]);
					}
				});
		}

		return shortestPath[shortestPath.length - 2][shortestPath[0].length - 2];
	}
}
