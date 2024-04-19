import process from 'node:process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  rmSync,
  readFileSync,
  copyFileSync,
  writeFileSync
} from 'node:fs'
import { context, build } from 'esbuild'
import { dtsPlugin } from 'esbuild-plugin-d.ts'

// 项目路径
const PROJECT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..')
const gP = p => join(PROJECT_PATH, p)
// 打包路径
const BUILD_PATH = gP('build')
const gB = p => join(BUILD_PATH, p)

const TYPE = {
  DEV:   'dev',
  BUILD: 'build'
}

const isBuild = (process.argv[2] || TYPE.BUILD) !== TYPE.DEV

// 把打包路径给删除
try { isBuild && rmSync(BUILD_PATH, { recursive: true }) } catch (e) { }

const tasks = [
  {
    entry:    gP('src/index.ts'),
    output:   gB('index.js'),
    external: []
  },
  {
    entry:    gP('src/react/index.ts'),
    output:   gB('react/index.js'),
    external: [ 'react', 'easy-dnd' ]
  },
  {
    entry:    gP('src/vue/index.ts'),
    output:   gB('vue/index.js'),
    external: [ 'vue', 'easy-dnd' ]
  }
]

let tasked = 0

tasks.forEach(({ entry, output, external }) => {
  const config = {
    sourcemap:         !isBuild,
    entryPoints:       [ entry ],
    target:            'es6',
    format:            'esm',
    bundle:            true,
    minifyIdentifiers: true,
    minifyWhitespace:  true,
    outfile:           output,
    external,
    plugins:           [
      dtsPlugin(),
      {
        name: 'log-rebuild',
        setup(build) {
          let startTime
          build.onStart(() => {
            startTime = Date.now()
          })
          build.onEnd(() => {
            if (isBuild) {
              copyNpmConfig()
            } else {
              console.log(`打包完成, 打包时间: ${Date.now() - startTime}ms, 输出路径: ${output}`)
            }
          })
        }
      }
    ]
  }
  if (isBuild) {
    build(config)
  } else {
    context(config)
      .then(ctx => ctx.watch())
      .catch((e) => {
        console.error('esbuild ERROR', e)
      })
  }
})

function copyNpmConfig() {
  if (++tasked !== tasks.length) return
  const desJson = JSON.parse(readFileSync(gP('package.json'), 'utf-8'))
  const newPackageJson = {
    name:       desJson.name,
    version:    desJson.version,
    keywords:   desJson.keywords,
    author:     desJson.author,
    repository: desJson.repository
  }
  writeFileSync(gB('package.json'), JSON.stringify(newPackageJson, null, 2))
  copyFileSync(gP('README.md'), gB('README.md'))
  console.log(`打包成功，路径：${BUILD_PATH}`)
}