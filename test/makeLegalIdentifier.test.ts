import { makeLegalIdentifier } from '../src/index';

describe('makeLegalIdentifier', function() {
	it('camel-cases names', function() {
		expect(makeLegalIdentifier('foo-bar')).toEqual('fooBar');
	});

	it('replaces keywords', function() {
		expect(makeLegalIdentifier('typeof')).toEqual('_typeof');
	});

	it('blacklists arguments (https://github.com/rollup/rollup/issues/871)', function() {
		expect(makeLegalIdentifier('arguments')).toEqual('_arguments');
	});
});
