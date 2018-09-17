const assert = require('assert');
const {makeLegalIdentifier} = require('..');

describe('makeLegalIdentifier', () => {
	it('camel-cases names', function () {
		assert.equal(makeLegalIdentifier('foo-bar'), 'fooBar');
	});

	it('replaces keywords', () => {
		assert.equal(makeLegalIdentifier('typeof'), '_typeof');
	});

	it('blacklists arguments (https://github.com/rollup/rollup/issues/871)', () => {
		assert.equal(makeLegalIdentifier('arguments'), '_arguments');
	});

	it('blacklists builtins', () => {
		assert.equal(makeLegalIdentifier('process'), '_process');
	});
});
