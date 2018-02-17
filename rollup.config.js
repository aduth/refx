export default {
	input: 'src/refx.js',
	output: [
		{
			format: 'cjs',
			file: 'refx.js',
		},
		{
			format: 'iife',
			file: 'dist/refx.js',
			name: 'refx',
		},
	],
};
