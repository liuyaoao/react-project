import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import moment from 'moment';
import { createForm } from 'rc-form';

import { WingBlank, WhiteSpace, Button, InputItem,
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
        <div key={index}><a href={downloadUrl} data-unid={item.unid}>{item.attachname}</a><br/></div>
      );
    });
  }
  onFileUploadChange = (file)=>{
    var index = document.getElementById("choosefile").value.indexOf('fakepath')+9;
    let filename = document.getElementById("choosefile").value.substring(index);
    // console.log("上传文件时，选择文件的change事件----：",file,filename);
    this.setState({
      uploadAttachmentUrl:OAUtils.getUploadAttachmentUrl({
        docunid:this.props.detailInfo.unid,
        filename:filename,
        moduleName:this.props.moduleNameCn
      })
    });
  }
  onUploadFileSubmit = ()=>{
    // let uploadForm = document.getElementById("fileUploadForm");
    // let res = fetch(this.state.uploadAttachmentUrl, {
    //     method: 'POST',
    //     body: new FormData(uploadForm)
    //   }).then((response) => {
    //
    //     console.log("after file upload message:",response);
    //     return response;
    // });
    // return false;
  }

  render() {
    const {attachmentList} = this.state;
    const { getFieldProps } = this.props.form;
    const {detailInfo, formData, formDataRaw} = this.props;
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
                  value={[formData.dblx||'']}
                  onOk={this.onPickerOk}>
                  <List.Item arrow="horizontal">督办类型：</List.Item>
                </Picker>
              </List>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('receiveFileNum', {initialValue:formData.lsh})}
                editable={true}
                labelNumber={4}>收文号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem
                {...getFieldProps('receiveFileTime', {
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
                {...getFieldProps('sendFileUnit',{initialValue:formData.lwdw})}
                title=""
                autoHeight
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('deadlineTime', {initialValue:formData.blsx})}
                editable={true}
                labelNumber={5}>截止日期：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('cuiBan', {initialValue:formData.cb})}
                editable={true}
                labelNumber={4}>催办：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <InputItem {...getFieldProps('yuanHao', {initialValue:formData.yh})}
                editable={true}
                labelNumber={4}>原号：</InputItem>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>文件标题：</div>
              <TextareaItem
                {...getFieldProps('subjectTitle',{initialValue:formData.bt})}
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

          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginBottom:'0.1rem'}}/>

          <Flex>
            <Flex.Item style={{marginLeft:'0.2rem'}}>
              <form enctype="multipart/form-data"
                    id="fileUploadForm"
                    action={this.state.uploadAttachmentUrl}
                    method="post"
                    onsubmit={this.onUploadFileSubmit}>
                  <input type="file" name="file" id="choosefile" style={{display:'inline-block',width:'76%'}} onChange={this.onFileUploadChange}/>
                  <input type="submit" value="上传附件" id="submitBtn" style={{color:'black'}}/>
              </form>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>附件列表：{attachmentList.length<=0?(<span>无附件</span>):null}</div>
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
