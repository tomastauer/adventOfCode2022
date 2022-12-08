import { Solution } from '../../utilities/solver.ts';

export default class Day08 implements Solution {
	solvePart1(input: string[]) {
		const grid = input.map((i) => i.split('').map((j) => parseInt(j)));
		const height = grid.length;
		const width = grid[0].length;

		const visibilityGrid = new Array(height).fill(0).map(() =>
			new Array(width).fill(0)
		);

		for (let i = 0; i < height; i++) {
			let currentHigh = -1;
			for (let j = 0; j < width; j++) {
				if (grid[i][j] > currentHigh) {
					currentHigh = grid[i][j];
					visibilityGrid[i][j] = 1;
				}

				if (currentHigh === 9) {
					break;
				}
			}

			currentHigh = -1;
			for (let j = width - 1; j >= 0; j--) {
				if (grid[i][j] > currentHigh) {
					currentHigh = grid[i][j];
					visibilityGrid[i][j] = 1;
				}

				if (currentHigh === 9) {
					break;
				}
			}
		}

		for (let i = 0; i < width; i++) {
			let currentHigh = -1;
			for (let j = 0; j < height; j++) {
				if (grid[j][i] > currentHigh) {
					currentHigh = grid[j][i];
					visibilityGrid[j][i] = 1;
				}

				if (currentHigh === 9) {
					break;
				}
			}

			currentHigh = -1;
			for (let j = height - 1; j >= 0; j--) {
				if (grid[j][i] > currentHigh) {
					currentHigh = grid[j][i];
					visibilityGrid[j][i] = 1;
				}

				if (currentHigh === 9) {
					break;
				}
			}
		}

		return visibilityGrid.reduce(
			(agg, curr) => agg + curr.reduce((agg2, curr2) => agg2 + curr2, 0),
			0,
		);
	}

	solvePart2(input: string[]) {
		const grid = input.map((i) => i.split('').map((j) => parseInt(j)));
		const height = grid.length;
		const width = grid[0].length;

		const scenicGrid = new Array(height).fill(0).map(() =>
			new Array(width).fill(0)
		);

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				let agg = 1;

				let multiplicator = 0;
				for (let lj = j - 1; lj >= 0; lj--) {
					if (grid[i][lj] < grid[i][j]) {
						multiplicator++;
					}

					if (grid[i][lj] >= grid[i][j]) {
						multiplicator = Math.max(multiplicator + 1, 1);
						break;
					}
				}
				agg *= multiplicator;

				multiplicator = 0;
				for (let rj = j + 1; rj < width; rj++) {
					if (grid[i][rj] < grid[i][j]) {
						multiplicator++;
					}

					if (grid[i][rj] >= grid[i][j]) {
						multiplicator = Math.max(multiplicator + 1, 1);
						break;
					}
				}
				agg *= multiplicator;
				multiplicator = 0;

				for (let ui = i - 1; ui >= 0; ui--) {
					if (grid[ui][j] < grid[i][j]) {
						multiplicator++;
					}

					if (grid[ui][j] >= grid[i][j]) {
						multiplicator = Math.max(multiplicator + 1, 1);
						break;
					}
				}
				agg *= multiplicator;
				multiplicator = 0;

				for (let di = i + 1; di < height; di++) {
					if (grid[di][j] < grid[i][j]) {
						multiplicator++;
					}

					if (grid[di][j] >= grid[i][j]) {
						multiplicator = Math.max(multiplicator + 1, 1);
						break;
					}
				}
				agg *= multiplicator;

				scenicGrid[i][j] = agg;
			}
		}

		return scenicGrid.reduce(
			(agg, curr) =>
				Math.max(
					agg,
					curr.reduce((agg2, curr2) => Math.max(agg2, curr2)),
					0,
				),
			0,
		);
	}
}
