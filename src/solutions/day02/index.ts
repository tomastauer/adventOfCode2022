import { Solution } from '../../utilities/solver.ts';


export default class Day01 implements Solution {
	
	// rock, paper, scissors

	result(them: 'A' | 'B' | 'C', me: 'A' | 'B' | 'C') {
		switch(them) {
			case 'A':
				return me === 'A' ? 3 : me === 'B' ? 6 : 0;
			case 'B':
				return me === 'A' ? 0 : me === 'B' ? 3 : 6;
			case 'C':
				return me === 'A' ? 6 : me === 'B' ? 0 : 3;
		}
	}

	solvePart1(input: string[]) {
		return input.reduce((acc, curr) => {
			const [them, me] = curr.split(' ');
			const mappedMe = me === 'X' ? 'A' : me === 'Y' ? 'B' : 'C';

			acc += this.result(them as 'A' | 'B' | 'C', mappedMe) + mappedMe.charCodeAt(0) - 64;

			return acc;
		}, 0)
	}

	solvePart2(input: string[]) {
		const map = {
			'A': { X: 'C', Y: 'A', Z: 'B' },
			'B': { X: 'A', Y: 'B', Z: 'C' },
			'C': { X: 'B', Y: 'C', Z: 'A' },
		}
	
		return input.reduce((acc, curr) => {
			const [them, me] = curr.split(' ');
			const mappedMe = map[them as 'A' | 'B' | 'C'][me as 'X' | 'Y' | 'Z'];

			acc += this.result(them as 'A' | 'B' | 'C', mappedMe as 'A' | 'B' | 'C') + mappedMe.charCodeAt(0) - 64;

			return acc;
		}, 0)
	}
}
