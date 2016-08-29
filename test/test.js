var path = require( 'path' );
var assert = require( 'assert' );
var utils = require( '..' );

describe( 'rollup-pluginutils', function () {
	describe( 'createFilter', function () {
		var createFilter = utils.createFilter;

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
	});

	describe( 'addExtension', function () {
		var addExtension = utils.addExtension;

		it( 'adds .js to an ID without an extension', function () {
			assert.equal( addExtension( 'foo' ), 'foo.js' );
		});

		it( 'ignores file with existing extension', function () {
			assert.equal( addExtension( 'foo.js' ), 'foo.js' );
			assert.equal( addExtension( 'foo.json' ), 'foo.json' );
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

	describe( 'attachScopes', function () {
		var attachScopes = utils.attachScopes;

		it( 'attaches a scope to the top level', function () {
			var ast = {
				"type": "Program",
				"start": 0,
				"end": 8,
				"body": [
					{
						"type": "VariableDeclaration",
						"start": 0,
						"end": 8,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 4,
								"end": 7,
								"id": {
									"type": "Identifier",
									"start": 4,
									"end": 7,
									"name": "foo"
								},
								"init": null
							}
						],
						"kind": "var"
					}
				],
				"sourceType": "module"
			};

			var scope = attachScopes( ast, 'scope' );
			assert.ok( scope.contains( 'foo' ) );
			assert.ok( !scope.contains( 'bar' ) );
		});

		it( 'adds multiple declarators from a single var declaration', function () {
			var ast = {
				"type": "Program",
				"start": 0,
				"end": 13,
				"body": [
					{
						"type": "VariableDeclaration",
						"start": 0,
						"end": 13,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 4,
								"end": 7,
								"id": {
									"type": "Identifier",
									"start": 4,
									"end": 7,
									"name": "foo"
								},
								"init": null
							},

							{
								"type": "VariableDeclarator",
								"start": 9,
								"end": 12,
								"id": {
									"type": "Identifier",
									"start": 9,
									"end": 12,
									"name": "bar"
								},
								"init": null
							}
						],
						"kind": "var"
					}
				],
				"sourceType": "module"
			};

			var scope = attachScopes( ast, 'scope' );
			assert.ok( scope.contains( 'foo' ) );
			assert.ok( scope.contains( 'bar' ) );
		});

		// TODO more tests
	});

	describe( 'makeLegalIdentifier', function () {
		var makeLegalIdentifier = utils.makeLegalIdentifier;

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
});
