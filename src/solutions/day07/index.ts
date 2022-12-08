import { Solution } from '../../utilities/solver.ts';

type Node = {
	parent: Node;
	children: Node[];
	name: string;
	type: 'file' | 'dir';
	size: number;
};

export default class Day01 implements Solution {
	getSize(node: Node): number {
		if (node.type === 'file') {
			return node.size;
		} else {
			node.size = node.children.reduce(
				(agg, curr) => agg + this.getSize(curr),
				0,
			);
			return node.size;
		}
	}

	solvePart1(input: string[]) {
		const commands = input.join('\n').split('$ ').map((c) => c.trim());
		commands.shift();

		const root: Node = {
			children: [],
			name: '/',
			type: 'dir',
			size: 0,
		} as unknown as Node;

		const dirs: Node[] = [root];

		root.parent = root;

		let currentNode = root;

		commands.forEach((command) => {
			if (command.startsWith('cd')) {
				const dest = command.split(' ')[1];
				if (dest === '/') {
					currentNode = root;
				} else if (dest === '..') {
					currentNode = currentNode.parent;
				} else {
					currentNode = currentNode.children.find((c) =>
						c.name === dest
					)!;
				}
			}

			if (command.startsWith('ls')) {
				const [, ...items] = command.split('\n');
				currentNode.children = items.map((i) => {
					const [typeOrSize, name] = i.split(' ');
					const item: Node = {
						children: [],
						name,
						parent: currentNode,
						type: typeOrSize === 'dir' ? 'dir' : 'file',
						size: typeOrSize === 'dir' ? 0 : parseInt(typeOrSize),
					};

					if (item.type === 'dir') {
						dirs.push(item);
					}

					return item;
				});
			}
		});

		this.getSize(root);

		return dirs.filter((d) => d.size < 100000).reduce(
			(agg, curr) => agg + curr.size,
			0,
		);
	}

	solvePart2(input: string[]) {
		const commands = input.join('\n').split('$ ').map((c) => c.trim());
		commands.shift();

		const root: Node = {
			children: [],
			name: '/',
			type: 'dir',
			size: 0,
		} as unknown as Node;

		const dirs: Node[] = [root];

		root.parent = root;

		let currentNode = root;

		commands.forEach((command) => {
			if (command.startsWith('cd')) {
				const dest = command.split(' ')[1];
				if (dest === '/') {
					currentNode = root;
				} else if (dest === '..') {
					currentNode = currentNode.parent;
				} else {
					currentNode = currentNode.children.find((c) =>
						c.name === dest
					)!;
				}
			}

			if (command.startsWith('ls')) {
				const [, ...items] = command.split('\n');
				currentNode.children = items.map((i) => {
					const [typeOrSize, name] = i.split(' ');
					const item: Node = {
						children: [],
						name,
						parent: currentNode,
						type: typeOrSize === 'dir' ? 'dir' : 'file',
						size: typeOrSize === 'dir' ? 0 : parseInt(typeOrSize),
					};

					if (item.type === 'dir') {
						dirs.push(item);
					}

					return item;
				});
			}
		});

		this.getSize(root);
		const neededSpace = 30000000 - (70000000 - root.size);

		return dirs.filter((d) => d.size > neededSpace).sort((a, b) =>
			a.size - b.size
		)[0].size;
	}
}
