var pkg = require('./package.json');
import buble from 'rollup-plugin-buble';

export default {
	input: 'src/index.js',
	plugins: [ buble() ],
	external: [ 'path', 'estree-walker', 'micromatch', 'tosource' ],

	output: [
		{
			format: 'cjs',
			file: pkg['main']
		},
		{
			format: 'es',
			file: pkg['module']
		}
	]
};
