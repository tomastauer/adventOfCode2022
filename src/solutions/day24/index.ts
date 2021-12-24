import { range } from "../../utilities/number.ts";
import { Solution } from '../../utilities/solver.ts';

export default class Day24 implements Solution {
	solvePart1(input: string[]) {
		const result = this.getAllResults(input);

		return Number(result[result.length-1][0]);
	}

	solvePart2(input: string[]) {
		return Number(this.getAllResults(input)[0][0]);
	}

	private getAllResults(input: string[]) {
		const instructions: string[][] = this.splitInstructions(input);
		let result: [string, number][] = this.executeInstructions(0, instructions[0]);

		for(let i = 1; i < instructions.length; i++) {
			result = result.flatMap(([m,z]) => this.executeInstructions(z, instructions[i]).map(([a, b]) => ([`${m}${a}`, b]))) as [string, number][]
		}

		return result;
	}

	private getImportantInstructions( instructions: string[]) {
		return {
			mod: this.getValueFromInstruction(instructions[3]),
			div: this.getValueFromInstruction(instructions[4]),
			add: this.getValueFromInstruction(instructions[5]),
			add2: this.getValueFromInstruction(instructions[9]),
			add3: this.getValueFromInstruction(instructions[15])
		}
	}

	private getValueFromInstruction(instruction: string) {
		const [,,operandB] = instruction.split(' ');
		return Number(operandB);
	}

	private executeInstructions(z: number, instructions: string[]): [string, number][] {
		const important = this.getImportantInstructions(instructions);
		const x = (z % important.mod) + important.add;

		let digits = range(1,9);
		if(important.add < 0) {
			digits = digits.filter(d => d === x);
		}

		return digits.map(i => {
			let r = Math.trunc(z/important.div);
			if(x !== i) {
				r*=(important.add2 + 1)
				r+= i + important.add3
			}

			return [i.toString(), r];
		});
	}

	private splitInstructions(input: string[]) {
		return input.join('|').replaceAll(/inp w/g, ';inp w').split(';').filter(Boolean).map(p => p.split('|').filter(Boolean));
	}
}
