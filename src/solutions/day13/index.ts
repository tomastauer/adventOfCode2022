import { Solution } from '../../utilities/solver.ts';

export default class Day13 implements Solution {
	solvePart1(input: string[]) {
		const [dots, folding] = this.parseInput(input);
		const grid = this.initGrid(dots);

		folding.forEach((f, i) => {
			if (i > 0) {
				return;
			}

			this.fold(grid, f);
		});

		return this.getNumberOfDots(grid);
	}

	solvePart2(input: string[]) {
		const [dots, folding] = this.parseInput(input);
		const grid = this.initGrid(dots);

		folding.forEach((f) => {
			this.fold(grid, f);
		});

		this.print(grid);
		return 0;
	}

	private parseInput(input: string[]) {
		return input
			.join('\n')
			.split('\n\n')
			.map((l, x) =>
				l.split('\n').map((f) => {
					if (x === 0) {
						return f.split(',').map((p) => parseInt(p));
					}

					const [axis, position] = f.substring(11).split('=');
					return {
						axis,
						position: parseInt(position)
					};
				})
			) as [[number, number][], { axis: string; position: number }[]];
	}

	private initGrid(dots: [number, number][]) {
		const maxX = Math.max(...dots.map(([x]) => x));
		const maxY = Math.max(...dots.map(([, y]) => y));

		const grid = new Array(maxY + 1).fill('.').map(() => new Array(maxX + 1).fill('.'));

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				grid[y][x] = dots.find(([dx, dy]) => dx === x && dy === y) ? '#' : '.';
			}
		}

		return grid;
	}

	private fold(grid: string[][], fold: { axis: string; position: number }) {
		if (fold.axis === 'y') {
			for (let y = fold.position + 1; y < grid.length; y++) {
				for (let x = 0; x < grid[y].length; x++) {
					if (grid[y][x] === '#') {
						grid[y][x] = '.';

						grid[fold.position - (y - fold.position)][x] = '#';
					}
				}
			}
		}

		if (fold.axis === 'x') {
			for (let y = 0; y < grid.length; y++) {
				for (let x = fold.position + 1; x < grid[y].length; x++) {
					if (grid[y][x] === '#') {
						grid[y][x] = '.';

						grid[y][fold.position - (x - fold.position)] = '#';
					}
				}
			}
		}
	}

	private getNumberOfDots(grid: string[][]) {
		return grid.flat().filter((d) => d === '#').length;
	}

	private print(grid: string[][]) {
		const result = [];
		for (let y = 0; y < Math.min(6, grid.length); y++) {
			const line = [];
			for (let x = 0; x < Math.min(40, grid[y].length); x++) {
				line.push(grid[y][x]);
			}
			result.push(line.join(''));
		}

		console.log(result.join('\n'));
	}
}
