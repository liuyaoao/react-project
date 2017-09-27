import $ from 'jquery';
import React from 'react';
// import moment from 'moment';
import UserStore from 'stores/user_store.jsx';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { SwipeAction,List,  Popup, Button } from 'antd-mobile';
import { Icon} from 'antd';

class DocumentListMobile extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['document'] ? permissionData['document'].indexOf('action') != -1 : false;
      this.state = {
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
      };
  }

  onClickPrePage = ()=>{ //上一页
    let currentPage = this.props.curPageNum;
    if(currentPage > 1){
      let otherParams = {
        "from":(currentPage-2)*10,
        "to":(currentPage-1)*10,
      };
      this.props.handleSearch(null,otherParams);
    }
  }
  onClickNextPage = ()=>{ //下一页
    let currentPage = this.props.curPageNum;
    const pageCount = Math.ceil(this.props.totalCount/10);
    if(currentPage < pageCount){
      let otherParams = {
        "from":(currentPage)*10,
        "to":(currentPage+1)*10,
      };
      this.props.handleSearch(null,otherParams);
    }
  }

  handleShowEditModal = (item)=>{
    this.props.handleShowEditModal(item);
  }
  getListItemBreifEle = (item)=>{
    let {departmentData,departmentFlatMap, currentFileId, currentFileSubId, curDepartmentId} = this.props;
    let fileTypeName = currentFileId&&departmentFlatMap[currentFileId] ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId&&departmentFlatMap[currentFileSubId] ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId&&departmentFlatMap[curDepartmentId] ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';

    let listItemBreif = (<List.Item.Brief>
                      性别: {item.gender}, 地址: {item.createParty}
                    </List.Item.Brief>);
    if( (["市局机关","局属二级机构","公证员"]).indexOf(fileSubTypeName)!=-1 ){
      listItemBreif = (<List.Item.Brief>
                        性别: {item.gender}, 地址: {item.createParty}
                      </List.Item.Brief>);
    }else if(fileSubTypeName=="区县司法局"){

    }else if(fileSubTypeName=="司法所"){
      listItemBreif = (<List.Item.Brief>
                        性别: {item.gender}, 单位: {item.reportingUnit}
                      </List.Item.Brief>);
    }else if(fileSubTypeName == '法律援助中心'){

    }else if(fileSubTypeName == '法律援助律师'){

    }else if(fileSubTypeName == '公证处'){

    }else if(fileSubTypeName=="律师事务所"){
      listItemBreif = (<List.Item.Brief>
                        律所负责人: {item.lawOfficePrincipal}, 律所地址:  {item.lawOfficeAddress}
                      </List.Item.Brief>);
    }else if(fileSubTypeName == "律师"){
      listItemBreif = (<List.Item.Brief>
                        性别: {item.gender}, 律所名称: {item.lawOfficeName}
                      </List.Item.Brief>);
    }else if ( fileSubTypeName == '基层法律服务所' ){

    }else if( fileSubTypeName == "基层法律工作者" ){
      listItemBreif = (<List.Item.Brief>
                        执业状态: {item.lawyerStatus}, 执业机构: {item.lawOfficeAddress}
                      </List.Item.Brief>);
    }else if(fileSubTypeName == '司法鉴定所'){

    }else if(fileSubTypeName == '司法鉴定人员'){

    }else if(fileTypeName == '司考通过人员'){
      listItemBreif = (<List.Item.Brief>
                        性别: {item.gender}, 通讯地址: {item.createParty}
                      </List.Item.Brief>);
    }
    return listItemBreif;
  }

  render() {
    const { hasOperaPermission } = this.state;
    const { data,departmentFlatMap, currentFileId,  currentFileSubId, curDepartmentId,showDeleteConfirm } = this.props;
    let fileTypeName = currentFileId&&departmentFlatMap[currentFileId] ? (departmentFlatMap[currentFileId].resourceName||'') : '';
    let fileSubTypeName = currentFileSubId&&departmentFlatMap[currentFileSubId] ? (departmentFlatMap[currentFileSubId].resourceName||'') : '';
    let departmentName = curDepartmentId&&departmentFlatMap[curDepartmentId] ? (departmentFlatMap[curDepartmentId].resourceName||'') : '';

    return (
      <div className="am-doc-list doc-table">
        {(!data || data.length<=0)?(
          <div style={{textAlign:'center',color:'gray'}}>暂无数据</div>
        ) : null}
        <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
          {data.map((item, index) => (
            <SwipeAction key={index} style={{ backgroundColor: '#f3f3f3' }}
                autoClose
                disabled={hasOperaPermission ? false : true}
                right={[
                  {
                    text: '取消',
                    onPress: () => console.log('cancel'),
                    style: { backgroundColor: '#ddd', color: 'white' },
                  },
                  {
                    text: '删除',
                    onPress: ()=> {showDeleteConfirm(item,true)},
                    style: { backgroundColor: '#F4333C', color: 'white' },
                  },
                ]}
                onOpen={() => console.log('global open')}
                onClose={() => console.log('global close')}
                >

              <List.Item key={index} multipleLine extra={<a href="javascript:;">查看</a>}
                onClick={()=>{hasOperaPermission?this.handleShowEditModal(item):''}}>
                {
                  fileSubTypeName == '律师事务所'?
                    <div style={{fontWeight:'bold'}}>律所名称：{item.lawOfficeName}</div>:
                    <div style={{fontWeight:'bold'}}>姓名：{item.userName}</div>
                }
                {this.getListItemBreifEle(item)}
              </List.Item>

          </SwipeAction>
          )
        )}
        </List>
        <div className="mobile_page_cnt">
          <div className="pre_page">
            <Button type="default" onClick={this.onClickPrePage}><Icon type="double-left" />上一页</Button>
          </div>
          <div className="page_num">
            <span>{this.props.totalCount>0?this.props.curPageNum:0}</span>/<span>{Math.ceil(this.props.totalCount/10)}</span>
          </div>
          <div className="next_page">
            <Button type="default" onClick={this.onClickNextPage}>下一页<Icon type="double-right" /></Button>
          </div>
        </div>

      </div>
    );
  }
}

DocumentListMobile.defaultProps = {
};

DocumentListMobile.propTypes = {
  // addressListData:React.PropTypes.array,
  // showAddEditDialog:React.PropTypes.func,
};

export default DocumentListMobile;
