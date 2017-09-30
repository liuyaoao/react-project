//发文管理--新建
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
import moment from 'moment';

class DS_AddContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        dzTitle: "长沙市司法局文件",
        gwlc_value:'', //公文流程
        mj_value:'', //密级
        jjcd_value:'', //缓急
      };
  }
  componentWillMount(){
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.newAdding && !this.props.newAdding){ //点击了保存按钮了。
      this.addNewSave();
    }
    if(nextProps.formData.gwlc != this.props.formData.gwlc){
      this.setState({
        gwlc_value:nextProps.formData.gwlc
      });
    }
  }
  addNewSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['gwlc'] = this.state.gwlc_value;
    tempFormData['mj'] = this.state.mj_value;
    tempFormData['jjcd'] = this.state.jjcd_value;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.formData.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("新建-发文管理的返回表单数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.afterAddNewCall(formData);
        Toast.info('新建保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('新建保存失败!!', 1);
      }
    });
  }

  onPickerGWLCOk = (val)=>{ //选择 公文流程
    console.log("onPickerGWLCOk--:",val);
    this.setState({gwlc_value:val[0]});
  }
  onPickerSecrecyTypeOk = (val)=>{ //选择 密级
    console.log("onPickerSecrecyTypeOk--:",val);
    this.setState({mj_value:val[0]});
  }
  onPickerUrgencyTypeOk = (val)=>{ //选择 缓急
    console.log("onPickerUrgencyTypeOk--:",val);
    this.setState({jjcd_value:val[0]});
  }

  handleChange = (value)=> {
    if(value === "1"){
      //发文
      this.props.changeDispatchTypeCall("发文");
      this.setState({
        dzTitle: "长沙市司法局文件",
      });
      $("#FGYJ").show();
      $("#HG").show();
      $("#JZYJ").show();
      $("#FW").show();
      $("#LDFW").hide();
    }else if(value === "2"){
      //领导小组发文
      this.props.changeDispatchTypeCall("领导小组发文");
      this.setState({
        dzTitle: "领导小组文件(稿纸)",
      });
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").show();
      $("#FW").hide();
      $("#LDFW").show();
    }else if(value === "3"){
      //领导小组办公室发文
      this.props.changeDispatchTypeCall("领导小组办公室发文");
      this.setState({
        dzTitle: "领导小组办公室文件(稿纸)",
      });
      $("#FGYJ").hide();
      $("#HG").hide();
      $("#JZYJ").hide();
      $("#FW").hide();
      $("#LDFW").show();
    }
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const {gwlc_value, mj_value, jjcd_value} = this.state;
    let {formData,formDataRaw} = this.props;

    let secrecyItems = formDataRaw.mj?formDataRaw.mj.items:[];
    let secrecyType = secrecyItems.map((item)=>{ //密级
      return {
        label:item.text,
        value:item.value
      }
    });
    let urgencyItems = formDataRaw.jjcd?formDataRaw.jjcd.items:[];
    let urgencyType = urgencyItems.map((item)=>{ //缓急
      return {
        label:item.text,
        value:item.value
      }
    });
    //公文流程当前值就是gwlc字段的值。--公文流程。
    let items = formDataRaw.gwlc?formDataRaw.gwlc.items:[];
    let fileFlowTypes = items.map((item)=>{ //公文流程。
      return {
        label:item.text,
        value:item.value
      }
    });

    return (
      <div style={{marginBottom: "100px"}}>
        <div style={{marginLeft:"0.1rem"}}>请选择您要起草的发文类型:</div>
        <Select defaultValue="1"
          onChange={this.handleChange}
          style={{margin:"0.16rem",width:'96%'}} id="dsType">
          <Select.Option value="1">发文</Select.Option>
          <Select.Option value="2">领导小组发文</Select.Option>
          <Select.Option value="3">领导小组办公室发文</Select.Option>
        </Select>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{this.state.dzTitle}</div>
          <Flex>
            <Flex.Item><InputItem editable={false} labelNumber={3} {...getFieldProps('fwwh')} >文号：</InputItem></Flex.Item>
            <Flex.Item>
              <InputItem placeholder="请输入..." {...getFieldProps('fs')} labelNumber={3} type="Number">份数：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecyType} cols={1}
                  value={[mj_value]}
                  onOk={this.onPickerSecrecyTypeOk}>
                  <List.Item arrow="horizontal">密级：</List.Item>
                </Picker>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className="select_container">
                <Picker data={urgencyType} cols={1}
                  value={[jjcd_value]}
                  onOk={this.onPickerUrgencyTypeOk} >
                  <List.Item arrow="horizontal">缓急</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'}>标题：</div>
              <TextareaItem
                {...getFieldProps('wjbt')}
                title=""
                rows={3}
                placeholder="请输入..."
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>主送：</div>
              <TextareaItem
                {...getFieldProps('zsdw')}
                rows={3}
                placeholder="请输入..."
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>抄送：</div>
              <TextareaItem
                {...getFieldProps('csdw')}
                rows={3}
                placeholder="请输入..."
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={fileFlowTypes} cols={1}
                  value={[gwlc_value]}
                  onOk={this.onPickerGWLCOk}>
                  <List.Item arrow="horizontal">公文流程</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={5}>领导签发：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={5}>传批意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <InputItem editable={false} value="--" labelNumber={7}>局长审核意见：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <InputItem editable={false} value="--" labelNumber={7}>分管领导意见：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem editable={false} value="--" labelNumber={8}>处室负责人意见：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <InputItem editable={false} value="--" labelNumber={3}>核稿：</InputItem>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem value={formData.zbbm_show}
                editable={false}
                labelNumber={5}>拟稿单位：
              </InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem value={formData.ngr_show}
                editable={false}
                labelNumber={4}>拟稿人：
              </InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem value={formData.ngrq_show}
                editable={false}
                labelNumber={5}>拟稿日期：
              </InputItem>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}

DS_AddContentComp.defaultProps = {
};
DS_AddContentComp.propTypes = {
};
export default createForm()(DS_AddContentComp);
