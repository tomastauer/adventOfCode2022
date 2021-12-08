import { Solution } from '../../utilities/solver.ts';

export default class Day08 implements Solution {
	solvePart1(input: string[]) {
		return input.map(i => i.split(' | ')).map(c=>c[1]).flatMap(c => c.split(' ')).filter(c => [2,3,4,7].includes(c.length)).length
	}

	solvePart2(input: string[]) {
		return input.map((i,x) => {
			const [key, code] = i.split(' | ').map(c => c.split(' '));

			const one = this.pickNumber(key, k => k.length === 2);
			const seven = this.pickNumber(key, k => k.length === 3);
			const four = this.pickNumber(key, k => k.length === 4);
			const eight = this.pickNumber(key, k => k.length === 7);
			const three = this.pickNumber(key, k => k.length === 5 && this.subset(k, one));
			const nine = this.pickNumber(key, k => k.length === 6 && this.subset(k, four));
			const five = this.pickNumber(key, k => this.subset(nine, k));
			const six = this.pickNumber(key, k => this.subset(k, five));
			const zero = this.pickNumber(key, k => k.length === 6);
			const two = this.pickNumber(key, _ => true);

			const map = {
				[zero]: 0,
				[one]: 1,
				[two]: 2,
				[three]: 3,
				[four]: 4,
				[five]: 5,
				[six]: 6,
				[seven]: 7,
				[eight]: 8,
				[nine]: 9
			};

			return parseInt(code.map(c => this.sortString(c)).map(c => map[c]!).join(''));
		}).reduce((a, c) => a+c, 0);
	}

	private pickNumber(key: string[], predicate: (k: string) => boolean) {
		const number = key.find(predicate)!;
		key.splice(key.indexOf(number)!, 1);

		return this.sortString(number);
	}

	private sortString(s: string) {
		return s.split('').sort((a, b) => a.localeCompare(b)).join('')
	}

	private subset(s1: string, s2: string) {
		return s2.split('').every(c => s1.includes(c));
	}
}
