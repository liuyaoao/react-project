import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import UserStore from 'stores/user_store.jsx';
import { Toast, WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem, Flex, TabBar, Picker, List } from 'antd-mobile';

import { Icon, Upload } from 'antd';
import { createForm } from 'rc-form';
import CommonNotionComp from '../common/common_notion_comp.jsx';

class DS_DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        historyNotionType2List:[],
        uploadAttachmentUrl:'',  //上传公文附件的url.
        attachmentList:[],  //附件列表
        gwlc_value:'', //公文流程
        mj_value:'', //密级
        jjcd_value:'', //缓急
      };
  }
  componentWillMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
    if(this.props.detailInfo && this.props.detailInfo.unid){
      this.getFormVerifyNotion();
      this.getFormAttachmentList();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.formData.unid != this.props.formData.unid){
      this.setState({
        gwlc_value:nextProps.formData.gwlc || "",
        mj_value:nextProps.formData.mj || "",
        jjcd_value:nextProps.formData.jjcd || "",
      });
    }
    if(nextProps.editSaveTimes != this.props.editSaveTimes){ //点击了保存按钮了。
      this.editSave();
    }
  }
  editSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['gwlc'] = this.state.gwlc_value;
    tempFormData['mj'] = this.state.mj_value;
    tempFormData['jjcd'] = this.state.jjcd_value;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("保存-发文管理的表单数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.editSaveSuccCall(formData,data.values);
        Toast.info('修改保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('修改保存失败!!', 1);
      }
    });
  }
  getFormVerifyNotion = ()=>{ //获取历史阅文意见数据。
    OAUtils.getFormVerifyNotion({
      tokenunid:this.props.tokenunid,
      docunid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 发文管理的历史阅文意见:",data.values.notions);
        this.setState({
          historyNotionType2List:OAUtils.parseHistoryNotionList(data.values.notions || []),
        });
      },
      errorCall:(res)=>{
        //TODO
      }
    });
  }
  getFormAttachmentList = ()=>{
    OAUtils.getFormAttachmentList({
      tokenunid:this.props.tokenunid,
      docunid:this.props.detailInfo.unid,
      moduleName:this.props.moduleNameCn,
      successCall: (data)=>{
        console.log("get 发文管理的附件列表:",data);
        this.setState({
          attachmentList:data.values.filelist || [],
        });
      }
    });
  }
  getAttachmentListEle = (attachmentList)=>{
    return attachmentList.map((item,index)=>{
      let downloadUrl = OAUtils.getAttachmentUrl({
        fileunid:item.unid,
        moduleName:this.props.moduleNameCn
      });
      return (
        <div key={index} style={{marginLeft:'0.3rem'}}><a href={downloadUrl} data-unid={item.unid}>{item.attachname}</a><br/></div>
      );
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
  onFileUploadChange = (file)=>{
    this.setState({
      uploadAttachmentUrl:OAUtils.getUploadAttachmentUrl({
        docunid:this.props.detailInfo.unid,
        filename:file.name,
        moduleName:this.props.moduleNameCn
      })
    });
  }

  render() {
    const {attachmentList,mj_value,jjcd_value,gwlc_value} = this.state;
    const { detailInfo, formData, formDataRaw , tokenunid, modulename } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    let uploadProps = {
      name: 'inputName',
      action: this.state.uploadAttachmentUrl,
      showUploadList:false, //是否展示上传文件列表。
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload:(file,fileList)=>{
        this.onFileUploadChange(file);
        return true;
      },
      onChange:(info)=>{
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          Toast.info(`${info.file.name} 文件上传成功！`);
          this.getFormAttachmentList();
        } else if (info.file.status === 'error') {
          Toast.info(`${info.file.name} 文件上传失败！`);
        }
      }
    };
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
    let gwlc_val = gwlc_value || (formDataRaw.gwlc?formDataRaw.gwlc.value:'');
    return (
      <div style={{marginBottom: "60px"}}>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{formData.wjbt}</div>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={fileFlowTypes} cols={1}
                  disabled={false}
                  value={[gwlc_val]}
                  onOk={this.onPickerGWLCOk} >
                  <List.Item arrow="horizontal">公文流程</List.Item>
                </Picker>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.fwwh} labelNumber={3}>文号:</InputItem></Flex.Item>
            <Flex.Item>
              <InputItem placeholder="请输入..."
                {...getFieldProps('fs',{
                  initialValue: formData.fs,
                })}
                labelNumber={3}
                type="Number">份数:
              </InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className="select_container">
                <Picker data={secrecyType} cols={1}
                  disabled={false}
                  value={[mj_value]}
                  onOk={this.onPickerSecrecyTypeOk} >
                  <List.Item arrow="horizontal">密级</List.Item>
                </Picker>
              </div>
            </Flex.Item>
            <Flex.Item>
              <div className="select_container">
                <Picker data={urgencyType} cols={1}
                  disabled={false}
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
                {...getFieldProps('wjbt',{
                  initialValue: formData.wjbt,
                })}
                title=""
                rows={3}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>主送：</div>
              <TextareaItem
                {...getFieldProps('zsdw',{
                  initialValue: formData.zsdw,
                })}
                rows={3}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>抄送：</div>
              <TextareaItem
                {...getFieldProps('csdw',{
                  initialValue: formData.csdw,
                })}
                rows={3}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <Button type="default" style={{margin:'0.1rem auto',width:'90%'}}
                onClick={()=>{
                  location.href = OAUtils.getMainDocumentUrl({ docunid:detailInfo.unid });
                }}>下载正文</Button>
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item className={'uploadContainer'}>
              <Upload {...uploadProps}>
                <Button type="primary" style={{width:'100%'}}>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'}>附件列表：
                {attachmentList.length<=0?
                  (<span>无附件</span>):null}
              </div>
              { this.state.attachmentList.length>0?
                (this.getAttachmentListEle(this.state.attachmentList)):null
              }
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginTop:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>领导签发:</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['签发意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>传批意见:</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['签批意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'oaEdit_item_title detail_textarea_title'}>局长审核意见:</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['审核意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <div className={'oaEdit_item_title detail_textarea_title'}>分管领导意见:</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['审稿意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>处室负责人意见:</div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['部门意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <div className={'oaEdit_item_title detail_textarea_title'}>核稿:</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['核稿意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.zbbm_show} labelNumber={5}>拟稿单位:</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={4} value={formData.ngr_show}>拟稿人:</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" editable="fasle" value={formData.ngrq_show} labelNumber={3}>日期:</InputItem></Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}

DS_DetailContentComp.defaultProps = {
};

DS_DetailContentComp.propTypes = {
};



export default createForm()(DS_DetailContentComp);
