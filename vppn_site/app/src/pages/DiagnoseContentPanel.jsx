
import jquery from 'jquery';
import React from 'react';
import {  Tabs,Table,Pagination, Input, Button, notification} from 'antd';
const TabPane = Tabs.TabPane;

import '../less/DiagnoseContentPanel.less'
//诊断页面
export default class DiagnoseContentPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          columns:[],
          routeringList: [],
        }
    }
    componentWillMount(){
      const columns = [{
        title: 'Target',
        dataIndex: 'target'
      }, {
        title: 'Mask',
        dataIndex: 'mask'
      }, {
        title: 'Gateway',
        dataIndex: 'gateway'
      }];
      this.setState({columns:columns});
      // this.getServerRouteringData();
    }
    getServerRouteringData = ()=>{
      //TODO.
    }

    render() {

        return (
            <div className={'diagnose_content'}>
              <h2>Routering Table:</h2>
              <Table style={{width:'98%',margin:'0 auto'}}
                size={'small'}
                columns={this.state.columns}
                showHeader={true}
                dataSource={this.state.routeringList}
                pagination={{ pageSize: 10 }}/>
            </div>
        );
    }
}
