import { Solution } from '../../utilities/solver.ts';

type Bingo = { n: number; drawn: boolean }[];

export default class Day04 implements Solution {
	solvePart1(input: string[]) {
		const [numbers, ...boards] = input.join('\n').split('\n\n');
		const bingos = boards.map((b) =>
			b
				.split('\n')
				.join(' ').trim()
				.replaceAll(/\s+/g, ' ')
				.split(' ')
				.map((n) => ({ n: parseInt(n), drawn: false }))
		);

		return this.play1(numbers.split(',').map((n) => parseInt(n)), bingos);
	}

	solvePart2(input: string[]) {
		const [numbers, ...boards] = input.join('\n').split('\n\n');
		const bingos = boards.map((b) =>
			b
				.split('\n')
				.join(' ')
				.replaceAll(/\s+/g, ' ').trim()
				.split(' ')
				.map((n) => ({ n: parseInt(n), drawn: false }))
		);

		return this.play2(numbers.split(',').map((n) => parseInt(n)), bingos);
	}

	private play1(numbers: number[], bingos: Bingo[]) {
		for (const n of numbers) {
			for (const bingo of bingos) {
				this.draw(bingo, n);

				if (this.isBingoWinning(bingo)) {
					return this.sumNotDrawnNumbers(bingo) * n;
				}
			}
		}

		return 0;
	}

	private play2(numbers: number[], bingos: Bingo[]) {
		for (const n of numbers) {
			for (const bingo of bingos) {
				this.draw(bingo, n);

				if (
					bingos.every((b2) => this.isBingoWinning(b2))
				) {
					return this.sumNotDrawnNumbers(bingo) * n;
				}
			}
		}

		return 0;
	}

	private isBingoWinning(bingo: { n: number; drawn: boolean }[]) {
		const subsets = (start: number, increment: 1 | 5) => new Array(5).fill(0).map((_, i) => start + i * increment).map(i=>bingo[i]);

		return [
			subsets(0, 1),
			subsets(5, 1),
			subsets(10, 1),
			subsets(15, 1),
			subsets(20, 1),
			subsets(0, 5),
			subsets(1, 5),
			subsets(2, 5),
			subsets(3, 5),
			subsets(4, 5),	
		].some((c) => c.every((d) => d.drawn));
	}

	private draw(bingo: { n: number; drawn: boolean }[], n: number) {
		const f = bingo.find((b) => b.n === n);
		if (f) {
			f.drawn = true;
		}
	}

	private sumNotDrawnNumbers(bingo: { n: number; drawn: boolean }[]) {
		return bingo.filter((b) => !b.drawn).reduce((a, c) => a + c.n, 0);
	}
}
