import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { Icon,notification,Table, Pagination} from 'antd';

import DocumentAddModalPC from './add_modal_pc.jsx';
import DocumentAddLawyerModalPC from './add_lawyer_modal_pc.jsx';
import DocumentAddLawfirmModalPC from './add_lawfim_modal_pc.jsx';
import DocumentAddJudExamModalPC from './add_judicialexam_modal_pc.jsx';
import DocumentAddLegalWorkerModalPC from './add_legalWorker_modal_pc.jsx';
import DocumentAddSifaDirectorModalPC from './add_sifaDirector_modal_pc.jsx';

notification.config({
  top: 68,
  duration: 3
});

class DocumentListPC extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.onPaginationChange = this.onPaginationChange.bind(this);
      this.state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  handleDeleteBatch() {
    const {selectedRowKeys} = this.state;
    const id = selectedRowKeys.join(',').toUpperCase();
    // console.log(id);
    this.props.showDeleteConfirm({key: id}, (res)=>{
      if (res) {
        this.setState({ selectedRowKeys: [] });
      }
    });
  }
  handleDeleteAll = (evt)=>{ //全部删除
    this.props.showDeleteAllConfirm();
  }
  componentWillReceiveProps(nextProps) {
    const {currentFileId,currentFileSubId,curDepartmentId} = this.props;
    // if (nextProps.currentFileId != currentFileId || nextProps.currentFileSubId != currentFileSubId|| nextProps.curDepartmentId != curDepartmentId) {
    //   this.setState({
    //     pagination:{pageSize:10,current:1},
    //   });
    // }
  }
  onPaginationChange(current,pageSize){
    let otherParams = {
      "from":(current-1)*pageSize,
      "to":current*pageSize,
    };
    this.props.handleSearch(null,otherParams);
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const { data,departmentData, departmentFlatMap, currentFileId, currentFileSubId, curDepartmentId } = this.props;
    let fileTypeName = currentFileId ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';

    let others_columns = [ //普通其他档案的表头。
      {title:"姓名", dataIndex:"userName", key:"userName", width:"15%"},
      {title:"性别", dataIndex:"gender", key:"gender", width:"15%"},
      {title:"地址", dataIndex:"createParty", key:"createParty"},
    ];

    let lawfim_columns = [ //律所 档案的表头。
      {title:"律所名称", dataIndex:"lawOfficeName", key:"lawOfficeName", width:"15%"},
      {title:"律所负责人", dataIndex:"lawOfficePrincipal", key:"lawOfficePrincipal", width:"15%"},
      {title:"律所地址", dataIndex:"lawOfficeAddress", key:"lawOfficeAddress"},
    ];

    let lawer_columns = [ //律师档案的表头。
      {title:"姓名", dataIndex:"userName", key:"userName", width:"15%"},
      {title:"性别", dataIndex:"gender", key:"gender", width:"15%"},
      {title:"律所名称", dataIndex:"lawOfficeName", key:"lawOfficeName"},
    ];
    // let legal_worker_columns = [ //基层法律工作者的表头。
    //   {title:"姓名", dataIndex:"userName", key:"userName", width:"15%"},
    //   {title:"性别", dataIndex:"gender", key:"gender", width:"15%"},
    //   {title:"执业机构", dataIndex:"lawOfficeAddress", key:"lawOfficeAddress"},
    // ];

    let LegalWorker_columns = [ //基层法律工作者档案的表头。
      {title:"姓名", dataIndex:"userName", key:"userName", width:"15%"},
      {title:"执业证号", dataIndex:"lawyerLicenseNo", key:"lawyerLicenseNo", width:"15%"},
      {title:"执业状态", dataIndex:"lawyerStatus", key:"lawyerStatus"},
      {title:"执业机构", dataIndex:"lawOfficeAddress", key:"lawOfficeAddress"},
    ];

    let director_columns = [ //司法所长档案的表头。
      {title:"姓名", dataIndex:"userName", key:"userName", width:"15%"},
      {title:"性别", dataIndex:"gender", key:"gender", width:"15%"},
      {title:"职务", dataIndex:"currentPosition", key:"currentPosition"},
      {title:"单位", dataIndex:"reportingUnit", key:"reportingUnit"},
    ];

    const last_col = {
      title: '操作', dataIndex: '', key: 'x', width: '20%',
      render: (text, record) => {
        return this.state.hasOperaPermission?(<span>
          <a href="javascript:;" onClick={this.props.handleShowEditModal.bind(this,record)}><Icon type="edit" /> 编辑</a>
          <span className="ant-divider" />
          <a href="javascript:;" onClick={this.props.showDeleteConfirm.bind(this,record)} className="error"><Icon type="delete" /> 删除</a>
        </span>):(<span>没有权限</span>);
      }
    };
    let columns = [], add_ele = null;
    const addModalField = { //新增档案的弹窗。
      memberInfo: {},
      departmentData:this.props.departmentData,
      departmentFlatMap:this.props.departmentFlatMap,
      currentFileId: currentFileId,
      currentFileSubId: currentFileSubId,
      curDepartmentId: curDepartmentId,
      handleSearch: this.props.handleSearch.bind(this)
    };
    if( (["市局机关","局属二级机构","公证员"]).indexOf(fileSubTypeName)!=-1 ){
      add_ele = (<DocumentAddModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddModalPC>);
      columns = [...others_columns, last_col];
    }else if(fileSubTypeName=="区县司法局"){

    }else if(fileSubTypeName=="司法所"){
      add_ele = (<DocumentAddSifaDirectorModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddSifaDirectorModalPC>);
      columns = [...director_columns, last_col];
    }else if(fileSubTypeName == '法律援助中心'){

    }else if(fileSubTypeName == '法律援助律师'){

    }else if(fileSubTypeName == '公证处'){

    }else if(fileSubTypeName=="律师事务所"){
      add_ele = (<DocumentAddLawfirmModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddLawfirmModalPC>);
      columns = [...lawfim_columns, last_col];
    }else if(fileSubTypeName == "律师"){
      add_ele = (<DocumentAddLawyerModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddLawyerModalPC>);
      columns = [...lawer_columns, last_col];
    }else if ( fileSubTypeName == '基层法律服务所' ){

    }else if(fileSubTypeName == "基层法律工作者"){
      add_ele = (<DocumentAddLegalWorkerModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddLegalWorkerModalPC>);
      columns = [...LegalWorker_columns, last_col];
    }else if(fileSubTypeName == '司法鉴定所'){

    }else if(fileSubTypeName == '司法鉴定人员'){

    }else if(fileTypeName == '司考通过人员'){
      add_ele = (<DocumentAddJudExamModalPC {...addModalField}>
                  <button type="button" className="btn btn-primary pull-right m-r-10"><Icon type="plus" /> 添加</button>
                </DocumentAddJudExamModalPC>);
      columns = [...others_columns, last_col];
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    let pagination = { //分页组件参数配置。
      pageSize:10,
      current:this.props.curPageNum,
      total:this.props.totalCount,
      onChange:this.onPaginationChange,
    };

    return (
      <div className="doc-search-list">
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
          {this.state.hasOperaPermission?
            (<span>
              <button type="button" style={{marginLeft:'10px'}}
                className="btn btn-danger pull-right"
                onClick={this.handleDeleteAll}>
                <Icon type="delete" /> 全部删除
              </button>
              <button type="button" className="btn btn-danger pull-right" disabled={!hasSelected} onClick={this.handleDeleteBatch.bind(this)}><Icon type="delete" /> 批量删除</button>
              {add_ele}
              </span>):null
          }
        </div>
        {columns.length>0?(<Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination}/>):null}
      </div>
    );
  }
}

DocumentListPC.defaultProps = {
};

DocumentListPC.propTypes = {
  // addressListData:React.PropTypes.array,
  // showAddEditDialog:React.PropTypes.func,
};

export default DocumentListPC;
