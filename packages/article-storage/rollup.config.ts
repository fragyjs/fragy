import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const plugins = [json(), resolve(), commonjs(), typescript({ useTsconfigDeclarationDir: true }), sourceMaps()];

if (process.env.NODE_ENV === 'production') {
  plugins.push(filesize({ showMinifiedSize: false, showBrotliSize: true }), terser());
}

export default {
  input: `src/main.ts`,
  output: [
    { file: pkg.main, name: pkg.name, format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins,
};
