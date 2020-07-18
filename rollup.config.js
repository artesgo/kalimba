import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import html from 'rollup-plugin-html2';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import preprocess from 'svelte-preprocess';

require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const port = 3000;

// define all our plugins
const plugins = [
	svelte({
		dev: isDev,
		extensions: ['.svelte'],
		preprocess: preprocess(),
	}),
	typescript(),
	resolve({
		browser: true,
		dedupe: ['svelte'],
	}),
	commonjs(),
	// injects your bundles into index page
	html({
		template: 'src/index.html',
		fileName: 'index.html',
	}),
];

if (isDev) {
	plugins.push(
		// like a webpack-dev-server
		serve({
			contentBase: './dist',
			historyApiFallback: true, // for SPAs
			port,
		}),
		livereload({ watch: './dist' })
	);
} else {
	plugins.push(terser());
}

module.exports = {
	input: 'src/main.ts',
	output: {
		name: 'bundle',
		file: 'dist/bundle.js',
		format: 'iife',
	},
	plugins,
};