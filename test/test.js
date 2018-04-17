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

		it( 'includes with regexp', function () {
			var filter = createFilter(['a/!(b)/c' , /\.js$/ ]);
			assert.ok( filter( path.resolve( 'a/d/c' ) ) );
			assert.ok( !filter( path.resolve( 'a/b/c' ) ) );
			assert.ok( filter( path.resolve( 'a.js' ) ) );
			assert.ok( filter( path.resolve( 'a/b.js' ) ) );
			assert.ok( !filter( path.resolve( 'a/b.jsx' ) ) );
		})

		it ('excludes with regexp', function () {
			var filter = createFilter(['a/!(b)/c' , /\.js$/ ], /\.js$/);
			assert.ok( filter( path.resolve( 'a/d/c' ) ) );
			assert.ok( !filter( path.resolve( 'a/b/c' ) ) );
			assert.ok( !filter( path.resolve( 'a.js' ) ) );
			assert.ok( !filter( path.resolve( 'a/b.js' ) ) );
			assert.ok( !filter( path.resolve( 'a/b.jsx' ) ) );
		})
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

		it('adds named declarators from a deconstructed declaration', function() {
			var ast = {
				"type": "Program",
				"start": 0,
				"end": 13,
				"body": [
					{
						"type": "VariableDeclaration",
						"start": 0,
						"end": 42,
						"declarations": [
							{
								"type": "VariableDeclarator",
								"start": 4,
								"end": 41,
								"id": {
								"type": "ObjectPattern",
								"start": 4,
								"end": 15,
								"properties": [
									{
										"type": "Property",
										"start": 6,
										"end": 10,
										"method": false,
										"shorthand": false,
										"computed": false,
										"key": {
											"type": "Literal",
											"start": 6,
											"end": 7,
											"value": 1,
											"raw": "1"
										},
										"value": {
											"type": "Identifier",
											"start": 9,
											"end": 10,
											"name": "a"
										},
										"kind": "init"
									},
									{
										"type": "Property",
										"start": 12,
										"end": 13,
										"method": false,
										"shorthand": true,
										"computed": false,
										"key": {
											"type": "Identifier",
											"start": 12,
											"end": 13,
											"name": "b"
										},
										"kind": "init",
										"value": {
											"type": "Identifier",
											"start": 12,
											"end": 13,
											"name": "b"
										}
									}
								]},
								"init": {
									"type": "ObjectExpression",
									"start": 18,
									"end": 41,
									"properties": [
										{
											"type": "Property",
											"start": 22,
											"end": 28,
											"method": false,
											"shorthand": false,
											"computed": false,
											"key": {
												"type": "Literal",
												"start": 22,
												"end": 23,
												"value": 1,
												"raw": "1"
											},
											"value": {
												"type": "Literal",
												"start": 25,
												"end": 28,
												"value": "a",
												"raw": "'a'"
											},
											"kind": "init"
										},
										{
											"type": "Property",
											"start": 32,
											"end": 38,
											"method": false,
											"shorthand": false,
											"computed": false,
											"key": {
												"type": "Identifier",
												"start": 32,
												"end": 33,
												"name": "b"
											},
											"value": {
												"type": "Literal",
												"start": 35,
												"end": 38,
												"value": "b",
												"raw": "'b'"
											},
											"kind": "init"
										}
									]
								}
							}
						],
						"kind": "var"
					}
				],
				"sourceType": "module"
			};

			var scope = attachScopes(ast, 'scope');
			assert.ok(scope.contains('a'));
			assert.ok(scope.contains('b'));
		});

		it('adds nested declarators from a deconstructed declaration', function() {
			var ast = {
				"type": "Program",
				"start": 0,
				"end": 40,
				"body": [{
					"type": "VariableDeclaration",
					"start": 0,
					"end": 40,
					"declarations": [{
						"type": "VariableDeclarator",
						"start": 4,
						"end": 39,
						"id": {
							"type": "ObjectPattern",
							"start": 4,
							"end": 19,
							"properties": [{
								"type": "Property",
								"start": 6,
								"end": 17,
								"method": false,
								"shorthand": false,
								"computed": false,
								"key": {
									"type": "Identifier",
									"start": 6,
									"end": 7,
									"name": "a"
								},
								"value": {
									"type": "ObjectPattern",
									"start": 9,
									"end": 17,
									"properties": [{
										"type": "Property",
										"start": 11,
										"end": 15,
										"method": false,
										"shorthand": false,
										"computed": false,
										"key": {
											"type": "Identifier",
											"start": 11,
											"end": 12,
											"name": "b"
										},
										"value": {
											"type": "Identifier",
											"start": 14,
											"end": 15,
											"name": "c"
										},
										"kind": "init"
									}]
								},
								"kind": "init"
							}]
						},
						"init": {
							"type": "ObjectExpression",
							"start": 22,
							"end": 39,
							"properties": [{
								"type": "Property",
								"start": 24,
								"end": 37,
								"method": false,
								"shorthand": false,
								"computed": false,
								"key": {
									"type": "Identifier",
									"start": 24,
									"end": 25,
									"name": "a"
								},
								"value": {
									"type": "ObjectExpression",
									"start": 27,
									"end": 37,
									"properties": [{
										"type": "Property",
										"start": 29,
										"end": 35,
										"method": false,
										"shorthand": false,
										"computed": false,
										"key": {
											"type": "Identifier",
											"start": 29,
											"end": 30,
											"name": "b"
										},
										"value": {
											"type": "Literal",
											"start": 32,
											"end": 35,
											"value": "b",
											"raw": "'b'"
										},
										"kind": "init"
									}]
								},
								"kind": "init"
							}]
						}
					}],
					"kind": "let"
				}],
				"sourceType": "module"
			};

			var scope = attachScopes(ast, 'scope');
			assert.ok(!scope.contains('a'));
			assert.ok(!scope.contains('b'));
			assert.ok(scope.contains('c'));
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

	describe( 'dataToNamedExports', function () {
		var dataToNamedExports = utils.dataToNamedExports;

		it( 'outputs treeshakable data', function () {
			assert.equal( dataToNamedExports({ some: 'data', another: 'data' }), `export const some = "data";\nexport const another = "data";\nexport default {\n  some,\n  another\n};` );
		});

		it( 'handles illegal identifiers', function () {
			assert.equal( dataToNamedExports({ '1': 'data', 'default': 'data' }), `export const _1 = "data";\nexport const _default = "data";\nexport default {\n  '1': _1,\n  'default': _default\n};` );
		});

		it( 'supports non-JSON data', function () {
			const date = new Date();
			assert.equal( dataToNamedExports({ inf: Infinity, date }), `export const inf = Infinity;\nexport const date = new Date(${date.getTime()});\nexport default {\n  inf,\n  date\n};` );
		});
	});
});
