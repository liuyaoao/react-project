import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import { Toast,WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem,Flex,List,Picker} from 'antd-mobile';

import {Icon,Upload } from 'antd';
import CommonNotionComp from '../common/common_notion_comp.jsx';
//督办管理的编辑详情内容
class DetailContentCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loginUserName:'',
        nowDate:moment(new Date()).format('YYYY-MM-DD'),
        uploadAttachmentUrl:'',  //上传公文附件的url.
        historyNotionType2List:[],
        attachmentList:[],
        dblx:'', //督办类型。
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
    if(nextProps.formData.dblx!=this.props.formData.dblx){
      this.setState({
        dblx :nextProps.formData.dblx
      });
    }
    if(nextProps.editSaveTimes != this.props.editSaveTimes){ //点击了保存按钮了。
      this.editSave();
    }
  }

  editSave = ()=>{
    let tempFormData = this.props.form.getFieldsValue();
    tempFormData['dblx'] = this.state.dblx;
    OAUtils.saveModuleFormData({
      moduleName:this.props.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:Object.assign({},this.props.formParams,this.props.formData,tempFormData), //特有的表单参数数据。
      successCall: (data)=>{
        console.log("保存-督办管理的表单数据:",data);
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
      docunid:this.props.detailInfo.unid,
      successCall: (data)=>{
        console.log("get 督办管理的历史阅文意见:",data.values.notions);
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
        console.log("get 督办管理的附件列表:",data);
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
        docunid:this.props.detailInfo.unid,
        filename:file.name,
        moduleName:this.props.moduleNameCn
      })
    });
  }
  onDblxPickerOk = (val)=>{
    this.setState({
      dblx:val[0],
    });
  }

  render() {
    const {attachmentList} = this.state;
    const { getFieldProps } = this.props.form;
    const {detailInfo, formData, formDataRaw} = this.props;
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
    let items = formDataRaw.dblx?formDataRaw.dblx.items:[];
    //督办类别当前值就是dblx字段的值。
    let superviseTypes = items.map((item)=>{ //督办类别
      return {
        label:item.text,
        value:item.value
      }
    });
    return (
      <div>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>长沙司法局督办处理单</div>
          <WhiteSpace size='md' />
        <Flex>
            <Flex.Item>
              <List style={{ backgroundColor: 'white' }}>
                <Picker data={superviseTypes} cols={1}
                  value={[this.state.dblx||'']}
                  onOk={this.onDblxPickerOk}>
                  <List.Item arrow="horizontal">督办类型：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('lsh', {initialValue:formData.lsh||'-'})}
                editable={true}
                labelNumber={4}>收文号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem
                {...getFieldProps('swrq', {
                    initialValue:formData.swrq
                  })
                }
                editable={true}
                labelNumber={5}>收文日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>来文单位：</div>
              <TextareaItem
                {...getFieldProps('lwdw',{initialValue:formData.lwdw})}
                title=""
                rows={3}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('blsx', {initialValue:formData.blsx})}
                editable={true}
                labelNumber={5}>截止日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('cb', {initialValue:formData.cb})}
                editable={true}
                labelNumber={4}>催办：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('yh', {initialValue:formData.yh})}
                editable={true}
                labelNumber={4}>原号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>文件标题：</div>
              <TextareaItem
                {...getFieldProps('bt',{initialValue:formData.bt})}
                title=""
                rows={4}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>

          {/*<Flex>
            <Flex.Item>
              <form enctype="multipart/form-data" action="" method="post">
                  <input type="file" name="file" id="choosefile" style={{display:'inline-block'}}/>
                  <input type="submit" value="上传正文" id="submitBtn" style={{color:'black'}}/>
              </form>
            </Flex.Item>
          </Flex>*/}
          <Flex>
            <Flex.Item>
              <Button type="default" style={{margin:'0.1rem auto',width:'90%'}}
                onClick={()=>{
                  location.href = OAUtils.getMainDocumentUrl({ docunid:detailInfo.unid });
                }}>下载正文附件</Button>
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
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>附件列表：
                {attachmentList.length<=0?
                  (<span>无附件</span>):null}
                </div>
              { this.state.attachmentList.length>0?
                (this.getAttachmentListEle(this.state.attachmentList)):null
              }
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>拟办意见：</div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['拟办意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>领导意见：</div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['领导意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>办理情况：<span style={{color:'red'}}>(承办意见请上传在附件中)</span></div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['办理情况'] || []} />
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
