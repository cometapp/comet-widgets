// import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import inject from 'rollup-plugin-inject';

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
    inject({
      include: '**/*.js',
      exclude: 'node_modules/**',
      jQuery: 'jquery',
    })
    // typescript(),
    // json({
    //   exclude: [
    //     'node_modules/**',
    //     '**/*.json'
    //   ]
    // }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    // commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    // resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
