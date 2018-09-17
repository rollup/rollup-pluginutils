var assert = require( 'assert' );
var makeLegalIdentifier = require( '..' ).makeLegalIdentifier;

describe( 'makeLegalIdentifier', function () {
	it( 'camel-cases names', function () {
		assert.equal( makeLegalIdentifier( 'foo-bar' ), 'fooBar' );
	});

	it( 'replaces keywords', function () {
		assert.equal( makeLegalIdentifier( 'typeof' ), '_typeof' );
	});

	it( 'blacklists arguments (https://github.com/rollup/rollup/issues/871)', function () {
		assert.equal( makeLegalIdentifier( 'arguments' ), '_arguments' );
	});
});
