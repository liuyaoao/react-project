import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Badge, List, InputItem,TextareaItem,
  Flex,Picker,Button,NavBar,Radio,WhiteSpace,Toast} from 'antd-mobile';
import { Icon} from 'antd';
// import { createForm } from 'rc-form';
//阅文意见
const docFileStatusMap = {1:"草稿箱", 10:"待办", 8:"已发布", 2:"办理中",
        4:"已定稿"};
class CommonRehandleComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        callbacklist:[],
        nodeunids:'',
        callbacklistCheckedArr:[], //
      };
  }
  componentWillMount(){
    if(this.props.docunid){
      OAUtils.getCallBackList({
        tokenunid:this.props.tokenunid,
        fsid:this.props.fsid,
        successCall: (data)=>{
          console.log("获取回收重办列表数据：",data);
          let arr = data.values.callbacklist||[];
          let tempArr = [];
          for(let i=0;i<arr.length;i++){
            tempArr.push(false);
          }
          this.setState({
            callbacklist:arr,
            callbacklistCheckedArr:tempArr,
          });
        }
      });
    }
  }

  onClickSave = ()=>{
    let nodeunids = [];
    this.state.callbacklistCheckedArr.map((isChecked,index)=>{
      if(isChecked){
        nodeunids.push(this.state.callbacklist[index]['unid']);
      }
    });
    if(nodeunids.length<=0){
      Toast.info("请先选择一个可回收重办的流程！",2);
      return;
    }
    OAUtils.doCallBack({
      tokenunid:this.props.tokenunid,
      fsid:this.props.fsid,
      nodeunids:nodeunids.join(','),
      successCall: (data)=>{
        // console.log("save--签报管理的阅文意见:",data);
        Toast.info("回收成功！",2);
        this.onNavBarLeftClick();
        this.props.editSaveSuccCall && this.props.editSaveSuccCall();
      },
      errorCall:(err)=>{
        Toast.info('回收失败,'+err.ErrorText||'', 2);
        this.onNavBarLeftClick();
      }
    });
  }
  onNavBarLeftClick = (e) => {
    // this.setState({isHide:true});
    this.props.backDetailCall && this.props.backDetailCall();
    // setTimeout(()=>this.props.backDetailCall(),1000);
  }
  onClickEditItem = (item,index)=>{
    let {callbacklistCheckedArr} = this.state;
    callbacklistCheckedArr[index] = !callbacklistCheckedArr[index];
    this.setState({
      callbacklistCheckedArr
    });
  }
  render() {
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          >
          回收重办
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <WhiteSpace size='md'/>
          <div className="callbacklist_container">
          <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
            {
              this.state.callbacklist.map((item,index)=>(
                <List.Item key={index} className={'custom_listView_item'} multipleLine
                  onClick={ ()=>{ this.onClickEditItem(item,index) } }>
                  <div className={'list_item_container'}>
                    <div className={'list_item_middle'}>
                      <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{item.fileTitle}</div>
                      <div>所在部门：<span>{item.orgcommonname}</span></div>
                      <div>状态：<span>{docFileStatusMap[item.taskstate]||item.taskstate}</span></div>
                      <div style={{"position":"relative", "minHeight": "21px"}}>
                        <span style={{"position": "absolute"}}>操作：{item.nodename}</span>
                      </div>
                    </div>
                    <div className={'list_item_left'}>
                      <Radio className="my-radio callbacklist_radio" checked={this.state.callbacklistCheckedArr[index]}></Radio>
                    </div>
                    <div className={'list_item_right'}>
                      <div style={{position:'absolute',top:'0',right:'0'}}>{item.sendtime.split(" ")[0]}</div>
                      <div style={{ position:'absolute',bottom:'-1.5rem',right:'0' }}>{item.ownercommonname}</div>
                    </div>
                  </div>
                </List.Item>
              ))
            }
            </List>
            <div className={'bottom_btn_center'}>
              <Button type="primary" inline style={{ marginRight: '0.3rem' }} onClick={this.onClickSave}>确定</Button>
              <Button type="ghost" inline style={{}} onClick={this.props.backDetailCall}>取消</Button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

CommonRehandleComp.defaultProps = {
};

CommonRehandleComp.propTypes = {
};
// const CommonRehandleComp = createForm()(CommonRehandleComp);
export default CommonRehandleComp;
