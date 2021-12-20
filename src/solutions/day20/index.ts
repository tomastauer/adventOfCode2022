import { addBorder, removeBorder } from "../../utilities/array.ts";
import { Solution } from '../../utilities/solver.ts';

export default class Day20 implements Solution {
	solvePart1(input: string[]) {
		const [key, , ...image] = input;
		const grid  = addBorder(image.map(i => i.split('')), '.', 100); 

		let g = grid;
			
		for(let i =0; i<2; i++) {
			g = this.iterate(g, key);
		}

		return this.count(removeBorder(g, 50));
	}

	solvePart2(input: string[]) {
		const [key, , ...image] = input;
		const grid  = addBorder(image.map(i => i.split('')), '.', 120); 

		let g = grid;

		for(let i =0; i<50; i++) {
			g = this.iterate(g, key);
		}
		
		return this.count(removeBorder(g, 120));
	}

	private iterate(grid: string[][], key: string) {
		const newGrid = new Array(grid.length).fill('.').map(() => new Array(grid[0].length).fill('.'));

		for(let y = 1; y < newGrid.length-1; y++) {
			for(let x = 1; x < newGrid[0].length-1; x++) {
				newGrid[y][x] = key[this.toDecimal(this.getSurrounding(grid, [y,x]))];
			}
		}

		return addBorder(newGrid, '.', 1);
	}

	private count(grid: string[][]) {
		return grid.reduce((a, c) => a+c.filter(d => d === '#').length, 0);
	}

	private getSurrounding(grid: string[][], [y,x]: [number,number]) {
		return [
			[y-1, x-1],
			[y-1, x],
			[y-1, x+1],
			[y, x-1],
			[y,x],
			[y,x+1],
			[y+1,x-1],
			[y+1, x],
			[y+1,x+1]
		].map(([py, px]) => grid[py][px]).join('');
	}

	private toDecimal(input: string) {
		return parseInt(input.replaceAll('.', '0').replaceAll('#', '1'), 2);
	}
}
