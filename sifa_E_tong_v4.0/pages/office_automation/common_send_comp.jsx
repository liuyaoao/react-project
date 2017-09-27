import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Button,Tabs, List, Switch,Toast} from 'antd-mobile';
import { Icon} from 'antd';
import { createForm } from 'rc-form';
const TabPane = Tabs.TabPane;
//发送组件，各个模块公用。
class CommonSendComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        showDepartment: false,
        flowBranchList:[], //流程分支列表
        flowBranch2PersonMap:{}, //流程分支对应的人员列表
        activeTabkey:'',
      };
  }
  componentWillMount(){
    if(this.props.docunid){
      this.getServerSendInfo();
    }
  }
  getServerSendInfo = ()=>{
    OAUtils.getFlowSendInfo({
      tokenunid:this.props.tokenunid,
      modulename:this.props.modulename,
      docunid:this.props.docunid,
      otherssign:this.props.otherssign,
      gwlcunid:this.props.gwlcunid,
      successCall: (data)=>{
        console.log("get 发文管理的发送的流程和人员信息数据:",data);
        this.formatServerSendInfo(data.values['lcfzs']); //解析流程分支数据
      }
    });
  }

  formatServerSendInfo = (flowBranchs)=>{
    let flowBranch2PersonMap = {};
    let flowBranchList = flowBranchs.map((item)=>{
      flowBranch2PersonMap[item.value] = item.persons;
      return {
        label:item.name,
        value:item.value
      }
    });
    console.log("flowBranchList--:",flowBranchList);
    console.log("flowBranch2PersonMap--:",flowBranch2PersonMap);
    this.setState({
      activeTabkey:flowBranchList[0]['value'],
      flowBranch2PersonMap,
      flowBranchList,
    });
  }

  onChange = (val) => {
    console.log(val);
  }

  onClickSend = () => {
    //保存发送的信息 并且返回到详情页
    let checkedList = $(".checkbox_list .checkbox_"+this.state.activeTabkey+":checked");
    let personunids = {name: this.state.activeTabkey, persons:[]};
    checkedList.each((index,ele)=>{
      personunids.persons.push(ele.id);
    });
    if(personunids.persons.length<=0){
      Toast.info("请先选择发送人员！",2);
      return;
    }
    personunids.persons = personunids.persons.join(',');
    this.saveFlowSendInfo(personunids);
  }
  saveFlowSendInfo = (personunids)=>{ //保存发送的信息
    OAUtils.saveFlowSendInfo({
      tokenunid:this.props.tokenunid,
      docunid: this.props.docunid,
      gwlcunid:this.props.gwlcunid,
      modulename:this.props.modulename,
      title: this.props.fileTitle || '',
      message: 1,  //提示方式，1为网络消息，2为手机短信
      personunids: [personunids],
      successCall: (data)=>{
        // console.log("发送成功:",data);
        Toast.info('发送成功!', 2);
        this.props.onBackToDetailCall();
      },
      errorCall:(data)=>{
        Toast.info('发送失败!', 1);
        this.props.onBackToDetailCall();
      }
    });
  }

  // onClickShowDepartment = () => {
  //   this.setState({showDepartment: true});
  // }

  // onBackSendContentCall = () => {
  //   this.setState({showDepartment: false});
  // }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
    });
  }

  render() {
    let {flowBranch2PersonMap, flowBranchList} = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem",marginBottom:'1em'}}>
        {!this.state.showDepartment? (
          <Tabs
            defaultActiveKey={this.state.activeTabkey}
            activeKey={this.state.activeTabkey}
            pageSize={3}
            onTabClick={this.handleTabClick}
            swipeable={false}>
            {flowBranchList.map((k,index) => (
              <TabPane tab={k.label} key={k.value}>
                  <div className="flex-container">
                    <div className="sub-title">
                      <h5 className="pull-left">人员列表：</h5>
                    </div>
                    <div className="checkbox_list">
                      {flowBranch2PersonMap[k.value] && flowBranch2PersonMap[k.value].map(person => (
                        <div key={person.unid} className="checkbox_custom">
                          <input type="checkbox" id={person.unid} data-unid={person.unid} className={"checkbox_"+k.value} />
                          <label htmlFor={person.unid}><span className="box"><i></i></span>{person.commonname}</label>
                        </div>
                      ))}
                    </div>

                  </div>
              </TabPane>
            ))}
          </Tabs>
        ):null}
        <div className="switch_custom">
          <List.Item
            extra={<Switch
              {...getFieldProps('message_1', {
                initialValue: false,
                valuePropName: 'checked',
              })}
              onClick={(checked) => { console.log(checked); }}
            />}
          >网络消息</List.Item>
          <List.Item
            extra={<Switch
              {...getFieldProps('message_2', {
                initialValue: false,
                valuePropName: 'checked',
              })}
              onClick={(checked) => { console.log(checked); }}
            />}
          >手机短信</List.Item>
        </div>
        <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>

        {/*this.state.showDepartment? (<DS_DepartmentComp backSendContentCall={()=>this.onBackSendContentCall()} isShow={true}/>):null*/}
      </div>
    )
  }
}

CommonSendComp.defaultProps = {
};

CommonSendComp.propTypes = {
};

export default createForm()(CommonSendComp);
