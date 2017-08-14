
import jquery from 'jquery';
import React from 'react';
import Mock from 'mockjs';
import { Tabs, Table, Icon, Tooltip } from 'antd';
const TabPane = Tabs.TabPane;

import '../less/VPortContentPanel.less';

export default class VPortContentPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          active_topTab:1,
          remoteRouerList: []
        }
    }

    componentDidMount() {
        // jquery.ajax({
        //     url:'getTableData'
        // })
        // .done(function(res) {
        //     let data = JSON.parse(res);
        //     // 需要绑定this
        //     this.setState({
        //         tData:data.data
        //     })
        // }.bind(this))
    }

    onTabChanged=(val)=>{
      console.log("setting panel tab 改变了--：",val);
      this.setState({
        active_topTab:val,
      });
    }

    render() {

        // 设置列
        const columns = [{
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '性别',
          dataIndex: 'sex',
          key: 'sex',
        }, {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        }, {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          render: (text) => ( <a href={text} target="_blank">{text}</a> )
        }, {
          title: '操作',
          dataIndex: 'handle',
          key: 'handle',
          // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
          render:
            (t,r,i) => (
                <span>
                    <Tooltip title="编辑"><Icon type="edit" style={{color:'#3dbd7d'}} /></Tooltip>&nbsp;&nbsp;
                    <Tooltip title="切换性别"><Icon type="retweet" style={{color:'#49a9ee'}} /></Tooltip>&nbsp;&nbsp;
                    <Tooltip title="删除"><Icon type="delete" style={{color:'#FD5B5B'}}/></Tooltip>
                </span>
            )
        }];

        return (
            <div className={'vPort_content'}>
              <Tabs onChange={this.onTabChanged} type="card">
                <TabPane tab="Tab 1" key="1">
                  <Table style={{width:'98%',margin:'0 auto'}}
                      size={'small'}
                      dataSource={this.state.remoteRouerList}
                      columns={columns}
                      pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
              </Tabs>
            </div>
        )
    }
}
