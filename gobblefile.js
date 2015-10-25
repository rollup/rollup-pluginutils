var gobble = require( 'gobble' );
var babel = require( 'rollup-plugin-babel' );

module.exports = gobble([
	// CommonJS build
	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'pluginutils.cjs.js',
		plugins: [ babel() ],
		format: 'cjs',
		external: [ 'path', 'minimatch' ]
	}),

	// ES6 build
	gobble( 'src' ).transform( 'rollup', {
		entry: 'index.js',
		dest: 'pluginutils.es6.js',
		plugins: [ babel() ],
		format: 'es6',
		external: [ 'path', 'minimatch' ]
	})
]);
