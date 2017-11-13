import $ from 'jquery';
import React from 'react';
import UserStore from 'stores/user_store.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Toast,WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import CommonNotionComp from '../common/common_notion_comp.jsx';

import {Icon,Upload } from 'antd';
//签报管理的编辑详情内容
class DetailContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        uploadAttachmentUrl:'',  //上传公文附件的url.
        historyNotionType2List:{},
        attachmentList:[],  //附件列表
        gwlc:'', //公文流程，也就是请示类别。
      };
  }
  componentDidMount(){
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username||''});
    if(this.props.unid){
      this.getFormVerifyNotion();
      this.getFormAttachmentList();
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.formData.gwlc!=this.props.formData.gwlc){
      this.setState({
        gwlc :nextProps.formData.gwlc
      });
    }
    if(nextProps.editSaveTimes != this.props.editSaveTimes){ //点击了保存按钮了。
      this.editSave();
    }
  }
  editSave = ()=>{  //编辑保存
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['gwlc'] = this.state.gwlc;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        // console.log("保存-签报管理的表单数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.props.editSaveSuccCall(formData,data.values);
        Toast.info('修补保存成功!!', 2);
      },
      errorCall:(res)=>{
        Toast.info('修补保存失败!!', 1);
      }
    });
  }
  getFormVerifyNotion = ()=>{ //获取历史阅文意见数据。
    OAUtils.getFormVerifyNotion({
      tokenunid:this.props.tokenunid,
      docunid:this.props.unid,
      successCall: (data)=>{
        // console.log("get 签报管理的历史阅文意见:",data.values.notions);
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
        // console.log("get 签报管理的附件列表:",data);
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
        <div key={index} style={{marginLeft:'0.2rem'}}><a href={downloadUrl} data-unid={item.unid}>{item.attachname}</a><br/></div>
      );
    });
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
  onGwlcPickerOk = (val)=>{
    this.setState({
      gwlc:val[0]
    });
  }

  render() {
    const {attachmentList} = this.state;
    const { getFieldProps } = this.props.form;
    const { unid,formData,tokenunid, formDataRaw} = this.props;
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
    let items = formDataRaw.gwlc?formDataRaw.gwlc.items:[];
    //请示类别当前值就是gwlc字段的值。--公文流程。
    let owerPleaTypes = items.map((item)=>{ //请示类别。
      return {
        label:item.text,
        value:item.value
      }
    });
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局工作(报告)单</div>
          <Flex>
            <Flex.Item><InputItem value={formData.ngr_show} editable={false} labelNumber={4}>拟稿人：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={formData.zbbm_show||""} editable={false} labelNumber={5}>拟稿单位：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem value={formData.ngrq_show} editable={false} labelNumber={5}>拟稿日期：</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'}>标题：</div>
              <TextareaItem
                {...getFieldProps('bt',{
                  initialValue: formData.bt,
                })}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }} className={'picker_list'}>
                <Picker data={owerPleaTypes} cols={1}
                  disabled={false}
                  value={[this.state.gwlc||'']}
                  onOk={this.onGwlcPickerOk}>
                  <List.Item arrow="horizontal">请示类别：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item>
              <Button type="default" style={{margin:'0.1rem auto',width:'90%',color:'#0ab0d6'}}
                onClick={()=>{
                  location.href = OAUtils.getMainDocumentUrl({ docunid:unid });
                }}>下载正文</Button>
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
                {(attachmentList.length<=0) ?
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
              <div className={'oaEdit_item_title'}>领导批示：</div>
              <CommonNotionComp
              notionList={this.state.historyNotionType2List['领导批示'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'} >主管财务领导：</div>
                <CommonNotionComp
                notionList={this.state.historyNotionType2List['主管领导意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'} >分管领导意见：</div>
                <CommonNotionComp
                notionList={this.state.historyNotionType2List['分管领导意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'}>处室负责人：</div>
                <CommonNotionComp
                notionList={this.state.historyNotionType2List['部门意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'}>核稿：</div>
              <TextareaItem
              value={"--"}
              editable={false}
              labelNumber={0}/>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'oaEdit_item_title'} >事由：</div>
              <TextareaItem
                {...getFieldProps('nr',{ initialValue:formData.nr || '' })}
                title=""
                rows={5}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{height:'1rem'}}/>
        </div>
      </div>
    )
  }
}

DetailContentCompRaw.defaultProps = {
};

DetailContentCompRaw.propTypes = {
};
const DetailContentComp = createForm()(DetailContentCompRaw);
export default DetailContentComp;
