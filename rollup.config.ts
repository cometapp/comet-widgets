// import inject from 'rollup-plugin-inject'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'

const pkg = require('./package.json')

const libraryName = pkg.name;

export default {
  input: `compiled/${libraryName}.js`,
  output: [
    { file: pkg.main+'.js', name: camelCase(libraryName), format: 'umd' },
    { file: pkg.module+'.js', format: 'es' },
  ],
  sourcemap: true,
  external: [ 'jquery', 'bootstrap' ],
  globals: { 'jquery': 'jQuery' },
  watch: {
    include: 'compiled/**',
  },
  plugins: [
    // inject({
    //   include: '**/*.js',
    //   exclude: 'node_modules/**',
    //   jQuery: 'jquery',
    // }),
    sourceMaps()
  ],
}
