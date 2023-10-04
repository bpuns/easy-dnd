import { join } from 'node:path'
import { watch } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import replaceImports from 'rollup-plugin-replace-imports'
import { terser } from 'rollup-plugin-terser'
import {
  packages,
  PROJECT_PATH,
  LIBRARY_NAME,
  TSCONFIG_PATH,
  COMPILER_TYPE,
  unsetEasyDndImport
} from './util/index.mjs'

function watchPackage(_package) {

  const {
    type,
    name,
    entry,
    external,
    outputFile
  } = _package

  watch({
    input:  entry,
    output: {
      file:      outputFile,
      format:    'es',
      sourcemap: false
    },
    watch: {
      // 只监听src文件夹
      include: join(PROJECT_PATH, 'src/**')
    },
    plugins: [
      replaceImports((n) => {
        if (n === LIBRARY_NAME) return '../'
        return n
      }),
      terser({
        ie8:      false,
        compress: true,
        format:   {
          quote_style: 1
        }
      }),
      typescript({
        tsconfig:         TSCONFIG_PATH,
        tsconfigOverride: {
          compilerOptions: {
            declaration: type === COMPILER_TYPE.CORE
          }
        }
      })
    ],
    external
  })
    .on('event', event => {
      // 监听构建事件
      if (event.code === 'START') {
        console.log(`${name}开始构建...`)
      } else if (event.code === 'END') {
        console.log(`${name}构建结束`)
        unsetEasyDndImport(_package)
      } else if (event.code === 'ERROR') {
        console.error(`${name}构建时发生错误:`, event.error)
      }
    })

}

packages.forEach(watchPackage)