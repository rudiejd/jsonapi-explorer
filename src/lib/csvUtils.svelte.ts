export function objectsToCsvString(objs: Object[]) {
	let rows = [];

	// header row
	let firstRow = '';
	for (const key of Object.keys(objs[0])) {
		firstRow += key + ',';
	}

	rows.push(firstRow);

	for (const obj of objs) {
		rows.push(
			Object.values(obj)
				.map((val) => JSON.stringify(val).replaceAll(',', ';'))
				.join(',')
		);
	}

	return rows.join('\n');
}
