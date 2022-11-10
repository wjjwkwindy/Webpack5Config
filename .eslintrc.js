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
    env: {
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
    },
    rules: {
        'no-var': 2,
    },
};
