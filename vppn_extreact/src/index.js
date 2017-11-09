import React from 'react'
import ReactDOM from 'react-dom';
// import { AppContainer } from 'react-hot-loader'
// import { launch } from '@extjs/reactor';
// import { renderWhenReady } from '@extjs/reactor';
import App from './App';

//方式一、使用extjs的launch方法初始化dom.
// let viewport;
// const render = (Component, target) => {
//     ReactDOM.render(
//         <AppContainer>
//             <Component/>
//         </AppContainer>,
//         target
//     )
// }
// launch(target => render(App, viewport = target));
// if (module.hot) {
//     module.hot.accept('./App', () => render(App, viewport));
// }

//方式二、使用的 renderWhenReady 方法初始化dom,类似于react的经典方式。
// const tempApp = renderWhenReady(App); //一定要在export导出App组件的时候调用 renderWhenReady方法
ReactDOM.render(<App/>, document.getElementById('root'));
if (module.hot) {
    module.hot.accept('./App', document.getElementById('root'));
}
