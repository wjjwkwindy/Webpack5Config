// import 'core-js'; // 手动全部引入polyfill
// import 'core-js/es/promise'; // 只引入打包 promise 的 polyfill

import sum from './js/sum';

import './css/iconfont.css';
import './css/index.css';
import './less/index.less';
import './sass/index.sass';
import './sass/index.scss';
import './styl/index.styl';

console.log(sum(1, 2, 3, 4));

// 热更新，以下代码生产模式下会删除
if (module.hot) {
    // module.hot.accept('./js/count.js', function (count) {
    //     const result = count(2, 1);
    //     console.log(result);
    // });
    module.hot.accept('./js/sum.js', function (sum) {
        console.log(sum(1, 2, 3, 4));
    });
}

// 动态导入(代码按需加载，也叫懒加载，比如路由懒加载就是这样实现的)
// 但是加载速度还不够好，比如：是用户点击按钮时才加载这个资源的，如果资源体积很大，那么用户会感觉到明显卡顿效果。
// 我们想在浏览器空闲时间，加载后续需要使用的资源。我们就需要用上 Preload 或 Prefetch 技术。在webpack中配置
document.querySelector('#btn').onclick = function () {
    // eslint会对动态导入语法报错，需要修改eslint配置文件
    // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
    // "math"将来就会作为[name]的值显示。
    import(/* webpackChunkName: 'count' */ './js/count.js').then(
        ({ default: count }) => {
            console.log(count(2, 1));
        }
    );
};

// promise
// 测试 core-js polyfill
const promise = Promise.resolve();
promise.then(() => {
    console.log('hello Promise');
});

// PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('SW registered:', registration);
            })
            .catch((registrationError) => {
                console.log('SW registered fail:', registrationError);
            });
    });
}
