const { join } = require('node:path')
const { rollup, watch } = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const replaceImports = require('rollup-plugin-replace-imports')
const { terser } = require('rollup-plugin-terser')
// const copy = require('rollup-plugin-copy')

function build() {

}

// async function build() {
//   // 创建一个 bundle
//   const bundle = await rollup({
//     input: join(__dirname, '../packages/dnd/index.ts'),
//     plugins: [
//       terser({
//         compress: true,
//         ie8: false,
//       }),
//       typescript(),
//     ]
//   });

//   // 生成代码并写入到 output 文件
//   await bundle
//     .write({
//       file: join(__dirname, '../build/index.js'),
//       format: 'es',
//       sourcemap: false
//     })
// }

watch({
  input: join(__dirname, '../src/index.ts'),
  output: {
    file: join(__dirname, '../build/index.js'),
    format: 'es',
    sourcemap: false
  },
  plugins: [
    terser({
      compress: true,
      ie8: false,
    }),
    typescript(),
  ]
})
  .on('event', event => {
    // 监听构建事件
    if (event.code === 'START') {
      console.log('开始构建...');
    } else if (event.code === 'END') {
      console.log('构建结束.');
    } else if (event.code === 'ERROR') {
      console.error('构建时发生错误:', event.error);
    }
  })

watch({
  input: join(__dirname, '../src/react/index.tsx'),
  output: {
    file: join(__dirname, '../build/react/index.js'),
    format: 'es',
    sourcemap: false
  },
  plugins: [
    replaceImports((n) => {
      if (n === 'dnd') {
        return '../'
      }
      return n
    }),
    terser({
      compress: true,
      ie8: false,
    }),
    typescript({
      tsconfig: join(__dirname, '../tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declaration: false
        }
      }
    })
  ],
  external: ['react', 'react/jsx-runtime','dnd']
})
  .on('event', event => {
    // 监听构建事件
    if (event.code === 'START') {
      console.log('开始构建...');
    } else if (event.code === 'END') {
      console.log('构建结束.');
    } else if (event.code === 'ERROR') {
      console.error('构建时发生错误:', event.error);
    }
  })
