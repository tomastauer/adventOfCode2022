import { makePairs } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Parent = (Partial<N> & Pick<N, 'parent' | 'depth'>) | null;

type N = {
	left: number | N;
	right: number | N;
	toTheLeft: N | null;
	toTheRight: N | null;
	parent: Parent;
	depth: number;
};

export default class Day18 implements Solution {
	solvePart1(input: string[]) {
		return this.getMagnitude(
			input.reduce((agg, curr) =>
				this.stringifyAll(this.reduce(this.parseLine(`[${agg},${curr}]`).list))
			)
		);
	}

	solvePart2(input: string[]) {
		return Math.max(
			...makePairs(input).map((p) =>
				this.getMagnitude(
					p.reduce((agg, curr) =>
						this.stringifyAll(this.reduce(this.parseLine(`[${agg},${curr}]`).list))
					)
				)
			)
		);
	}

	private parseLine(input: string) {
		const list: N[] = [];
		const leaves: Partial<N>[] = [];
		const root = this.parseNumber(input, list, leaves);
		this.complete(leaves);

		const ordered = list.filter((l) => !leaves.includes(l));
		ordered.push(...(leaves as N[]));

		return {
			root,
			list: ordered
		};
	}

	private parseNumber(
		input: string,
		list: N[],
		leaves: Partial<N>[],
		parent: Parent = null,
		depth = 0
	): N {
		const inner = input.substring(1, input.length - 1);
		const endOfPart = this.findEndOfPart(inner);
		const leftPart = inner.substring(0, endOfPart);
		const rightPart = inner.substring(endOfPart + 1, inner.length);

		const soonToBeResult: Parent = {
			depth,
			parent
		};

		const isNumber = (l: unknown) => {
			return !Number.isNaN(Number(l));
		};

		if (isNumber(leftPart)) {
			leaves.push(soonToBeResult);
		}

		const left = isNumber(leftPart)
			? parseInt(leftPart)
			: this.parseNumber(leftPart, list, leaves, soonToBeResult, depth + 1);
		const right = isNumber(rightPart)
			? parseInt(rightPart)
			: this.parseNumber(rightPart, list, leaves, soonToBeResult, depth + 1);

		if (!isNumber(leftPart) && isNumber(rightPart)) {
			leaves.push(soonToBeResult);
		}

		soonToBeResult.left = left;
		soonToBeResult.right = right;

		const result = soonToBeResult as N;

		list.push(result);
		return result;
	}

	private complete(leaves: Partial<N>[]) {
		for (let i = 0; i < leaves.length; i++) {
			if (i > 0) {
				leaves[i].toTheLeft = leaves[i - 1] as N;
			}
			if (i < leaves.length - 1) {
				leaves[i].toTheRight = leaves[i + 1] as N;
			}
		}
	}

	private stringify(number: N): string {
		if (!number) {
			return '?';
		}
		return `[${
			Number.isInteger(number.left) ? number.left : this.stringify(number.left as N)
		},${Number.isInteger(number.right) ? number.right : this.stringify(number.right as N)}]`;
	}

	private stringifyAll(numbers: N[]) {
		return numbers.map((p) => this.stringify(p)).sort((a, b) => b.length - a.length)[0];
	}

	private reduce(numbers: N[]) {
		let list = numbers;

		while (list.some((n) => n.depth >= 4 || n.left >= 10 || n.right >= 10)) {
			list = this.explodeAll(list);
			list = this.splitAll(list);
		}

		return list;
	}

	private explodeAll(numbers: N[]) {
		let list = numbers;
		let toExplode = list.filter((n) => n.depth >= 4);
		while (toExplode.length) {
			list = this.explode(list, toExplode[0]);
			toExplode = list.filter((n) => n.depth >= 4);
		}

		return list;
	}

	private splitAll(numbers: N[]) {
		let list = numbers;
		let toSplit = list.filter((n) => n.left >= 10 || n.right >= 10);
		while (toSplit.length) {
			list = this.split(list, toSplit[0]);
			list = this.explodeAll(list);

			toSplit = list.filter((n) => n.left >= 10 || n.right >= 10);
		}

		return list;
	}

	private getMagnitude(number: string) {
		const pattern = /\[(\d+),(\d+)\]/g;
		let s = number;
		while (pattern.test(s)) {
			s = s.replaceAll(pattern, (match) => {
				const [a, b] = match
					.substring(1, match.length - 1)
					.split(',')
					.map(Number);
				return (a * 3 + b * 2).toString();
			});
		}

		return Number(s);
	}

	private split(numbers: N[], number: N) {
		if (number.left >= 10) {
			const result = {
				depth: number.depth + 1,
				parent: number,
				left: Math.floor((number.left as number) / 2),
				right: Math.ceil((number.left as number) / 2),
				toTheLeft: null,
				toTheRight: null
			};

			number.left = result;
			numbers.push(result);
		} else if (number.right >= 10) {
			const result = {
				depth: number.depth + 1,
				parent: number,
				left: Math.floor((number.right as number) / 2),
				right: Math.ceil((number.right as number) / 2),
				toTheLeft: null,
				toTheRight: null
			};

			number.right = result;
			numbers.push(result);
		}

		return this.parseLine(this.stringifyAll(numbers)).list;
	}

	private explode(numbers: N[], number: N) {
		const toTheLeft = number.toTheLeft;
		const toTheRight = number.toTheRight;
	
		if (toTheLeft) {
			if (Number.isInteger(toTheLeft.right)) {
				(toTheLeft.right as number) += number.left as number;
			} else {
				(toTheLeft.left as number) += number.left as number;
			}
		}

		if (toTheRight) {
			if (Number.isInteger(toTheRight.left)) {
				(toTheRight.left as number) += number.right as number;
			} else {
				(toTheRight.right as number) += number.right as number;
			}
		}

		this.removeNumber(numbers, number);

		return this.parseLine(this.stringifyAll(numbers)).list;
	}

	private removeNumber(numbers: N[], number: N) {
		const isLeft = number.parent?.left == number;

		if (isLeft) {
			number.parent!.left = 0;
		} else {
			number.parent!.right = 0;
		}

		numbers.splice(numbers.indexOf(number), 1);
	}

	private findEndOfPart(input: string) {
		let opened = 0;
		if (input[0] !== '[') {
			return input.includes(',') ? input.indexOf(',') : input.length;
		}

		for (let i = 0; i < input.length; i++) {
			if (input[i] === '[') {
				opened++;
			}
			if (opened === 0) {
				return i;
			}
			if (input[i] === ']') {
				opened--;
			}
		}

		return 1;
	}
}
