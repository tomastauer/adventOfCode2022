import { Solution } from '../../utilities/solver.ts';

export default class Day11 implements Solution {
	private regexp =
		/Monkey (?<monkey>\d+):\n\s+Starting items: (?<items>[\d, ]+)\n\s+Operation: new = (?<operation>[\d\w +*\/-]+)\n\s+Test: divisible by (?<test>\d+)\n\s+If true: throw to monkey (?<true>\d+)\n\s+If false: throw to monkey (?<false>\d+)/gm;

	solvePart1(input: string[]) {
		const monkeys = input.join('\n').split('\n\n').map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;
			return {
				monkey: parseInt(groups['monkey']),
				items: groups['items'].split(', ').map((c) => parseInt(c)),
				// deno-lint-ignore no-unused-vars
				operation: function (old: number) {
					return eval(groups['operation']);
				},
				test: parseInt(groups['test']),
				true: parseInt(groups['true']),
				false: parseInt(groups['false']),
				counter: 0,
			};
		});

		for (let i = 0; i < 20; i++) {
			monkeys.forEach((m) => {
				let item = m.items.shift();
				while (item) {
					m.counter++;
					const newLevel = Math.floor(m.operation(item) / 3);
					if (newLevel % m.test === 0) {
						monkeys[m.true].items.push(newLevel);
					} else {
						monkeys[m.false].items.push(newLevel);
					}
					item = m.items.shift();
				}
			});
		}

		const sorted = monkeys.map((m) => m.counter).sort((a, b) => b - a);
		return sorted[0] * sorted[1];
	}

	solvePart2(input: string[]) {
		const monkeys = input.join('\n').split('\n\n').map((i) => {
			const groups = Array.from(i.trim().matchAll(this.regexp))[0]
				.groups!;
			return {
				monkey: parseInt(groups['monkey']),
				items: groups['items'].split(', ').map((c) => parseInt(c)),
				// deno-lint-ignore no-unused-vars
				operation: function (old: number) {
					return eval(groups['operation']);
				},
				test: parseInt(groups['test']),
				true: parseInt(groups['true']),
				false: parseInt(groups['false']),
				counter: 0,
			};
		});

		const d = monkeys.map((m) => m.test).reduce(
			(agg, curr) => agg * curr,
			1,
		);

		for (let i = 0; i < 10000; i++) {
			monkeys.forEach((m) => {
				let item = m.items.shift();
				while (item) {
					m.counter++;
					const newLevel = Math.floor(m.operation(item) % d);
					if (newLevel % m.test === 0) {
						monkeys[m.true].items.push(newLevel);
					} else {
						monkeys[m.false].items.push(newLevel);
					}
					item = m.items.shift();
				}
			});
		}
		const sorted = monkeys.map((m) => m.counter).sort((a, b) => b - a);
		return sorted[0] * sorted[1];
	}
}
