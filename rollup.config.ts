// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'

// import jQuery from 'jquery';

const pkg = require('./package.json')

const libraryName = 'index'

export default {
  input: `compiled/${libraryName}.js`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: 'umd' },
    { file: pkg.module, format: 'es' },
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [ 'jquery', 'bootstrap' ],
  // globals: { 'jquery': jQuery },
  watch: {
    include: 'compiled/**',
  },
  plugins: [
    sourceMaps()
  ],
}
