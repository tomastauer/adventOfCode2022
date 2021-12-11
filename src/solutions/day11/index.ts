import { Solution } from '../../utilities/solver.ts';
import { addBorder } from '../../utilities/array.ts';

export default class Day11 implements Solution {
	solvePart1(input: string[]) {
		const grid = addBorder(
			input.map((i) => i.split('').map((c) => parseInt(c))),
			10
		);
		let flashes = 0;
		for (let i = 0; i < 100; i++) {
			for (let y = 1; y < grid.length - 1; y++) {
				for (let x = 1; x < grid[y].length - 1; x++) {
					grid[y][x]++;
				}
			}

			const alreadyFlashed: [number, number][] = [];
			let flashing;
			while ((flashing = this.getFlashing(grid)).length) {
				flashing.filter(this.filterVisited(alreadyFlashed)).forEach(([y, x]) => {
					alreadyFlashed.push([y, x]);
					grid[y][x] = 0;
					flashes++;
					this.getAdjacentCoords([y, x])
						.filter(this.filterVisited(alreadyFlashed))
						.forEach(([ay, ax]) => {
							grid[ay][ax]++;
						});
				});
			}
		}

		return flashes;
	}

	solvePart2(input: string[]) {
		const grid = addBorder(
			input.map((i) => i.split('').map((c) => parseInt(c))),
			10
		);

		let i = 0;
		while (true) {
			for (let y = 1; y < grid.length - 1; y++) {
				for (let x = 1; x < grid[y].length - 1; x++) {
					grid[y][x]++;
				}
			}

			const alreadyFlashed: [number, number][] = [];
			let flashing;
			while ((flashing = this.getFlashing(grid)).length) {
				flashing.filter(this.filterVisited(alreadyFlashed)).forEach(([y, x]) => {
					alreadyFlashed.push([y, x]);
					grid[y][x] = 0;
					this.getAdjacentCoords([y, x])
						.filter(this.filterVisited(alreadyFlashed))
						.forEach(([ay, ax]) => {
							grid[ay][ax]++;
						});
				});
			}

			if (alreadyFlashed.length === 100) {
				return i + 1;
			}

			i++;
		}
	}

	private getAdjacentCoords([y, x]: [number, number]): [number, number][] {
		return [
			[y - 1, x - 1],
			[y - 1, x],
			[y - 1, x + 1],
			[y + 1, x - 1],
			[y + 1, x],
			[y + 1, x + 1],
			[y, x - 1],
			[y, x + 1]
		];
	}

	private filterVisited(visited: [number, number][]) {
		return ([fy, fx]: [number, number]) => {
			!visited.find(([vy, vx]) => vy === fy && vx === fx);
		};
	}

	private getFlashing(array: number[][]) {
		const flashing: [number, number][] = [];
		for (let y = 1; y < array.length - 1; y++) {
			for (let x = 1; x < array[y].length - 1; x++) {
				if (array[y][x] > 9) {
					flashing.push([y, x]);
				}
			}
		}
		return flashing;
	}
}
