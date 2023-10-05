import { dirname, join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/** 项目路径 */
export const PROJECT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../../')

/** 打包路径 */
export const BUILD_PATH = join(PROJECT_PATH, 'build')
/** 发布包路径 */
export const RELEASES_PATH = join(PROJECT_PATH, 'releases')

/** tsconfig路径 */
export const TSCONFIG_PATH = join(PROJECT_PATH, 'tsconfig.json')

/** 库名 */
export const LIBRARY_NAME = 'easy-dnd'

/** 编译类型 */
export const COMPILER_TYPE = {
  CORE:  0,
  VUE:   1,
  REACT: 2
}

/**
 * @typedef {Object} Package
 * @property {string} type - The type of the package.
 * @property {string} name - The name of the package.
 * @property {string} entry - The entry point of the package.
 * @property {string} outputFile - The output file of the package.
 * @property {?string} dTsPath - The TypeScript definition file of the package.
 * @property {Array<string>} external - The external dependencies of the package.
 */

/** 
 * 要打包的package
 * @type {Array<Package>}
 */
export const packages = [
  {
    type:         COMPILER_TYPE.CORE,
    name:         'dnd-core',
    releasesName: 'dnd',
    entry:        join(PROJECT_PATH, 'src/index.ts'),
    outputFolder: BUILD_PATH,
    dTsPath:      null,
    external:     []
  },
  {
    type:         COMPILER_TYPE.VUE,
    name:         'vue',
    releasesName: 'dnd-vue',
    entry:        join(PROJECT_PATH, 'src/vue/index.ts'),
    outputFolder: join(BUILD_PATH, 'vue'),
    dTsPath:      join(BUILD_PATH, 'vue/index.d.ts'),
    external:     [ 'vue' ]
  },
  {
    type:         COMPILER_TYPE.REACT,
    name:         'react',
    releasesName: 'dnd-react',
    entry:        join(PROJECT_PATH, 'src/react/index.ts'),
    outputFolder: join(BUILD_PATH, 'react'),
    dTsPath:      join(BUILD_PATH, 'react/index.d.ts'),
    external:     [ 'react', 'react/jsx-runtime' ]
  }
]

/**
 * 把easy-dnd的from替换成 ../
 * @param {Package} _package
 */
export async function unsetEasyDndImport({ dTsPath }) {
  if (!dTsPath) return
  const LIBRARY_NAME_REG = new RegExp(`'${LIBRARY_NAME}'`, 'g')
  await writeFile(
    dTsPath,
    (await readFile(dTsPath, 'utf-8')).replace(LIBRARY_NAME_REG, '\'..\'')
  )
}