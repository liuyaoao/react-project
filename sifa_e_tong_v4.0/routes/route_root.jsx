// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as RouteUtils from 'routes/route_utils.jsx';

import AppRoot from 'pages/app_root.jsx';

import ErrorStore from 'stores/error_store.jsx';

import {browserHistory} from 'react-router/es6';
import * as Utils from 'utils/utils.jsx';

function preLogin(nextState, replace, callback) {
  const localStoreTokenName = 'sameview_login_token_key'; //记录是否已经登录的token的名字。
  // if(Utils.isMobile() && nextState.location.pathname != '/address_book_mobile'){
  //   replace('/address_book_mobile');
  // }else if(!Utils.isMobile() && nextState.location.pathname == '/address_book_mobile'){
  //   replace('/address_book');
  // }
  callback();
}

function preEnterAddressBook(nextState, replace, callback){ //进入通讯录的预处理
  // console.log("preEnterAddressBook:",nextState,Utils.isMobile());
  if(Utils.isMobile() && nextState.location.pathname != '/address_book_mobile'){
    replace('/address_book_mobile');
  }else if(!Utils.isMobile() && nextState.location.pathname == '/address_book_mobile'){
    replace('/address_book');
  }
  callback();
}
function preEnterDocument(nextState, replace, callback){ //进入文档管理的预处理
  // console.log("preEnterDocument:",nextState,Utils.isMobile());
  if(Utils.isMobile() && nextState.location.pathname != '/document_mobile'){
    replace('/document_mobile');
  }else if(!Utils.isMobile() && nextState.location.pathname == '/document_mobile'){
    replace('/document');
  }
  callback();
}
function preEnterLoginRecord(nextState, replace, callback){ //进入登录签到页面的预处理
  if(Utils.isMobile() && nextState.location.pathname != '/login_record_mobile'){
    replace('/login_record_mobile');
  }else if(!Utils.isMobile() && nextState.location.pathname == '/login_record_mobile'){
    replace('/login_record');
  }
  callback();
}

// function preLoginOASystem(nextState,replace,callback){
//
// }
function selectOAModule(nextState,replace, callback){
  replace('/office_automation/todo_list');
  callback();
}
function preEnterMainRoot(nextState,replace, callback){
  // console.log("preEnterMainRoot:",nextState);
  if (nextState.location.pathname === '/') {
      if (localStorage.getItem(window.localStoreTokenName)) {
          replace('/modules');
      }else {
          replace('/login');
      }
  }else{
    if(!localStorage.getItem(window.localStoreTokenName) && nextState.location.pathname !== '/login'){
      replace('/login');
    }
  }
  callback();
}

export default {
    path: '/',
    onEnter: preEnterMainRoot,
    component: AppRoot,
    getChildRoutes: RouteUtils.createGetChildComponentsFunction(
        [
            {
                path: 'modules',  //模块展示页面
                getComponents: (location, callback) => {
                    System.import('pages/modules_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'address_book', //电子通讯录页面
                onEnter: preEnterAddressBook,
                getComponents: (location, callback) => {
                    System.import('pages/addressBook_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'address_book_mobile', //电子通讯录页面
                onEnter: preEnterAddressBook,
                getComponents: (location, callback) => {
                    System.import('pages/addressbook/addressBook_mobile_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'document',  //档案管理页面-pc端
                onEnter: preEnterDocument,
                getComponents: (location, callback) => {
                    System.import('pages/document_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'document_mobile',  //档案管理页面-移动端
                onEnter: preEnterDocument,
                getComponents: (location, callback) => {
                    System.import('pages/document_mobile/document_mobile_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'document_mobile/detail/:id',  //档案管理页面-移动端
                getComponents: (location, callback) => {
                    System.import('pages/document_mobile/document_detail_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'office_automation', //OA系统页面
                // onEnter: preLoginOASystem,
                indexRoute: {onEnter: selectOAModule},
                childRoutes: [
                    {
                        getComponents: (location, callback) => {
                            System.import('pages/officeAutomation_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                        },
                        childRoutes: [
                            {
                                path: 'todo_list', //待办事项
                                // onEnter: onChannelEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/personalTodoList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'incoming_list', //收文管理
                                // onEnter: onChannelEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/incomingList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'dispatch', // 发文管理
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/dispatch/dispatchList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                              path: 'sign_report',  //签报管理
                              // onEnter: onPermalinkEnter,
                              getComponents: (location, callback) => {
                                System.import('pages/office_automation/signReport/signReportList.jsx').then(RouteUtils.importComponentSuccess(callback));
                              }
                            },
                            {
                                path: 'supervision', //督办管理
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/supervision/superviseList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'new_dispatch', //最新发文
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/newDispatch/newDispatchList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'vehicle', //车辆管理
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/vehicle/vehicleList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'notice', //通知公告
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/notice/noticeList.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            },
                            {
                                path: 'administrative_system_infos', //司法行政系统信息查询
                                // onEnter: onPermalinkEnter,
                                getComponents: (location, callback) => {
                                    System.import('pages/office_automation/administrativeSystemInfos.jsx').then(RouteUtils.importComponentSuccess(callback));
                                }
                            }

                        ]
                    }
                ]
            },
            {
                path: 'login_record',   //登录签到 / 记录页面
                onEnter: preEnterLoginRecord,
                getComponents: (location, callback) => {
                    System.import('pages/loginRecord_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'login_record_mobile',   //登录签到 / 记录页面-- 移动端的
                onEnter: preEnterLoginRecord,
                getComponents: (location, callback) => {
                    System.import('pages/login_record/loginRecord_mobile_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'sys_config',  //系统设置页面
                getComponents: (location, callback) => {
                    System.import('pages/sysConfig_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'notification',  //矫正系统页面，就是通知公告。
                getComponents: (location, callback) => {
                    System.import('pages/notification_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                path: 'user_setting',  //矫正系统页面，就是通知公告。
                getComponents: (location, callback) => {
                    System.import('pages/userSetting_mobile_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                }
            },
            {
                getComponents: (location, callback) => {
                    // System.import('components/header_footer_template.jsx').then(RouteUtils.importComponentSuccess(callback));
                    System.import('pages/components/pages_footer_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                },
                getChildRoutes: RouteUtils.createGetChildComponentsFunction(
                    [
                        {
                            path: 'login',
                            onEnter: preLogin,
                            getComponents: (location, callback) => {
                                System.import('pages/login/login_page.jsx').then(RouteUtils.importComponentSuccess(callback));
                            }
                        }
                    ]
                )
            },
            {
                path: '*',
                onEnter: (nextState, replace) => {
                    replace({
                        pathname: 'error',
                        query: RouteUtils.notFoundParams
                    });
                }
            }
        ]
    )
};
