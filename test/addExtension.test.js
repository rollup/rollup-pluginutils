const assert = require( 'assert' );
const {addExtension} = require( '..' );

describe( 'addExtension', function () {
	it( 'adds .js to an ID without an extension', function () {
		assert.equal( addExtension( 'foo' ), 'foo.js' );
	});

	it( 'ignores file with existing extension', function () {
		assert.equal( addExtension( 'foo.js' ), 'foo.js' );
		assert.equal( addExtension( 'foo.json' ), 'foo.json' );
	});

	it( 'ignores file with trailing dot', function () {
		assert.equal( addExtension( 'foo.' ), 'foo.' );
	});

	it( 'ignores leading .', function () {
		assert.equal( addExtension( './foo' ), './foo.js' );
		assert.equal( addExtension( './foo.js' ), './foo.js' );
	});

	it( 'adds a custom extension', function () {
		assert.equal( addExtension( 'foo', '.wut' ), 'foo.wut' );
		assert.equal( addExtension( 'foo.lol', '.wut' ), 'foo.lol' );
	});
});
