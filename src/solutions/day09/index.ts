import { makeGrid } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day09 implements Solution {
	solvePart1(input: string[]) {
		const grid = makeGrid(1000, 1000);

		const headPos = { x: 500, y: 500 };
		const tailPos = { x: 500, y: 500 };

		const directions = input.reduce((agg, curr) => {
			const [dir, repeat] = curr.split(' ');
			agg.push(...dir.repeat(parseInt(repeat)));
			return agg;
		}, [] as string[]);

		grid[tailPos.y][tailPos.x]++;

		directions.forEach((direction) => {
			if (direction === 'R') {
				headPos.x++;
			}

			if (direction === 'L') {
				headPos.x--;
			}

			if (direction === 'U') {
				headPos.y--;
			}

			if (direction === 'D') {
				headPos.y++;
			}

			if (headPos.x - tailPos.x === 2) {
				tailPos.x++;
				tailPos.y = headPos.y;
				grid[tailPos.y][tailPos.x]++;
			}

			if (headPos.x - tailPos.x === -2) {
				tailPos.x--;
				tailPos.y = headPos.y;
				grid[tailPos.y][tailPos.x]++;
			}

			if (headPos.y - tailPos.y === 2) {
				tailPos.y++;
				tailPos.x = headPos.x;
				grid[tailPos.y][tailPos.x]++;
			}

			if (headPos.y - tailPos.y === -2) {
				tailPos.y--;
				tailPos.x = headPos.x;
				grid[tailPos.y][tailPos.x]++;
			}
		});

		return grid.reduce((agg, curr) => {
			agg += curr.reduce((rowAgg, cell) => {
				rowAgg += cell > 0 ? 1 : 0;
				return rowAgg;
			}, 0);
			return agg;
		}, 0);
	}

	solvePart2(input: string[]) {
		const grid = makeGrid(1000, 1000);

		const headPos = { x: 500, y: 500 };
		const tailPoss = new Array(9).fill(0).map(() => ({
			x: headPos.x,
			y: headPos.y,
		}));

		const directions = input.reduce((agg, curr) => {
			const [dir, repeat] = curr.split(' ');
			agg.push(...dir.repeat(parseInt(repeat)));
			return agg;
		}, [] as string[]);

		grid[tailPoss[8].y][tailPoss[8].x]++;

		directions.forEach((direction) => {
			if (direction === 'R') {
				headPos.x++;
			}

			if (direction === 'L') {
				headPos.x--;
			}

			if (direction === 'U') {
				headPos.y--;
			}

			if (direction === 'D') {
				headPos.y++;
			}

			tailPoss.forEach((tail, i, arr) => {
				const head = i === 0 ? headPos : arr[i - 1];

				if (head.x - tail.x === 2) {
					tail.x++;
					if (head.y - tail.y === 2) {
						tail.y++;
					} else if (head.y - tail.y === -2) {
						tail.y--;
					} else {
						tail.y = head.y;
					}
					if (i === 8) {
						grid[tail.y][tail.x]++;
					}
				}

				if (head.x - tail.x === -2) {
					tail.x--;
					if (head.y - tail.y === 2) {
						tail.y++;
					} else if (head.y - tail.y === -2) {
						tail.y--;
					} else {
						tail.y = head.y;
					}
					if (i === 8) {
						grid[tail.y][tail.x]++;
					}
				}

				if (head.y - tail.y === 2) {
					tail.y++;
					if (head.x - tail.x === 2) {
						tail.x++;
					} else if (head.x - tail.x === -2) {
						tail.x--;
					} else {
						tail.x = head.x;
					}
					if (i === 8) {
						grid[tail.y][tail.x]++;
					}
				}

				if (head.y - tail.y === -2) {
					tail.y--;
					if (head.x - tail.x === 2) {
						tail.x++;
					} else if (head.x - tail.x === -2) {
						tail.x--;
					} else {
						tail.x = head.x;
					}
					if (i === 8) {
						grid[tail.y][tail.x]++;
					}
				}
			});
		});

		return grid.reduce((agg, curr) => {
			agg += curr.reduce((rowAgg, cell) => {
				rowAgg += cell > 0 ? 1 : 0;
				return rowAgg;
			}, 0);
			return agg;
		}, 0);
	}
}
