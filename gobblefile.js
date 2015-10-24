var gobble = require( 'gobble' );

module.exports = gobble([
	// CommonJS build
	gobble( 'src' ).transform( 'rollup-babel', {
		entry: 'index.js',
		dest: 'pluginutils.cjs.js',
		format: 'cjs',
		external: [ 'path', 'minimatch' ],
		sourceMap: true
	}),

	// ES6 build
	gobble( 'src' ).transform( 'rollup-babel', {
		entry: 'index.js',
		dest: 'pluginutils.es6.js',
		format: 'es6',
		external: [ 'path', 'minimatch' ],
		sourceMap: true
	})
]);
