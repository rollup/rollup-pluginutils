import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';

export default {
	input: 'src/index.ts',
	plugins: [ typescript() ],
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
