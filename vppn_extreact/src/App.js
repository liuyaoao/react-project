
import React,{Component} from 'react'
import {Provider} from 'react-redux';
import { renderWhenReady } from '@extjs/reactor';
import ReactWMHome from './main_page';
import "./scss/screen.scss";

  import configureStore from './app/store/configureStore';
var store = configureStore();
// Enable responsiveConfig app-wide. You can remove this if you don't plan to build a responsive UI.
Ext.require('Ext.plugin.Responsive');

/**
 * The main application view
 */
 class App extends Component {
    render() {
        return (
          <Provider store={store}>
            <ReactWMHome/>
          </Provider>
        )
    }
}
export default renderWhenReady(App);
