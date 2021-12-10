import { Solution } from '../../utilities/solver.ts';

const pairs = {
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>'
} as const;

type Opening = keyof typeof pairs;
type Closing = typeof pairs[Opening];

const points1 = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137
};

const points2 = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4
};

export default class Day10 implements Solution {
	solvePart1(input: string[]) {
		return input
			.map((i) => {
				const stack: Opening[] = [];

				for (const char of i.split('')) {
					if (this.isOpening(char)) {
						stack.push(char);
					} else {
						const last = stack.pop()!;
						if (pairs[last] !== char) {
							return char;
						}
					}
				}
				return '';
			})
			.filter((c): c is Closing => c !== '')
			.reduce((a, c) => a + (points1[c]), 0);
	}

	solvePart2(input: string[]) {
		const points = input
			.map((i) => {
				const stack: Opening[] = [];

				for (const char of i.split('')) {
					if (this.isOpening(char)) {
						stack.push(char);
					} else {
						const last = stack.pop()!;
						if (pairs[last] !== char) {
							return [];
						}
					}
				}
				return stack;
			})
			.filter((c) => c.length)
			.map((i) =>
				i
					.map((c) => pairs[c])
					.reverse()
					.reduce((a, c) => a * 5 + points2[c], 0)
			)
			.sort((a, b) => a - b);

		return points[Math.trunc(points.length / 2)];
	}

	private isOpening(char: string): char is Opening {
		return Object.keys(pairs).some((c) => c === char);
	}
}
