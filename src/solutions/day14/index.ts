import { Solution } from '../../utilities/solver.ts';

type Rec = Record<string, number>;

export default class Day14 implements Solution {
	solvePart1(input: string[]) {
		const { rules, letters } = this.parseInput(input);
		let { pairs } = this.parseInput(input);

		for (let i = 1; i <= 10; i++) {
			const newPairs: Rec = {};

			Object.entries(pairs).forEach(([pair, value]) => {
				const rule = rules[pair];
				letters[rule] = (letters[rule] ?? 0) + value;
				[pair[0] + rule, rule + pair[1]].forEach((newPair) => {
					newPairs[newPair] = (newPairs[newPair] ?? 0) + value;
				});
			});

			pairs = newPairs;
		}

		return Math.max(...Object.values(letters)) - Math.min(...Object.values(letters));
	}

	solvePart2(input: string[]) {
		const { rules, letters } = this.parseInput(input);
		let { pairs } = this.parseInput(input);

		for (let i = 1; i <= 40; i++) {
			const newPairs: Rec = {};

			Object.entries(pairs).forEach(([pair, value]) => {
				const rule = rules[pair];
				letters[rule] = (letters[rule] ?? 0) + value;
				[pair[0] + rule, rule + pair[1]].forEach((newPair) => {
					newPairs[newPair] = (newPairs[newPair] ?? 0) + value;
				});
			});

			pairs = newPairs;
		}

		return Math.max(...Object.values(letters)) - Math.min(...Object.values(letters));
	}

	private parseInput(input: string[]) {
		const [template, , ...rest] = input;

		return {
			rules: rest
				.map((a) => a.split(' -> '))
				.reduce((a, [from, to]) => ((a[from] = to), a), {} as Record<string, string>),
			pairs: template
				.split('')
				.reduce(
					(a, _, i, r) => (
						i === 0
							? a
							: (a[`${r[i - 1]}${r[i]}`] = (a[`${r[i - 1]}${r[i]}`] ?? 0) + 1),
						a
					),
					{} as Rec
				),
			letters: template.split('').reduce((a, c) => ((a[c] = (a[c] ?? 0) + 1), a), {} as Rec)
		};
	}
}
