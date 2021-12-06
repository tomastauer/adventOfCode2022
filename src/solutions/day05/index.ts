import { Solution } from '../../utilities/solver.ts';

export default class Day05 implements Solution {
	solvePart1(input: string[]) {
		const coords = input
			.map((i) => i.split(' -> ').map((p) => p.split(',').map((z) => parseInt(z))))
			.map(([from, to]) => ({
				from,
				to,
				isStraight: from[0] === to[0] || from[1] === to[1]
			}));

		const max = Math.max(...coords.flatMap((c) => [...c.from, ...c.to])) + 1;
 		const grid: number[][] = new Array(max).fill(0).map(() => new Array(max).fill(0));

		coords.filter(c=>c.isStraight).forEach((c) => {
			for (let x = Math.min(c.from[0], c.to[0]); x <= Math.max(c.from[0], c.to[0]); x++) {
				for (let y = Math.min(c.from[1], c.to[1]); y <= Math.max(c.from[1], c.to[1]); y++) {
					grid[x][y]++;
				}
			}
		});

		return grid.flat().filter((f) => f >= 2).length;
	}

	solvePart2(input: string[]) {
		const coords = input
			.map((i) => i.split(' -> ').map((p) => p.split(',').map((z) => parseInt(z))))
			.map(([from, to]) => ({
				from,
				to,
				isStraight: from[0] === to[0] || from[1] === to[1]
			}));

		const max = Math.max(...coords.flatMap((c) => [...c.from, ...c.to])) + 1;

		const grid: number[][] = new Array(max).fill(0).map(() => new Array(max).fill(0));

		coords.filter(c=>c.isStraight).forEach((c) => {
			for (let x = Math.min(c.from[0], c.to[0]); x <= Math.max(c.from[0], c.to[0]); x++) {
				for (let y = Math.min(c.from[1], c.to[1]); y <= Math.max(c.from[1], c.to[1]); y++) {
					grid[x][y]++;
				}
			}
		});

		coords
			.filter((c) => !c.isStraight)
			.forEach((c) => {
				let x = c.from[0];
				let y = c.from[1];
				const incrementX = c.from[0] > c.to[0] ? -1 : 1;
				const incrementY = c.from[1] > c.to[1] ? -1 : 1;
			
				for (let z = 0; z < Math.abs(c.from[0] - c.to[0]) + 1; z++) {
					grid[x][y]++;
					y += incrementY;
					x += incrementX;
				}
			});

		return grid.flat().filter((f) => f >= 2).length;
	}
}
