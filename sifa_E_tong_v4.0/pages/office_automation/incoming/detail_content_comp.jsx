import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import UserStore from 'stores/user_store.jsx';
import { Toast, WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem, Flex, TabBar, Picker, List } from 'antd-mobile';

import { Icon, Upload } from 'antd';
import { createForm } from 'rc-form';
import CommonNotionComp from '../common/common_notion_comp.jsx';

import PDF_Viewer from  './PDF_Viewer.jsx';

class DetailContentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        historyNotionType2List:[],
        uploadAttachmentUrl:'',  //上传公文附件的url.
        attachmentList:[],  //附件列表
        documentList:[], //正文文档列表
        mj_value:'', //密级
        viewPDFUrl:'', //
      };
  }
  componentDidMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
    if(this.props.unid){
      this.getFormVerifyNotion();
      this.getFormAttachmentList();
      this.getDocumentAttachmentList();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.formData.unid != this.props.formData.unid){
      this.setState({
        mj_value:nextProps.formData.mj || "",
      });

    }
    if(nextProps.editSaveTimes != this.props.editSaveTimes){ //点击了保存按钮了。
      this.editSave();
    }
  }
  editSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['mj'] = this.state.mj_value;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        // console.log("保存-发文管理的表单数据:",data);
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
      docunid:this.props.unid,
      successCall: (data)=>{
        console.log("收文管理的历史阅文意见:",data.values.notions);
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
      docunid:this.props.unid,
      moduleName:this.props.moduleNameCn,
      successCall: (data)=>{
        console.log("收文管理的附件列表:",data);
        this.setState({
          attachmentList:data.values.filelist || [],
        });
      }
    });
  }
  getDocumentAttachmentList = ()=>{ //收文管理的正文列表
    OAUtils.getDocumentAttachmentList({
      tokenunid:this.props.tokenunid,
      docunid:this.props.unid,
      modulename:this.props.modulename,
      successCall: (data)=>{
        console.log("收文管理的正文列表:",data);
        this.setState({
          documentList:data.values.filelist || [],
        });
      }
    });
  }
  getAttachmentListEle = (attachmentList)=>{ //附件文档列表 dom 元素
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

  getDocumentListEle = (documentList)=>{ //正文文档列表 dom 元素
    return documentList.map((item,index)=>{
      let downloadUrl = OAUtils.getIncomingDocumentUrl({
        fileunid:item.unid,
        modulename:this.props.modulename
      });
      return (
        <div key={index} style={{marginLeft:'0.3rem'}}>
          <span data-href={downloadUrl} data-unid={item.unid} onClick={()=>this.onClickViewPDF(downloadUrl)}>{item.attachname}</span><br/>
        </div>
      );
    });
  }

  onClickViewPDF = (downloadUrl)=>{
    this.setState({
      viewPDFUrl:downloadUrl
    });
  }
  onPickerSecrecyTypeOk = (val)=>{ //选择 密级
    console.log("onPickerSecrecyTypeOk--:",val);
    this.setState({mj_value:val[0]});
  }
  onFileUploadChange = (file)=>{
    this.setState({
      uploadAttachmentUrl:OAUtils.getUploadAttachmentUrl({
        docunid:this.props.unid,
        filename:file.name,
        moduleName:this.props.moduleNameCn
      })
    });
  }

  render() {
    const {attachmentList,mj_value,documentList } = this.state;
    const { unid, formData, formDataRaw , tokenunid, modulename } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    let uploadProps = {
      name: 'inputName',
      action: this.state.uploadAttachmentUrl,
      showUploadList:false, //是否展示上传文件列表。
      withCredentials:true,
      headers: {
        authorization: 'authorization-text',
        'X-Requested-With':'XMLHttpRequest',
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
    let acceptNum = formData.wjnd+'-'+formData.lsh;
    return (
      <div style={{marginBottom: "60px"}}>
        {
          this.state.viewPDFUrl?
          <PDF_Viewer fileUrl={this.state.viewPDFUrl}/>:null
        }
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙市司法局公文处理笺</div>
          <Flex>
            <Flex.Item style={{flex:'2'}}>
              <InputItem placeholder="请输入..."
                {...getFieldProps('wjnd',{
                  initialValue: formData.wjnd,
                })}
                labelNumber={5}
                type="Number">收文编号:
              </InputItem>
            </Flex.Item>
            <Flex.Item ><InputItem value={formData.lsh}></InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.swrq} labelNumber={5}>收文日期:</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.lwwh} labelNumber={5}>原文编号:</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.lwdwmc} labelNumber={5}>来文单位:</InputItem></Flex.Item>
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
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.fs} labelNumber={3}>位数:</InputItem></Flex.Item>
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
              <div className={'oaEdit_item_title'}>正文列表：
                {documentList.length<=0?
                  (<span>无正文</span>):null}
              </div>
              { documentList.length>0?
                (this.getDocumentListEle(documentList)):null
              }
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item className={'uploadContainer'}>
              <Upload {...uploadProps}>
                <Button type="default" style={{width:'100%',color:'#0ab0d6'}}>
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
              <div className={'oaEdit_item_title detail_textarea_title'}>拟办意见:</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['拟办意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title detail_textarea_title'}>传批意见:</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['批办意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'oaEdit_item_title detail_textarea_title'}>处理结果:</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['处理结果'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}

DetailContentComp.defaultProps = {
};

DetailContentComp.propTypes = {
};



export default createForm()(DetailContentComp);
