import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import {  List,Button } from 'antd-mobile';
import { Layout, Icon } from 'antd';

import DocDetailDefault from './detail_default.jsx';
import DocDetailLawyer from './detail_lawyer.jsx';
import DocDetailLawfirm from './detail_lawfim.jsx';
import DocDetailJudicialExam from './detail_judicialexam.jsx';
import DocDetailLegalWorker from './detail_legalWorker.jsx';
import DocDetailSifaDirector from './detail_sifaDirector.jsx';

export default class DocumentDetailPage extends React.Component {
  static get propTypes() {
      return {
      };
  }
  constructor(props) {
      super(props);
      this.state = {
        documentData:{}, //当前档案的详细信息
        randomStr:'',
      };
  }
  componentWillMount() {
    let arr = location.pathname.split('/');
    let docId = arr[arr.length-1];
    // console.log("location.pathname:",location.pathname,docId);
    myWebClient.getDocumentInfoById(docId,(res)=>{
      this.setState({documentData:res});
      // console.log("档案管理-单个档案的详情信息--:",res);
    },(err)=>{
      // console.log("档案管理-获取单个档案的详情信息发生错误--:",err);
    });
  }
  componentDidMount() {
    let randomStr = Math.random().toString().split('.')[1];
    this.setState({randomStr});
    let _this = this;
    window['handleClickBackBtn'+randomStr] = function (e) {
      // console.log("我监听到了浏览器的返回按钮事件啦");
      _this.backToListPageCall();
    }
    if (window.history && window.history.pushState) {
      setTimeout(()=>{
        // console.log('增加了监听器了！！！！',window['handleClickBackBtn'+randomStr]);
        window.addEventListener("popstate", window['handleClickBackBtn'+randomStr],false);
      },100);
    }
  }
  componentWillUnmount(){
    if (window.history && window.history.pushState) {
      setTimeout(()=>{
        // console.log('注销监听器了！！！！',window['handleClickBackBtn'+this.state.randomStr]);
        window.removeEventListener("popstate",window['handleClickBackBtn'+this.state.randomStr],false);
      },100);
    }
  }
  backToListPageCall = ()=>{ //点击返回按钮返回。
    browserHistory.push('/document_mobile');
  }
  render() {
    let {documentData} = this.state;
    const editModalField = {
      ref: "docDetailInfo",
      memberInfo: documentData,
      backToListPageCall:this.backToListPageCall,
    }
    // console.log("编辑弹窗----：",visibleEditModel,documentData.fileInfoType,documentData.fileInfoSubType);
    let detailContent = <p style={{width:'100%',textAlign:'center'}}>正在加载数据...</p>;

    if( (["市局机关","局属二级机构","公证员"]).indexOf(documentData.fileInfoSubType)!=-1 ){ //ok
      detailContent = <DocDetailDefault {...editModalField} />
    }else if(documentData.fileInfoSubType == '律师事务所'){ //ok
      detailContent = <DocDetailLawfirm {...editModalField}/>
    }else if(documentData.fileInfoType == '司考通过人员') {  //ok
      detailContent = <DocDetailJudicialExam {...editModalField}/>
    }else if(documentData.fileInfoSubType == '律师' ){ //ok
      detailContent = <DocDetailLawyer {...editModalField}/>
    }else if(documentData.fileInfoSubType == '基层法律工作者' ){ //ok
      detailContent = <DocDetailLegalWorker {...editModalField}/>
    }else if(documentData.fileInfoSubType == '司法所' ){ //ok
      detailContent = <DocDetailSifaDirector {...editModalField}/>
    }else if(documentData.fileInfoSubType == '区县司法局'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '法律援助中心'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '法律援助律师'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '公证处'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '基层法律服务所'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '司法鉴定所'){
      detailContent = <div></div>;
    }else if(documentData.fileInfoSubType == '司法鉴定人员'){
      detailContent = <div></div>;
    }
    return (
      <div>
        {detailContent}
      </div>
    );
  }
}
