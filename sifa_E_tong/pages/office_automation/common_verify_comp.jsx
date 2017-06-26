import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import { Badge, List, InputItem,TextareaItem,Flex,Picker,Button,NavBar} from 'antd-mobile';
import { Icon} from 'antd';
import { createForm } from 'rc-form';
//阅文意见
class CommonVerifyCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"verify",
        isHide:false,
        verifyCnt:'',//审核意见的内容。
      };
  }
  componentWillMount(){
  }
  onPickerOk = (val)=>{
    console.log("onPickerOk:",val);
  }
  onPickerOkPlease = (val)=>{ //选择请的方式
    this.setVerifyCnt2Arr(0,val);
  }
  onPickerOkDepartment = (val)=>{ //选择好部门
    this.setVerifyCnt2Arr(1,val);
  }
  onPickerOkMembers = (val)=>{ //选择好人员
    this.setVerifyCnt2Arr(2,val);
  }
  onPickerOkStatus = (val)=>{ //选择好状态
    this.setVerifyCnt2Arr(3,val);
  }
  setVerifyCnt2Arr = (index,val)=>{
    let {verifyCnt} = this.state;
    if(index == 0){
      verifyCnt += val;
    }else if(index == 3){
      verifyCnt += val+"。";
    }else{
      verifyCnt += "-"+val;
    }
    this.setState({
      verifyCnt:verifyCnt,
    });
  }
  onVerifyCntChange = (val)=>{
    console.log("onVerifyCntChange:",val);
    this.setState({
      verifyCnt:val,
    });
  }
  onClickSave = ()=>{

  }
  onNavBarLeftClick = (e) => {
    // this.setState({isHide:true});
    this.props.backDetailCall();
    // setTimeout(()=>this.props.backDetailCall(),1000);
  }
  render() {
    const { getFieldProps } = this.props.form;
    let owerDepartTypes = [
      {
        label:"148中心",
        value:"148中心"
      },{
        label:"市律师协会",
        value:"市律师协会"
      }
    ];
    let departmentTypes = [
      {
        label:"司法局",
        value:"司法局"
      },{
        label:"司法局2",
        value:"司法局2"
      }
    ];
    let adviseTypes = [
      {
        label:"部门意见",
        value:"部门意见"
      },{
        label:"领导意见",
        value:"领导意见"
      }
    ];
    let pleaseTypes = [
      {
        label:"请",
        value:"请"
      },{
        label:"有请",
        value:"有请"
      },{
        label:"拟请",
        value:"拟请"
      },{
        label:"转请",
        value:"转请"
      }

    ];
    let members= [{ //人员信息
      label:"张三",
      value:"张三"
    },{
      label:"李四",
      value:"李四"
    }];
    let statusTypes= [{ //审核状态
      label:"审签",
      value:"审签"
    },{
      label:"会签",
      value:"会签"
    },{
      label:"同意",
      value:"同意"
    }];
    let clsName = this.props.isShow && !this.state.isHide?
    'oa_detail_container ds_detail_container oa_detail_container_show':
    'oa_detail_container ds_detail_container oa_detail_container_hide';
    // <div>文字意见</div>
    // rightContent={[
    //   <Icon key={1} type="save" onClick={this.onClickSave}/>,
    //   <span key={2} onClick={this.onClickSave}>保存</span>
    // ]}
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          >
          阅文意见
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <div>
            <List style={{ backgroundColor: 'white' }}>
              <Picker data={owerDepartTypes} cols={1} {...getFieldProps('owerDepart')} onOk={this.onPickerOk}>
                <List.Item arrow="horizontal">所属部门</List.Item>
              </Picker>
              <Picker data={adviseTypes} cols={1} {...getFieldProps('advise')} onOk={this.onPickerOk}>
                <List.Item arrow="horizontal">意见类型</List.Item>
              </Picker>
            </List>
            <div style={{height:'1.5em',background:'#f3eeee'}}></div>
            <List style={{ backgroundColor: 'white' }}>
              <Picker data={pleaseTypes} cols={1} {...getFieldProps('please')} onOk={this.onPickerOkPlease}>
                <List.Item arrow="horizontal"><Badge size="small" text="1"/>请</List.Item>
              </Picker>
              <Picker data={departmentTypes} cols={1} {...getFieldProps('department')} onOk={this.onPickerOkDepartment}>
                <List.Item arrow="horizontal"><Badge size="small" text="2"/>部门</List.Item>
              </Picker>
              <Picker data={members} cols={1} {...getFieldProps('members')} onOk={this.onPickerOkMembers}>
                <List.Item arrow="horizontal"><Badge size="small" text="3"/>人员</List.Item>
              </Picker>
              <Picker data={statusTypes} cols={1} {...getFieldProps('status')} onOk={this.onPickerOkStatus}>
                <List.Item arrow="horizontal"><Badge size="small" text="4"/>状态</List.Item>
              </Picker>
            </List>
            <Flex>
              <Flex.Item>
                <TextareaItem
                  className={'verifyContent'}
                  title=""
                  clear
                  value={this.state.verifyCnt}
                  autoHeight
                  onChange={this.onVerifyCntChange}
                  labelNumber={0}
                />
              </Flex.Item>
            </Flex>
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

CommonVerifyCompRaw.defaultProps = {
};

CommonVerifyCompRaw.propTypes = {
};
const CommonVerifyComp = createForm()(CommonVerifyCompRaw);
export default CommonVerifyComp;
