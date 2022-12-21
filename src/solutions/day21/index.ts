import { Solution } from '../../utilities/solver.ts';

type YellingMonkey = {
	type: 'yelling';
	name: string;
	value: number;
};

type WaitingMonkey = {
	type: 'waiting';
	name: string;
	op: '+' | '-' | '/' | '*';
	m1: string;
	m2: string;
	value: number | null;
};

type Monkey = YellingMonkey | WaitingMonkey;

export default class Day21 implements Solution {
	regexp =
		/(?<name>\w+): (((?<monkey1>\w+) (?<op>[+\-*\/]) (?<monkey2>\w+))|(?<value>\d+))/gm;

	solvePart1(input: string[]) {
		const monkeys: Monkey[] = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			if (groups['op']) {
				return {
					type: 'waiting',
					name: groups['name'],
					op: groups['op'] as '+' | '-' | '/' | '*',
					m1: groups['monkey1'],
					m2: groups['monkey2'],
					value: null,
				};
			} else {
				return {
					type: 'yelling',
					name: groups['name'],
					value: parseInt(groups['value']),
				};
			}
		});

		const toProcess = new Map<string, WaitingMonkey>(
			monkeys.filter((m): m is WaitingMonkey => m.type === 'waiting').map(
				(m) => [m.name, m],
			),
		);
		const processed = new Map(
			monkeys.filter((m) => m.type === 'yelling').map((m) => [m.name, m]),
		);

		while (toProcess.size > 0) {
			toProcess.forEach((monkey, _, map) => {
				const m1 = processed.get(monkey.m1);
				const m2 = processed.get(monkey.m2);
				if (m1 && m2) {
					monkey.value = this.math(monkey.op, m1.value!, m2.value!);
					processed.set(monkey.name, monkey);
					map.delete(monkey.name);
				}
			});
		}

		return processed.get('root')?.value ?? 0;
	}

	math(op: '+' | '-' | '/' | '*', value1: number, value2: number) {
		switch (op) {
			case '+':
				return value1 + value2;
			case '-':
				return value1 - value2;
			case '/':
				return value1 / value2;
			case '*':
				return value1 * value2;
			default:
				throw new Error();
		}
	}

	solvePart2(input: string[]) {
		const monkeys: Monkey[] = input.map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;

			if (groups['op']) {
				return {
					type: 'waiting',
					name: groups['name'],
					op: groups['op'] as '+' | '-' | '/' | '*',
					m1: groups['monkey1'],
					m2: groups['monkey2'],
					value: null,
				};
			} else {
				return {
					type: 'yelling',
					name: groups['name'],
					value: parseInt(groups['value']),
				};
			}
		});

		const orig = monkeys.find((m) => m.name === 'humn')?.value!;

		let diff = this.compute(monkeys, orig);

		let low = Number.MAX_SAFE_INTEGER;
		let high = Number.MIN_SAFE_INTEGER;

		while (diff != 0) {
			const current = Math.floor((high + low) / 2);
			diff = this.compute(monkeys, current);

			if (diff > 0) {
				high = current;
			} else if (diff < 0) {
				low = current;
			} else {
				return current;
			}
		}

		return 0;
	}

	compute(monkeys: Monkey[], humn: number) {
		const toProcess = new Map<string, WaitingMonkey>(
			monkeys.filter((m): m is WaitingMonkey => m.type === 'waiting').map(
				(m) => [m.name, m],
			),
		);
		const processed = new Map(
			monkeys.filter((m) => m.type === 'yelling').map((m) => [m.name, m]),
		);

		processed.get('humn')!.value! = humn;
		const rootMonkey = toProcess.get('root') as WaitingMonkey;
		const leftMonkey = rootMonkey.m1;
		const rightMonkey = rootMonkey.m2;

		while (toProcess.size > 0) {
			toProcess.forEach((monkey, _, map) => {
				const m1 = processed.get(monkey.m1);
				const m2 = processed.get(monkey.m2);
				if (m1 && m2) {
					const copy = {
						...monkey,
						value: this.math(monkey.op, m1.value!, m2.value!),
					};
					processed.set(monkey.name, copy);
					map.delete(monkey.name);
				}
			});
		}

		return processed.get(leftMonkey)?.value! -
			processed.get(rightMonkey)?.value!;
	}
}
