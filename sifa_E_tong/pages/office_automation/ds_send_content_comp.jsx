//发文详情页-- 发送
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { SearchBar, Tabs, Button, List, Flex, Switch } from 'antd-mobile';
import { Icon } from 'antd';
import { createForm } from 'rc-form';
import DS_DepartmentComp from './ds_department_comp.jsx';//发文详情页-- 查看流程

const TabPane = Tabs.TabPane;

class DS_SendContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        showDepartment: false
      };
  }

  onChange = (val) => {
    console.log(val);
  }

  onClickSend = () => {
    this.props.backDetailCall();
  }

  onClickShowDepartment = () => {
    this.setState({showDepartment: true});
  }

  render() {
    const data = [
     { value: 0, label: '李喆' },
     { value: 1, label: '邓双红' },
     { value: 2, label: '赖涛生' },
     { value: 3, label: '陈林' },
     { value: 4, label: '王剑' },
     { value: 5, label: '赵兴' },
     { value: 6, label: '王文' },
     { value: 7, label: '杨昌励' },
     { value: 8, label: '尹光宇' },
     { value: 9, label: '简洁' },
     { value: 10, label: '李煜明' },
     { value: 11, label: '张记' },
     { value: 12, label: '付利军' },
     { value: 13, label: '任宇' },
     { value: 14, label: '郭政权' },
     { value: 15, label: '邓红' },
     { value: 16, label: '高建湘' },
     { value: 17, label: '向良军' }
   ];
    const { getFieldProps } = this.props.form;
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem"}}>
        {!this.state.showDepartment? (
          <Tabs defaultActiveKey="tab1">
            <TabPane tab="处室负责人审核" key="tab1">
                <div className="flex-container">
                  <div className="sub-title">
                    <h5 className="pull-left">长沙市司法局</h5>
                    <Button className="btn pull-right" inline size="small" type="primary" onClick={this.onClickShowDepartment}>按部门</Button>
                  </div>
                  <div className="searchBar_custom">
                    <SearchBar placeholder="搜索" />
                  </div>
                  <div className="checkbox_list">
                    {data.map(i => (
                      <div key={i.value} className="checkbox_custom">
                        <input type="checkbox" id={i.value} className="checkbox" />
                        <label htmlFor={i.value}><span className="box"><i></i></span>{i.label}</label>
                      </div>
                    ))}
                  </div>
                  <div className="switch_custom">
                    <List.Item
                      extra={<Switch
                        {...getFieldProps('Switch1', {
                          initialValue: true,
                          valuePropName: 'checked',
                        })}
                        onClick={(checked) => { console.log(checked); }}
                      />}
                    >网络消息</List.Item>
                  </div>
                  <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
                </div>
            </TabPane>
            <TabPane tab="办公室" key="tab2">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>

              </div>
            </TabPane>
          </Tabs>
        ):null}
        {this.state.showDepartment? (<DS_DepartmentComp backSendContentCall={()=>this.onBackSendContentCall()} isShow={true}/>):null}
      </div>
    )
  }
}

DS_SendContentComp.defaultProps = {
};

DS_SendContentComp.propTypes = {
  onBackDetailCall:React.PropTypes.func
};


export default createForm()(DS_SendContentComp);
