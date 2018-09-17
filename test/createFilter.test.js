var path = require( 'path' );
var assert = require( 'assert' );
var createFilter = require( '..' ).createFilter;

describe( 'createFilter', function () {
	it( 'includes by default', function () {
		var filter = createFilter();
		assert.ok( filter( path.resolve( 'x' ) ) );
	});

	it( 'excludes IDs that are not included, if include.length > 0', function () {
		var filter = createFilter([ 'y' ]);
		assert.ok( !filter( path.resolve( 'x' ) ) );
		assert.ok( filter( path.resolve( 'y' ) ) );
	});

	it( 'excludes IDs explicitly', function () {
		var filter = createFilter( null, [ 'y' ]);
		assert.ok( filter( path.resolve( 'x' ) ) );
		assert.ok( !filter( path.resolve( 'y' ) ) );
	});

	it( 'handles non-array arguments', function () {
		var filter = createFilter( 'foo/*', 'foo/baz' );
		assert.ok( filter( path.resolve( 'foo/bar' ) ) );
		assert.ok( !filter( path.resolve( 'foo/baz' ) ) );
	});

	it( 'negation patterns', function () {
		var filter = createFilter([ 'a/!(b)/c' ]);
		assert.ok( filter( path.resolve( 'a/d/c' ) ) );
		assert.ok( !filter( path.resolve( 'a/b/c' ) ) );
	});

	it( 'excludes non-string IDs', function () {
		var filter = createFilter( null, null );
		assert.ok( !filter({}) );
	});

	it( 'excludes strings beginning with NUL', function () {
		var filter = createFilter( null, null );
		assert.ok( !filter( '\0someid' ) );
	});

	it( 'includes with regexp', function () {
		var filter = createFilter(['a/!(b)/c' , /\.js$/ ]);
		assert.ok( filter( path.resolve( 'a/d/c' ) ) );
		assert.ok( !filter( path.resolve( 'a/b/c' ) ) );
		assert.ok( filter( path.resolve( 'a.js' ) ) );
		assert.ok( filter( path.resolve( 'a/b.js' ) ) );
		assert.ok( !filter( path.resolve( 'a/b.jsx' ) ) );
	});

	it ('excludes with regexp', function () {
		var filter = createFilter(['a/!(b)/c' , /\.js$/ ], /\.js$/);
		assert.ok( filter( path.resolve( 'a/d/c' ) ) );
		assert.ok( !filter( path.resolve( 'a/b/c' ) ) );
		assert.ok( !filter( path.resolve( 'a.js' ) ) );
		assert.ok( !filter( path.resolve( 'a/b.js' ) ) );
		assert.ok( !filter( path.resolve( 'a/b.jsx' ) ) );
	});
});
