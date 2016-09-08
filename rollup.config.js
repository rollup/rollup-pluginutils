var pkg = require('./package.json');
import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	plugins: [ buble() ],
	external: [ 'path', 'minimatch' ],

	targets: [
		{
				format: 'cjs',
				dest: pkg['main']
		},
		{
				format: 'es',
				dest: pkg['module']
		}
	]
};
