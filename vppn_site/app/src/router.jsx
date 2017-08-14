import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';

// 引入单个页面（包括嵌套的子页面）
import Init from './main';
import Container from './pages/Container';

// 配置路由，并将路由注入到id为init的DOM元素中
ReactDOM.render(
    <div>
      <Init>
        <Container/>
      </Init>
    </div>
    , document.querySelector('#init')
)
