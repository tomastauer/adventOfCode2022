import { addBorder } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day09 implements Solution {
	solvePart1(input: string[]) {
		const array = addBorder(
			input.map((i) => i.split('').map((c) => parseInt(c))),
			9
		);
		const mins: number[] = [];

		for (let y = 1; y < array.length - 1; y++) {
			for (let x = 1; x < array[y].length - 1; x++) {
				if (
					this.getAdjacent([y, x])
						.map(([ay, ax]) => array[ay][ax])
						.every((a) => a > array[y][x])
				) {
					mins.push(array[y][x]);
				}
			}
		}

		return mins.reduce((a, c) => a + c + 1, 0);
	}

	solvePart2(input: string[]) {
		const array = addBorder(
			input.map((i) => i.split('').map((c) => parseInt(c))),
			9
		);
		const mins: [number, number][] = [];

		for (let y = 1; y < array.length - 1; y++) {
			for (let x = 1; x < array[y].length - 1; x++) {
				if (
					this.getAdjacent([y, x])
						.map(([ay, ax]) => array[ay][ax])
						.every((a) => a > array[y][x])
				) {
					mins.push([y, x]);
				}
			}
		}

		const basins = mins.map((m) => this.flood(array, m)).sort((a, b) => b - a);

		return basins.slice(0, 3).reduce((a, c) => a * c, 1);
	}

	private flood(array: number[][], [y, x]: [number, number]): number {
		array[y][x] = 0;
		return this.getAdjacent([y, x])
			.map(([ay, ax]) => (this.canFlood(array[ay][ax]) ? this.flood(array, [ay, ax]) : 0))
			.reduce((a, b) => a + b, 1);
	}

	private getAdjacent([y, x]: [number, number]) {
		return [
			[y - 1, x],
			[y + 1, x],
			[y, x - 1],
			[y, x + 1]
		];
	}

	private canFlood(n: number) {
		return n !== 0 && n !== 9;
	}
}
