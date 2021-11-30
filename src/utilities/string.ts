export function replaceAt(input: string, index: number, replacement: string) {
	return input.substr(0, index) + replacement +
		input.substr(index + replacement.length);
}
