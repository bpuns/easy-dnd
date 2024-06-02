const OFF = 0
const ERROR = 'error'

module.exports = {
  'env': {
    'browser': true,
    'es2021':  true
  },
  'rules': {
    // 强制注释后必须有个空格
    'spaced-comment':  ERROR,
    // 强制圆括号内没有空格
    'space-in-parens': ERROR,
    // 要求或禁止使用拖尾逗号
    'comma-dangle':    [
      ERROR,
      {
        'arrays':  'never',   // 数组不允许最后一位出现逗号
        'objects': 'never'    // 对象不允许最后一位出现逗号
      }
    ],
    // 每个文件的class最多能有3个
    'max-classes-per-file':        [ ERROR, 10 ],
    // 对象空格
    'object-curly-spacing':        [ ERROR, 'always' ],
    // 必须使用单引号
    'quotes':                      [ ERROR, 'single' ],
    // 结尾不能加上分号
    'semi':                        [ ERROR, 'never' ],
    // 设置代码缩进为2
    'indent':                      [ ERROR, 2, { 'SwitchCase': 1 } ],
    // 类成员之间需要有空行, 单行类成员不需要换行
    'lines-between-class-members': [
      ERROR,
      'always',
      {
        exceptAfterSingleLine: true
      }
    ],
    // 一个文件最多可以有多少行
    'max-lines': [ ERROR, {
      max:            500,    // 最多300
      skipBlankLines: true,   // 忽略空白行
      skipComments:   true    // 忽略注释行
    } ],
    // 不能出现连续2行空行
    'no-multiple-empty-lines': [ ERROR, { max: 1 } ],
    // 强制函数最大代码行数
    'max-lines-per-function':  [
      ERROR, {
        max:            250,    // 最大250行
        skipBlankLines: true,   // 忽略空白行
        skipComments:   true    // 忽略注释行
      }
    ],
    // 强制函数定义中最多允许的参数数量
    'max-params':            [ ERROR, { max: 6 } ],
    // 数组 前后都要加空格
    'array-bracket-spacing': [ ERROR, 'always' ],
    // 对象风格
    'key-spacing':           [
      ERROR, {
        beforeColon: false,     //  冒号之前不存在一个空格
        afterColon:  true,      //  冒号之后存在一个空格
        mode:        'minimum',
        align:       'value'
      }
    ],
    // 强制关键字周围空格的一致性 
    'keyword-spacing':                 [ ERROR, { 'before': true, 'after': true } ],
    // 强制在代码块中开括号前和闭括号后有空格
    'block-spacing':                   [ ERROR, 'always' ],
    // 禁止出现空函数
    // 'no-empty-function': ERROR,
    // 禁止使用不带 await 表达式的 async 函数
    // 'require-await': ERROR,
    // 强制在逗号周围使用空格
    'comma-spacing':                   [ ERROR, { 'before': false, 'after': true } ],
    // 强制在 JSX 属性中使用一致的单引号
    'jsx-quotes':                      [ ERROR, 'prefer-single' ],
    // 禁用不必要的构造函数 
    // 'no-useless-constructor': ERROR,
    // 禁用 Alert
    'no-alert':                        ERROR,
    // 禁用 var
    'no-var':                          ERROR,
    // no-console
    'no-console':                      OFF,
    // 要求中缀操作符周围有空格
    'space-infix-ops':                 ERROR,
    // 允许单驼峰组件名称
    'vue/multi-word-component-names':  OFF,
    'vue/no-reserved-component-names': OFF,
    // vue3允许模板有多个入口
    'vue/no-multiple-template-root':   OFF,
    // 设置单行最多5个属性,单行至多只能有一个属性
    'vue/max-attributes-per-line':     [
      ERROR,
      {
        'singleline': {
          'max': 4
        },
        'multiline': {
          'max': 1
        }
      }
    ],
    // prop必须得设置默认值
    'vue/require-default-prop':                    OFF,
    'vue/singleline-html-element-content-newline': OFF,
    'vue/no-v-model-argument':                     OFF,
    'vue/component-definition-name-casing':        OFF,
    'vue/no-v-for-template-key':                   OFF,
    'vue/one-component-per-file':                  OFF,
    'vue/no-mutating-props':                       OFF,
    'vue/attribute-hyphenation':                   OFF

  },
  'extends': [
    'plugin:vue/vue3-essential',
    'plugin:vue/recommended'
  ],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  parser:          'vue-eslint-parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'parser':      '@typescript-eslint/parser',
    'sourceType':  'module',
    'ecmaFeature': {
      'jsx': true
    }
  },
  'plugins': [
    '@typescript-eslint',
    'vue'
  ]
}