module.exports = {
    presets: [
        [
            // @babel/preset-env 智能预设来处理兼容性问题。
            /*
               它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。
               但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。
            */
            '@babel/preset-env',
            // 按需加载 core-js 的 polyfill
            {
                useBuiltIns: 'usage',
                corejs: {
                    version: '3',
                    proposals: true,
                },
            },
        ],
    ],
};
