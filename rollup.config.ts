import inject from 'rollup-plugin-inject'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'

const pkg = require('./package.json')

const libraryName = pkg.name;

export default {
  input: `compiled/${libraryName}.js`,
  output: [
    { file: `${pkg.main}.js`,        format: 'umd',  name: camelCase(libraryName) },
    { file: `${pkg.module}.es5.js`,  format: 'es' },
    { file: `${pkg.module}.iife.js`, format: 'iife', name: camelCase(libraryName) },
  ],
  sourcemap: true,
  external: [ 'jquery', 'bootstrap' ],
  globals: { 'jquery': 'jQuery' },
  watch: {
    include: 'compiled/**',
  },
  plugins: [
    inject({
      include: '**/*.js',
      exclude: 'node_modules/**',
      jQuery: 'jquery',
    }),
    sourceMaps()
  ],
}
