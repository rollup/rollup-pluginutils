#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const globals = require('globals');
const reserved = require('./reservedWords');

const blacklisted = compactifyMap(reserved);

for (const key of Object.keys(globals)) {
	Object.assign(blacklisted, compactifyMap(globals[key]));
}

fs.writeFileSync(
	path.resolve(__dirname, '../src/utils/blacklisted.js'),
	`export default ${JSON.stringify(blacklisted)};`,
	'utf8'
);

// Instead of "true", all values in the map are represented as "1"
function compactifyMap (map) {
	const result = {};
	for (const key of Object.keys(map)) {
		result[key] = 1;
	}
	return result;
}
