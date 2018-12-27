import * as path from 'path';
import { createFilter } from '../src/index';

describe( 'createFilter', function () {
	it( 'includes by default', function () {
		var filter = createFilter();
		expect( filter( path.resolve( 'x' ) ) ).toBeTruthy();
	});

	it( 'excludes IDs that are not included, if include.length > 0', function () {
		var filter = createFilter([ 'y' ]);
		expect( filter( path.resolve( 'x' ) ) ).toBeFalsy();
		expect( filter( path.resolve( 'y' ) ) ).toBeTruthy();
	});

	it( 'excludes IDs explicitly', function () {
		var filter = createFilter( null, [ 'y' ]);
		expect( filter( path.resolve( 'x' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'y' ) ) ).toBeFalsy();
	});

	it( 'handles non-array arguments', function () {
		var filter = createFilter( 'foo/*', 'foo/baz' );
		expect( filter( path.resolve( 'foo/bar' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'foo/baz' ) ) ).toBeFalsy();
	});

	it( 'negation patterns', function () {
		var filter = createFilter([ 'a/!(b)/c' ]);
		expect( filter( path.resolve( 'a/d/c' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'a/b/c' ) ) ).toBeFalsy();
	});

	it( 'excludes non-string IDs', function () {
		var filter = createFilter( null, null );
		expect( filter({}) ).toBeFalsy();
	});

	it( 'excludes strings beginning with NUL', function () {
		var filter = createFilter( null, null );
		expect( filter( '\0someid' ) ).toBeFalsy();
	});

	it( 'includes with regexp', function () {
		var filter = createFilter(['a/!(b)/c' , /\.js$/ ]);
		expect( filter( path.resolve( 'a/d/c' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'a/b/c' ) ) ).toBeFalsy();
		expect( filter( path.resolve( 'a.js' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'a/b.js' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'a/b.jsx' ) ) ).toBeFalsy();
	});

	it ('excludes with regexp', function () {
		var filter = createFilter(['a/!(b)/c' , /\.js$/ ], /\.js$/);
		expect( filter( path.resolve( 'a/d/c' ) ) ).toBeTruthy();
		expect( filter( path.resolve( 'a/b/c' ) ) ).toBeFalsy();
		expect( filter( path.resolve( 'a.js' ) ) ).toBeFalsy();
		expect( filter( path.resolve( 'a/b.js' ) ) ).toBeFalsy();
		expect( filter( path.resolve( 'a/b.jsx' ) ) ).toBeFalsy();
	});
});
