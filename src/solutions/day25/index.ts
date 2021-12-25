import { Solution } from '../../utilities/solver.ts';

type Cucumber = {
	x: number;
	y: number;
	direction: '>' | 'v';
};

export default class Day25 implements Solution {
	solvePart1(input: string[]) {
		const map = this.parse(input);
		const cucumbers = this.getCucumbers(map);

		let canMove = true;
		let iterations = 0;
		while (canMove) {
			const toTheEast = this.filterEast(map, cucumbers);
			this.moveEast(map, toTheEast);

			const toTheSouth = this.filterSouth(map, cucumbers);
			this.moveSouth(map, toTheSouth);

			canMove = toTheEast.length + toTheSouth.length > 0;
			iterations++;
		}

		return iterations;
	}

	solvePart2() {
		return 0;
	}

	private print(map: string[][]) {
		console.log(map.map((i) => i.join('')).join('\n'));
	}

	private parse(input: string[]) {
		return input.map((i) => i.split(''));
	}

	private getCucumbers(input: string[][]) {
		return input.flatMap((i, y) =>
			i
				.map((j, x) =>
					j === '.'
						? null
						: {
								x,
								y,
								direction: j as Cucumber['direction']
						  }
				)
				.filter(Boolean)
		) as Cucumber[];
	}

	private getEastX(input: string[][], x: number) {
		return x === input[0].length - 1 ? 0 : x + 1;
	}

	private getSouthY(input: string[][], y: number) {
		return y === input.length - 1 ? 0 : y + 1;
	}

	private filterEast(input: string[][], herd: Cucumber[]) {
		return herd.filter(
			({ y, x, direction }) => direction === '>' && input[y][this.getEastX(input, x)] === '.'
		);
	}

	private filterSouth(input: string[][], herd: Cucumber[]) {
		return herd.filter(
			({ y, x, direction }) => direction === 'v' &&  input[this.getSouthY(input, y)][x] === '.'
		);
	}

	private moveEast(input: string[][], herd: Cucumber[]) {
		herd.forEach((cucumber) => {
			input[cucumber.y][cucumber.x] = '.';
			cucumber.x = this.getEastX(input, cucumber.x);
			input[cucumber.y][cucumber.x] = '>';
		});
	}

	private moveSouth(input: string[][], herd: Cucumber[]) {
		herd.forEach((cucumber) => {
			input[cucumber.y][cucumber.x] = '.';
			cucumber.y = this.getSouthY(input, cucumber.y);
			input[cucumber.y][cucumber.x] = 'v';
		});
	}
}
