import { Solution } from '../../utilities/solver.ts';

type Packet = number | Packet[];

export default class Day12 implements Solution {
	solvePart1(input: string[]) {
		const pairs = input.join('\n').split('\n\n').map((d) => {
			const [left, right] = d.split('\n');
			return {
				left: JSON.parse(left),
				right: JSON.parse(right),
			};
		});

		return pairs.map((p) => this.compare(p.left, p.right)).reduce(
			(agg, curr, idx) => agg + (curr ? (idx + 1) : 0),
			0,
		);
	}

	compare(left: Packet[], right: Packet[]): boolean | undefined {
		for (let i = 0; i < Math.max(left.length, right.length); i++) {
			if (right[i] === undefined) {
				return false;
			}

			if (left[i] === undefined) {
				return true;
			}

			if (Number.isInteger(left[i]) && Number.isInteger(right[i])) {
				if (left[i] < right[i]) {
					return true;
				}

				if (left[i] > right[i]) {
					return false;
				}

				continue;
			}

			const result = this.compare([left[i]].flat(), [right[i]].flat());
			if (result !== undefined) {
				return result;
			}
		}
	}

	solvePart2(input: string[]) {
		const rows = [
			...input.filter(Boolean).map((c) => JSON.parse(c)),
			[[2]],
			[[6]],
		].sort((b, a) => this.compare(a, b) ? 1 : -1).map((r) =>
			JSON.stringify(r)
		);

		return (rows.indexOf('[[2]]') + 1) * (rows.indexOf('[[6]]') + 1);
	}
}
