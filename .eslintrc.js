// module.exports = {
//     // 解析选项
//     parserOptions: {
//         ecmaVersion: 6,// ES语法版本
//         sourceType: 'module',// ES模块化
//         ecmaFeatures: {// ES 其它特性
//             jsx: true // 如果是react，需要开启jsx
//         }
//     },
//     // 具体检查规则
//     rules: {
//         semi: 'error',
//         'array-callback-return': 'warn',
//         'default-case': ['warn', { commontPattern: '^no default$' }],
//         eqeqeq: ['warn', 'smart']
//     },
//     // 继承其它规则
//     extends: []
// }

module.exports = {
    extends: ['eslint:recommended'],
    // 支持最新最终的ECMAscript标准
    // eslint会对动态导入语法报错，修改eslint配置文件
    parser: '@babel/eslint-parser',
    env: {
        node: true,
        browser: true,
        es6: true
    },
    plugins: ['import'], // 解决动态导入import语法报错问题 --> 实际使用eslint-plugin-import的规则解决的
    parserOptions: {
        ecmaVersion: 6, // es6
        sourceType: 'module', // es module
    },
    rules: {
        'no-var': 2,
    },
};
