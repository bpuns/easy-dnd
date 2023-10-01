const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  'env': {
    'es2020': true
  },
  'rules': {
    // 强制圆括号内没有空格
    'space-in-parens': ERROR,

    // 强制注释周围有空行
    // 'lines-around-comment': [
    //   ERROR,
    //   {
    //     'beforeBlockComment': true,    // 要求在块级注释之前有一空行
    //     'beforeLineComment':  true,    // 要求在行级注释之后有一空行
    //     'allowObjectEnd':     false,   // 允许注释出现在对象字面量的结束位置
    //     'allowArrayEnd':      false,   // 允许注释出现在数组字面量的结束位置
    //     'allowObjectStart':   false,   // 允许注释出现在对象字面量的开始位置
    //     'allowArrayStart':    false    // 允许注释出现在数组字面量的开始位置
    //   }
    // ],

    // 要求或禁止使用拖尾逗号
    'comma-dangle': [
      ERROR,
      {
        'arrays':    'never',   // 数组不允许最后一位出现逗号
        'objects':   'never'    // 对象不允许最后一位出现逗号
      }
    ],

    // 每个文件的class最多能有3个
    'max-classes-per-file': [ ERROR, 3 ],

    // 对象空格
    'object-curly-spacing': [ ERROR, 'always' ],

    // 必须使用单引号
    'quotes': [ ERROR, 'single' ],

    // 结尾不能加上分号
    'semi': [ ERROR, 'never' ],

    // 设置代码缩进为2
    'indent': [ ERROR, 2, { 'SwitchCase': 1 } ],

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
      max:            300,    // 最多300
      skipBlankLines: true,   // 忽略空白行
      skipComments:   true    // 忽略注释行
    } ],

    // 不能出现连续2行空行
    'no-multiple-empty-lines': [ ERROR, { max: 1 } ],

    // 强制函数最大代码行数
    'max-lines-per-function': [
      ERROR, {
        max:            150,    // 最大150行
        skipBlankLines: true,   // 忽略空白行
        skipComments:   true    // 忽略注释行
      }
    ],

    // 强制函数定义中最多允许的参数数量
    'max-params': [ ERROR, { max: 6 } ],

    // 数组 前后都要加空格
    'array-bracket-spacing': [ ERROR, 'always' ],

    // 对象风格
    'key-spacing': [
      ERROR, {
        beforeColon: false,     //  冒号之前不存在一个空格
        afterColon:  true,      //  冒号之后存在一个空格
        mode:        'minimum',
        align:       'value'
      }
    ],

    // 强制关键字周围空格的一致性 
    'keyword-spacing': [ ERROR, { 'before': true, 'after': true } ],

    // 强制在代码块中开括号前和闭括号后有空格
    'block-spacing': [ ERROR, 'always' ],

    // 禁止出现空函数
    'no-empty-function': ERROR,

    // 禁止使用不带 await 表达式的 async 函数
    'require-await': ERROR,

    // 要求或禁止在函数标识符和其调用之间有空格
    'func-call-spacing': [ ERROR, 'never' ],

    // 强制在逗号周围使用空格
    'comma-spacing': [ ERROR, { 'before': false, 'after': true } ],

    // 强制在 JSX 属性中使用一致的单引号
    'jsx-quotes': [ ERROR, 'prefer-single' ],

    // 禁用不必要的构造函数 
    'no-useless-constructor': ERROR,

    // 禁用 Alert
    'no-alert': ERROR,

    // 禁用 var
    'no-var': ERROR,

    // no-console
    'no-console': OFF,

    // 要求中缀操作符周围有空格
    'space-infix-ops': ERROR
  },
  'parserOptions': {
    'sourceType':  'module',
    'ecmaFeature': {
      'jsx': true
    }
  },
  ignorePatterns: [
    '*.svg',
    '*.json',
    'iconfont.js',
    '*.eot',
    '*.css',
    '*.html',
    '*.ttf',
    '*.woff',
    '*.woff2'
  ],
  parser: '@typescript-eslint/parser'
}