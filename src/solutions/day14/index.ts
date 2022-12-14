import { Solution } from '../../utilities/solver.ts';

export default class Day14 implements Solution {
	solvePart1(input: string[]) {
		const cave = new Array(1000).fill('.').map((_) =>
			new Array(1000).fill('.')
		);

		input.forEach((i) => {
			const coords = i
				.split(' -> ')
				.map((c) => c.split(',').map((d) => parseInt(d)));

			for (let i = 1; i < coords.length; i++) {
				for (
					let y = Math.min(coords[i - 1][1], coords[i][1]);
					y <= Math.max(coords[i - 1][1], coords[i][1]);
					y++
				) {
					cave[y][coords[i][0]] = '#';
				}

				for (
					let x = Math.min(coords[i - 1][0], coords[i][0]);
					x <= Math.max(coords[i - 1][0], coords[i][0]);
					x++
				) {
					cave[coords[i][1]][x] = '#';
				}
			}
		});

		const source = [0, 500];

		while (true) {
			const r = this.fall({ x: source[1], y: source[0] }, cave);
			if (r === 'end') {
				break;
			}
		}

		return cave.reduce(
			(agg, curr) =>
				curr.reduce(
					(agg2, curr2) => agg2 + (curr2 === 'o' ? 1 : 0),
					agg,
				),
			0,
		);
	}

	fall(
		{ x, y }: { x: number; y: number },
		cave: string[][],
	): 'end' | undefined {
		if (y === 999 || x === 0 || x === 999 || cave[y][x] === 'o') {
			return 'end';
		}

		if (cave[y + 1][x] === '.') {
			return this.fall({ x, y: y + 1 }, cave);
		} else if (cave[y + 1][x - 1] === '.') {
			return this.fall({ x: x - 1, y: y + 1 }, cave);
		} else if (cave[y + 1][x + 1] === '.') {
			return this.fall({ x: x + 1, y: y + 1 }, cave);
		} else {
			cave[y][x] = 'o';
		}
	}

	solvePart2(input: string[]) {
		const cave = new Array(1000).fill('.').map((_) =>
			new Array(1000).fill('.')
		);

		let maxY = 0;
		input.forEach((i) => {
			const coords = i
				.split(' -> ')
				.map((c) => c.split(',').map((d) => parseInt(d)));

			for (let i = 1; i < coords.length; i++) {
				for (
					let y = Math.min(coords[i - 1][1], coords[i][1]);
					y <= Math.max(coords[i - 1][1], coords[i][1]);
					y++
				) {
					maxY = Math.max(maxY, y);
					cave[y][coords[i][0]] = '#';
				}

				for (
					let x = Math.min(coords[i - 1][0], coords[i][0]);
					x <= Math.max(coords[i - 1][0], coords[i][0]);
					x++
				) {
					cave[coords[i][1]][x] = '#';
				}
			}
		});

		for (let i = 0; i < 1000; i++) {
			cave[maxY + 2][i] = '#';
		}

		const source = [0, 500];

		while (true) {
			const r = this.fall({ x: source[1], y: source[0] }, cave);
			if (r === 'end') {
				break;
			}
		}

		return cave.reduce(
			(agg, curr) =>
				curr.reduce(
					(agg2, curr2) => agg2 + (curr2 === 'o' ? 1 : 0),
					agg,
				),
			0,
		);
	}
}
