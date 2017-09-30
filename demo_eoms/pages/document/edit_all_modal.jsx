import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { SearchBar, List,Button } from 'antd-mobile';
import { Layout, Icon } from 'antd';

import DocumentEditModalPC from './edit_modal_pc.jsx';
import DocumentEditLawyerModalPC from './edit_lawyer_modal_pc.jsx';
import DocumentEditLawfirmModalPC from './edit_lawfim_modal_pc.jsx';
import DocumentEditJudExamModalPC from './edit_judicialexam_modal_pc.jsx'
import DocumentEditLegalWorkerModalPC from './edit_legalWorker_modal_pc.jsx';
import DocumentEditSifaDirectorModalPC from './edit_sifaDirector_modal_pc.jsx';

export default class DocumentAllEditModal extends React.Component {
  static get propTypes() {
      return {
        visibleEditModel:React.PropTypes.bool,
        departmentData: React.PropTypes.array,
        departmentFlatMap: React.PropTypes.object
      };
  }
  constructor(props) {
      super(props);
      // this.handleClick = this.handleClick.bind(this);
      this.state = {
        current: '-1',
        openKeys: [],
        isMobile: Utils.isMobile()
      };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){

  }

  render() {
    const { visibleEditModel,memberInfo, departmentData,departmentFlatMap} = this.props;
    // console.log(this.state.openKeys);
    const editModalField = {
      ref: "editDocForm",
      visible: visibleEditModel,
      memberInfo: memberInfo,
      departmentData:departmentData,
      departmentFlatMap:departmentFlatMap,
      // curDepartmentId: curDepartmentId,
      handleSearch: this.props.handleSearch,
      handleCancelModal: this.props.handleCancelModal
    }
    let edit_ele = null;
    // console.log("编辑弹窗----：",visibleEditModel,memberInfo.fileInfoType,memberInfo.fileInfoSubType);

    if( (["市局机关","局属二级机构","公证员"]).indexOf(memberInfo.fileInfoSubType)!=-1 ){//ok
      edit_ele = <DocumentEditModalPC {...editModalField}></DocumentEditModalPC>
    }else if(memberInfo.fileInfoSubType == '律师事务所'){ //ok
      edit_ele = <DocumentEditLawfirmModalPC {...editModalField}></DocumentEditLawfirmModalPC>
    }else if(memberInfo.fileInfoType == '司考通过人员') {  //ok
      edit_ele = <DocumentEditJudExamModalPC {...editModalField}></DocumentEditJudExamModalPC>
    }else if(memberInfo.fileInfoSubType == '律师' ){ //ok
      edit_ele = <DocumentEditLawyerModalPC {...editModalField}></DocumentEditLawyerModalPC>
    }else if(memberInfo.fileInfoSubType == '基层法律工作者' ){ //ok
      edit_ele = <DocumentEditLegalWorkerModalPC {...editModalField}></DocumentEditLegalWorkerModalPC>
    }else if(memberInfo.fileInfoSubType == '司法所' ){ //ok
      edit_ele = <DocumentEditSifaDirectorModalPC {...editModalField}></DocumentEditSifaDirectorModalPC>
    }else if(memberInfo.fileInfoSubType == '区县司法局'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '法律援助中心'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '法律援助律师'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '公证处'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '基层法律服务所'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '司法鉴定所'){
      edit_ele = <div></div>;
    }else if(memberInfo.fileInfoSubType == '司法鉴定人员'){
      edit_ele = <div></div>;
    }
    return (
      <div>
        {edit_ele}
      </div>
    );
  }
}
