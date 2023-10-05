import { join } from 'node:path'
import process from 'node:process'
import { rollup } from 'rollup'
import fs from 'fs-extra'
import typescript from 'rollup-plugin-typescript2'
import replaceImports from 'rollup-plugin-replace-imports'
import { terser } from 'rollup-plugin-terser'
import {
  packages,
  BUILD_PATH,
  RELEASES_PATH,
  PROJECT_PATH,
  LIBRARY_NAME,
  TSCONFIG_PATH,
  COMPILER_TYPE,
  unsetEasyDndImport
} from './util/index.mjs'

const BUILD_TYPE = {
  ES:       'es',
  RELEASES: 'releases'
}

async function buildPackage(_package, isBuildEs) {

  const {
    type,
    name,
    entry,
    external,
    releasesName,
    outputFolder
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
            declaration: isBuildEs ? type === COMPILER_TYPE.CORE : false
          }
        }
      })
    ].filter(Boolean),
    external: isBuildEs ? [ ...external, LIBRARY_NAME ] : external
  })

  const outputOptions = [
    {
      file:      isBuildEs ? join(outputFolder, 'index.js') : join(RELEASES_PATH, `${releasesName}.es.js`),
      format:    'es',
      sourcemap: false
    },
    isBuildEs ? null : {
      file:      join(RELEASES_PATH, `${releasesName}.umd.js`),
      format:    'umd',
      name:      'dnd',
      globals:   external,
      sourcemap: false
    }
  ].filter(Boolean)

  // 遍历输出选项，生成代码并写入文件
  for (const option of outputOptions) {
    await bundle.generate(option)
    await bundle.write(option)
  }

  await unsetEasyDndImport(_package)

  console.log(`${name}：构建结束`)

}

; (async function () {
  const isBuildEs = (process.argv[2] || BUILD_TYPE.ES) === BUILD_TYPE.ES
  await fs.emptyDir(isBuildEs ? BUILD_PATH : RELEASES_PATH)
  await Promise.allSettled(packages.map((t) => buildPackage(t, isBuildEs)))
  isBuildEs && copyNpmConfig()
})()

function copyNpmConfig() {
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
}