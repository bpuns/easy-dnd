import { join } from 'node:path'
import { rollup } from 'rollup'
import fs from 'fs-extra'
import typescript from 'rollup-plugin-typescript2'
import replaceImports from 'rollup-plugin-replace-imports'
import { terser } from 'rollup-plugin-terser'
import {
  packages,
  BUILD_PATH,
  PROJECT_PATH,
  LIBRARY_NAME,
  TSCONFIG_PATH,
  COMPILER_TYPE,
  unsetEasyDndImport
} from './util/index.mjs'

async function buildPackage(_package) {

  const {
    type,
    name,
    entry,
    external,
    outputFile
  } = _package

  console.log(`${name}：开始构建`)

  // 创建打包器
  const bundle = await rollup({
    input:   entry,
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

  const outputOptions = {
    file:      outputFile,
    format:    'es',
    sourcemap: false
  }

  // 生成代码
  await bundle.generate(outputOptions)

  // 写入文件
  await bundle.write(outputOptions)

  await unsetEasyDndImport(_package)

  console.log(`${name}：构建结束`)

}

; (async function () {
  console.log('清理打包路径')
  await fs.emptyDir(BUILD_PATH)
  await Promise.allSettled(packages.map(buildPackage))
  // 复制package.json
  const desJson = JSON.parse(fs.readFileSync(join(PROJECT_PATH, 'package.json'), 'utf-8'))
  const newPackageJson = {
    name:       desJson.name,
    version:    desJson.version,
    keywords:   desJson.keywords,
    author:     desJson.author,
    repository: desJson.repository
  }
  fs.writeFileSync(join(BUILD_PATH, 'package.json'), JSON.stringify(newPackageJson, null, 2))
  console.log('package.json完成')
  // 复制README.md
  fs.copyFileSync(
    join(PROJECT_PATH, 'README.md'),
    join(BUILD_PATH, 'README.md')
  )
  console.log('复制README.md完成')
})()