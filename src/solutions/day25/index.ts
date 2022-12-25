import { Solution } from '../../utilities/solver.ts';

export default class Day25 implements Solution {
	solvePart1(input: string[]) {
		return this.toSnafu(
			input.map((i) => this.fromSnafu(i)).reduce((agg, curr) =>
				agg + curr
			),
		);
	}

	solvePart2(input: string[]) {
		return 0;
	}

	fromSnafu(n: string) {
		const mapping = {
			'=': -2,
			'-': -1,
			'0': 0,
			'1': 1,
			'2': 2,
		};

		return n.split('').reduce((agg, curr, idx, arr) => {
			const e = Math.pow(5, arr.length - 1 - idx);

			return agg + e * mapping[curr as keyof typeof mapping];
		}, 0);
	}

	toSnafu(num: number) {
		const mapping = {
			'-2': '=',
			'-1': '-',
			'0': '0',
			'-0': '0',
			'1': '1',
			'2': '2',
		};

		const snafu = [];
		let n = num;
		let carry = 0;
		while (n > 0) {
			const d = Math.floor(n / 5);
			const r = n - d * 5;

			console.log(n, d, r);
			if (r + carry >= 3) {
				snafu.push(r + carry - 5);
				carry = 1;
			} else {
				snafu.push(r + carry);
				carry = 0;
			}
			n = d;
		}

		if (carry) {
			snafu.push(carry);
		}

		return snafu.reverse().map((s) =>
			mapping[s.toString() as keyof typeof mapping]
		).join('');
	}
}
