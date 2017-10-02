
import $ from 'jquery';
require('perfect-scrollbar/jquery')($);
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router/es6';
import PDFJS from 'pdfjs-dist';
// Import our styles
// import 'bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css';
// import 'google-fonts/google-fonts.css';
import 'sass/styles.scss';
// import 'katex/dist/katex.min.css';

// Redux actions
import store from 'stores/redux_store.jsx';
const dispatch = store.dispatch;
const getState = store.getState;
import UserStore from 'stores/user_store.jsx';
import ErrorStore from 'stores/error_store.jsx';
import myWebClient from 'client/my_web_client.jsx';
// import {getClientConfig,  setUrl} from 'mattermost-redux/actions/general';
// import { Client4} from 'mattermost-redux/client';
import Constants from 'utils/constants.jsx';
const ActionTypes = Constants.ActionTypes;
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';
// Import the root of our routing tree
import rRoot from 'routes/route_root.jsx';

PDFJS.disableWorker = true;

function emitInitialLoad(callback) {
    myWebClient.getInitialLoad(
        (data, res) => {
            if (!data && res.text) {
                data = JSON.parse(res.text);
            }
            global.window.mm_config = data.client_cfg;
            global.window.mm_config.SiteName = "吉视E通";

            UserStore.setNoAccounts(data.no_accounts);
            UserStore.setIsAdmin(data.isadmin);
            data.permissions && UserStore.setPermissionData(data.permissions);
            if (data.user && data.user.id) {
                global.window.mm_user = data.user;
                AppDispatcher.handleServerAction({
                    type: ActionTypes.RECEIVED_ME,
                    me: data.user
                });
            }else if(location.pathname != "/login"){
              myWebClient.removeToken();
              sessionStorage.clear();
              browserHistory.replace('/login');
            }

            // if (data.preferences) {
            //     AppDispatcher.handleServerAction({
            //         type: ActionTypes.RECEIVED_PREFERENCES,
            //         preferences: data.preferences
            //     });
            // }
            callback && callback();
        },
        (err) => {
          let method = 'getInitialLoad';
          AppDispatcher.handleServerAction({
              type: ActionTypes.RECEIVED_ERROR,
              err,
              method
          });
          callback && callback();
        }
    );
}
// This is for anything that needs to be done for ALL react components.
// This runs before we start to render anything.
function preRenderSetup(callwhendone) {
    window.onerror = (msg, url, line, column, stack) => {
        var l = {};
        l.level = 'ERROR';
        l.message = 'msg: ' + msg + ' row: ' + line + ' col: ' + column + ' stack: ' + stack + ' url: ' + url;
        if (window.mm_config && window.mm_config.EnableDeveloper === 'true') {
            window.ErrorStore.storeLastError({type: 'developer', message: 'DEVELOPER MODE: A JavaScript error has occurred.  Please use the JavaScript console to capture and report the error (row: ' + line + ' col: ' + column + ').'});
            window.ErrorStore.emitChange();
        }
    };
    var d1 = $.Deferred(); //eslint-disable-line new-cap
    // setUrl(window.serverUrl);
    // setUrl(window.location.origin);
    // let loginToken = Client4.getLocalStorageToken();
    emitInitialLoad(() => {
        d1.resolve();
    });

    // getClientConfig()(store.dispatch, store.getState).then(
    //     (config) => {
    //         global.window.mm_config = config || {};
    //         global.window.mm_config.SiteName = '吉视E通';
    //         d1.resolve();
    //     }
    // );
    $.when(d1).done(() => {
        callwhendone();
    });
}

function renderRootComponent() {
    ReactDOM.render((
        <Provider store={store}>
            <Router
                history={browserHistory}
                routes={rRoot}
            />
        </Provider>
    ),
    document.getElementById('root'));
}

global.window.setup_root = () => {
    // Do the pre-render setup and call renderRootComponent when done
    preRenderSetup(renderRootComponent);
};
