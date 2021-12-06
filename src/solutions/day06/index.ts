import { Solution } from '../../utilities/solver.ts';

export default class Day06 implements Solution {
	solvePart1(input: string[]) {
		const fish: Record<number, number> = new Array(9).fill(0).reduce((acc, _, i) => ((acc[i] = 0), acc) ,{})

		input[0].split(',').map(c => parseInt(c)).forEach(c => {
			fish[c]++;
		});

		for(let i = 0; i < 80; i++) {
			const zero = fish[0];
			
			for(let j = 1; j<=8;j++) {
				if(fish[j]) {
					const tmp = fish[j];
					fish[j] = 0;
					fish[j-1] += tmp;
				}
			}

			if(zero) {
				fish[0] -= zero;
				fish[6] += zero;
				fish[8] += zero;
			}	
		}

		return Object.values(fish).reduce((a, b) => a+b, 0);
	}

	solvePart2(input: string[]) {
		const fish: Record<number, number> = new Array(9).fill(0).reduce((acc, _, i) => ((acc[i] = 0), acc) ,{})

		input[0].split(',').map(c => parseInt(c)).forEach(c => {
			fish[c]++;
		});

		for(let i = 0; i < 256; i++) {
			const zero = fish[0];
			
			for(let j = 1; j<=8;j++) {
				if(fish[j]) {
					const tmp = fish[j];
					fish[j] = 0;
					fish[j-1] += tmp;
				}
			}

			if(zero) {
				fish[0] -= zero;
				fish[6] += zero;
				fish[8] += zero;
			}	
		}

		return Object.values(fish).reduce((a, b) => a+b, 0);
	}
}
