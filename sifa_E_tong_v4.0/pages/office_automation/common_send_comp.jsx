import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';
import * as addressBookUtils from 'pages/utils/addressBook_utils.jsx';
import { Button,Tabs, List, Switch,Toast,InputItem,
  TextareaItem,Flex} from 'antd-mobile';
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
        checkedPersonNames:[], //选中的要发送的人员的用户名列表
        checkedPersonPhones:[], //选中的要发送的人员的手机号列表
        networkMsg:false, //是否勾选发送网络消息
        phoneMsg:false, //是否勾选发送手机短信
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
        // console.log("get 发文管理的发送的流程和人员信息数据:",data);
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
    this.sendTelephoneMessage();
  }
  sendTelephoneMessage(){ //发送手机短信
    if(!this.state.phoneMsg || this.state.checkedPersonPhones.length<=0){ return;}
    let tempFormData = this.props.form.getFieldsValue();
    MyWebClient.sendTelephoneMessage({
      "destaddr" : this.state.checkedPersonPhones.join(';'),
      "messagecontent" : "标题："+this.props.fileTitle+";  内容："+tempFormData.messagecontent
    },(data)=>{
      // let parseData = (typeof data == "string")? JSON.parse(data):{};
      console.log("sendTelephoneMessage---response-----:",data);
      // Toast.info('发送成功!', 2);
      // data = data.replace(/%20/g, " ");
      // let res = JSON.parse(data);
      // if(res.code == "1"){
      //   successCall && successCall(res);
      // }else{
      //   errorCall && errorCall(res);
      // }
    },null);
  }
  onPersonCheckChanged = (evt)=>{  //当选中人员有变动时
    let checkedList = $(".checkbox_list .checkbox_"+this.state.activeTabkey+":checked");
    let checkedNames = [];
    checkedList.each((index,ele)=>{
      checkedNames.push($(ele).data("commonname"));
    });
    // console.log("onPersonCheckChanged:",$(evt.target).is(':checked'),checkedList,checkedNames);
    this.setState({checkedPersonNames:checkedNames});
    if(checkedNames.length<=0){
      this.setState({checkedPersonPhones:[]});
      return;
    }
    MyWebClient.getContactsByUserNames(checkedNames.join(','),(data,res)=>{  //获取选中的人员的手机号码。
      let parseData = JSON.parse(res.text);
      let objArr = data||[];
      console.log("getContactsByUserNames---response---:",data);
      let personPhoneArr = objArr.map((item)=>{
        return item.telephoneNumber;
      });
      this.setState({checkedPersonPhones:personPhoneArr});
    },null);
  }
  onSendPhoneChanged = (val)=>{
    val = val.replace(/;/g, ',');
    val = val.replace(/；/g, ',');
    val = val.replace(/，/g, ',');
    val = val.replace(/。/g, ',');
    // val = val.replace(/./g, ',');
    this.setState({
      checkedPersonPhones:val.split(',')
    });
  }

  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
    });
  }
  onClickCheckedMsgType = (checked,msgType)=>{ //选择某一种发送消息类型
    if(msgType == "networkMsg"){
      this.setState({networkMsg:checked});
    }else if(msgType == "phoneMsg"){
      this.setState({phoneMsg:checked});
    }
  }

  render() {
    let {flowBranch2PersonMap, flowBranchList} = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="oa_send_container" style={{minHeight:"5rem",padding:"0.2rem",marginBottom:'1em'}}>
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
                          <input type="checkbox"
                            id={person.unid}
                            data-commonname={person.commonname}
                            data-unid={person.unid}
                            onChange={this.onPersonCheckChanged}
                            className={"checkbox_"+k.value} />
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
              {...getFieldProps('networkMsg', {
                initialValue: false,
                valuePropName: 'checked',
              })}
              onClick={(checked) => { this.onClickCheckedMsgType(checked,"networkMsg"); }}
            />}
          >网络消息</List.Item>
          <List.Item
            extra={<Switch
              {...getFieldProps('phoneMsg', {
                initialValue: false,
                valuePropName: 'checked',
              })}
              onClick={(checked) => { this.onClickCheckedMsgType(checked,"phoneMsg"); }}
            />}
          >手机短信</List.Item>
        </div>
        {
          this.state.phoneMsg?
          (<div>
            <Flex>
              <Flex.Item>
                <div style={{margin:'0.2rem 0 0 0.2rem',color:'black',fontSize: '0.34rem'}}>收件人：</div>
                <TextareaItem
                  title=""
                  placeholder={''}
                  rows={2}
                  labelNumber={0}
                  value={this.state.checkedPersonNames.join(',')}
                />
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <div style={{margin:'0.2rem 0 0 0.2rem',color:'black',fontSize: '0.34rem'}}>电话号码：<span style={{color:'red',fontSize:'0.28rem'}}>(*多个号码以逗号','隔开)</span></div>
                <TextareaItem
                  {...getFieldProps('destaddr')}
                  title=""
                  placeholder={''}
                  rows={2}
                  labelNumber={0}
                  onChange={this.onSendPhoneChanged}
                  value={this.state.checkedPersonPhones.join(',')}
                />
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <div style={{margin:'0.2rem 0 0 0.2rem',color:'black',fontSize: '0.34rem'}}>主题：</div>
                <TextareaItem
                  title=""
                  placeholder={''}
                  rows={2}
                  labelNumber={0}
                  value={this.props.fileTitle}
                />
              </Flex.Item>
            </Flex>
            <Flex>
              <Flex.Item>
                <div style={{margin:'0.2rem 0 0 0.2rem',color:'black',fontSize: '0.34rem'}}>短信内容：</div>
                <TextareaItem
                  {...getFieldProps('messagecontent')}
                  title=""
                  placeholder={''}
                  rows={4}
                  labelNumber={0}
                />
              </Flex.Item>
            </Flex>
          </div>):null
        }
        <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
      </div>
    )
  }
}

CommonSendComp.defaultProps = {
};

CommonSendComp.propTypes = {
};

export default createForm()(CommonSendComp);
