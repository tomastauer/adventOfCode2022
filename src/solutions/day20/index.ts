import { Solution } from '../../utilities/solver.ts';

export default class Day20 implements Solution {
	solvePart1(input: string[]) {
		const file = input.map((i, x) => [x, parseInt(i)]);

		for (let i = 0; i < file.length; i++) {
			const index = file.findIndex((f) => f[0] === i);
			const item = file[index];
			const value = item[1];

			file.splice(index, 1);
			file.splice((index + value + file.length) % file.length, 0, item);
		}

		const indexOfZero = file.findIndex((f) => f[1] === 0);
		return file[(indexOfZero + 1000) % file.length][1] +
			file[(indexOfZero + 2000) % file.length][1] +
			file[(indexOfZero + 3000) % file.length][1];
	}

	solvePart2(input: string[]) {
		const file = input.map((i, x) => [x, parseInt(i) * 811589153]);

		for (let m = 0; m < 10; m++) {
			for (let i = 0; i < file.length; i++) {
				const index = file.findIndex((f) => f[0] === i);
				const item = file[index];
				const value = item[1];

				file.splice(index, 1);
				file.splice(
					(index + value + file.length) % file.length,
					0,
					item,
				);
			}
		}

		const indexOfZero = file.findIndex((f) => f[1] === 0);
		return file[(indexOfZero + 1000) % file.length][1] +
			file[(indexOfZero + 2000) % file.length][1] +
			file[(indexOfZero + 3000) % file.length][1];
	}
}
