export async function solve(day: number) {
	const folder = `solutions/day${('0' + day).slice(-2)}`;
	const input = (await Deno.readTextFile(`./src/${folder}/input.txt`)).split(
		'\n',
	);
	const solution = await getDefaultImport(`../${folder}/index.ts`);

	return [await solution.solvePart1(input), await solution.solvePart2(input)];
}

export interface Solution {
	solvePart1: (input: string[]) => Promise<string | number> | string | number;
	solvePart2: (input: string[]) => Promise<string | number> | string | number;
}

function getDefaultImport(path: string) {
	return new Promise<Solution>((resolve) => {
		import(path).then((m) => {
			resolve(new m.default());
		});
	});
}
