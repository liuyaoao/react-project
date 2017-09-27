import * as RouteUtils from 'routes/route_utils.jsx';

export default {
    path: 'office_automation', //OA系统页面
    // onEnter: preLoginOASystem,
    indexRoute: {onEnter: (nextState,replace, callback)=>{
      replace('/office_automation/todo_list');
      callback();
    }},
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
                    },
                    childRoutes:[
                      {
                        path: 'dispatch_detail', //发文管理的详情页
                        // onEnter: onChannelEnter,
                        getComponents: (location, callback) => {
                          System.import('pages/office_automation/dispatch/ds_detail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                        }
                      },
                      {
                        path: 'signReport_detail', //签报管理的详情页
                        // onEnter: onChannelEnter,
                        getComponents: (location, callback) => {
                          System.import('pages/office_automation/signReport/signReportDetail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                        }
                      },
                      {
                        path: 'supervision_detail', //督办管理的详情页
                        // onEnter: onChannelEnter,
                        getComponents: (location, callback) => {
                          System.import('pages/office_automation/supervision/superviseDetail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                        }
                      }
                    ]
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
                    },
                    childRoutes:[
                      {
                        path: 'detail', //发文管理的详情页
                        // onEnter: onChannelEnter,
                        getComponents: (location, callback) => {
                          System.import('pages/office_automation/dispatch/ds_detail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                        }
                      }
                    ]
                },
                {
                  path: 'sign_report',  //签报管理
                  // onEnter: onPermalinkEnter,
                  getComponents: (location, callback) => {
                    System.import('pages/office_automation/signReport/signReportList.jsx').then(RouteUtils.importComponentSuccess(callback));
                  },
                  childRoutes:[
                    {
                      path: 'detail', //签报管理的详情页
                      // onEnter: onChannelEnter,
                      getComponents: (location, callback) => {
                        System.import('pages/office_automation/signReport/signReportDetail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                      }
                    }
                  ]
                },
                {
                    path: 'supervision', //督办管理
                    // onEnter: onPermalinkEnter,
                    getComponents: (location, callback) => {
                        System.import('pages/office_automation/supervision/superviseList.jsx').then(RouteUtils.importComponentSuccess(callback));
                    },
                    childRoutes:[
                      {
                        path: 'detail', //督办管理的详情页
                        // onEnter: onChannelEnter,
                        getComponents: (location, callback) => {
                          System.import('pages/office_automation/supervision/superviseDetail_comp.jsx').then(RouteUtils.importComponentSuccess(callback));
                        }
                      }
                    ]
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
};
