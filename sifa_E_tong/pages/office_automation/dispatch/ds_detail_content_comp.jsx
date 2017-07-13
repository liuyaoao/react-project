import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import UserStore from 'stores/user_store.jsx';
import { WingBlank, WhiteSpace, Button, InputItem,
  TextareaItem, Flex, TabBar, Picker, List, Toast } from 'antd-mobile';

import { Icon, Select } from 'antd';
import { createForm } from 'rc-form';
import CommonFlowTraceComp from '../common_flowTrace_comp.jsx'; //办文跟踪
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
      console.log("formData:",nextProps.formData);
      this.setState({
        gwlc_value:nextProps.formData.gwlc || "",
        mj_value:nextProps.formData.mj || "",
        jjcd_value:nextProps.formData.jjcd || "",
      });
    }
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
  onPickerGWLCOk = (val)=>{ //选择 密级
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
    let index = document.getElementById("choosefile").value.indexOf('fakepath')+9;
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
    const {attachmentList,mj_value,jjcd_value,gwlc_value} = this.state;
    const { detailInfo, formData, formDataRaw , tokenunid, modulename } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
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
    console.log("gwlc_val----:",gwlc_val,fileFlowTypes);
    return (
      <div style={{marginBottom: "100px"}}>
        <div className={'oa_detail_cnt'}>
          <div className={'oa_detail_title'} style={{width:'100%',textAlign:'center'}}>{detailInfo.fileTitle}</div>
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
            <Flex.Item><InputItem placeholder="--" value={formData.fwwh} labelNumber={2}>文号</InputItem></Flex.Item>
            <Flex.Item><InputItem placeholder="--" value={formData.fs} labelNumber={2} type="Number">份数</InputItem></Flex.Item>
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
              <div style={{margin:'0.2rem 0 0 0.2rem',color:'black'}}>标题：</div>
              <TextareaItem
                {...getFieldProps('bt',{
                  initialValue: detailInfo.fileTitle,
                })}
                title=""
                rows={3}
                labelNumber={0}
              />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>主送：</div>
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
              <div className={'detail_textarea_title'}>抄送：</div>
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
                }}>下载正文附件</Button>
            </Flex.Item>
          </Flex>
          <WhiteSpace size='md' style={{borderBottom:'1px solid #c7c3c3',marginTop:'0.1rem'}}/>
          <Flex>
            <Flex.Item style={{marginLeft:'0.2rem'}}>
              <form enctype="multipart/form-data"
                    id="fileUploadForm"
                    action={this.state.uploadAttachmentUrl}
                    method="post"
                    target="_blank"
                    onSubmit={this.onUploadFileSubmit}>
                  <input type="file" name="inputName" id="choosefile" style={{display:'inline-block',width:'76%'}} onChange={this.onFileUploadChange}/>
                  <input type="submit" value="上传附件" id="submitBtn" style={{display:'inline-block',color:'black'}}/>
              </form>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div style={{margin:'0.2rem 0 0 0.3rem',color:'black'}}>附件列表：
                {attachmentList.length<=0?
                  (<span>无附件</span>):null}
              </div>
              { this.state.attachmentList.length>0?
                (this.getAttachmentListEle(this.state.attachmentList)):null
              }
            </Flex.Item>
          </Flex>

          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={4}>领导签发</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>传批意见</div>
              <div className="textarea_container">
                <CommonNotionComp
                  notionList={this.state.historyNotionType2List['传批意见'] || []} />
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="JZYJ">
                <div className={'detail_textarea_title'}>局长审核意见</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['局长审核意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="FGYJ">
                <div className={'detail_textarea_title'}>分管领导意见</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['分管领导意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div className={'detail_textarea_title'}>处室负责人意见</div>
              <CommonNotionComp
                notionList={this.state.historyNotionType2List['部门意见'] || []} />
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item>
              <div id="HG">
                <div className={'detail_textarea_title'}>核稿</div>
                <div className="textarea_container">
                  <CommonNotionComp
                    notionList={this.state.historyNotionType2List['部门意见'] || []} />
                </div>
              </div>
            </Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" value={formData.zbbm_show} labelNumber={4}>拟稿单位</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" labelNumber={4} value={formData.ngr_show}>拟稿人</InputItem></Flex.Item>
          </Flex>
          <Flex>
            <Flex.Item><InputItem placeholder="--" editable="fasle" value={formData.ngrq_show}>日期</InputItem></Flex.Item>
          </Flex>
          <div style={{height:'0.5rem',width:'100%',margin:'1em 0',background:'#efe9e9'}}></div>
          <div style={{height:'2.5em',lineHeight:'2.5em',marginLeft:'0.2rem',borderBottom:'1px solid #d6d1d1'}}>
            <span style={{width:'0.1rem',height:'1em',lineHeight:'2.5em',verticalAlign: 'middle',background:'red',display:'inline-block'}}></span>
            <span style={{marginLeft:'0.2rem',color:'black',fontWeight:'bold'}}>办公追踪-流转记录</span>
          </div>
          <CommonFlowTraceComp
            tokenunid={tokenunid}
            docunid={detailInfo.unid}
            gwlcunid={formData.gwlc}
            modulename={modulename}
            />
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
