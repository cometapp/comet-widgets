// import resolve from 'rollup-plugin-node-resolve'
import inject from 'rollup-plugin-inject'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'

// import jQuery from 'jquery';

const pkg = require('./package.json')

const libraryName = pkg.name;

export default {
  input: `compiled/${libraryName}.js`,
  output: [
    { file: pkg.main+'.js', name: camelCase(libraryName), format: 'umd' },
    { file: pkg.module+'.js', format: 'es' },
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [ 'jquery', 'bootstrap' ],
  // globals: { 'jquery': jQuery },
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
