import $ from 'jquery';
import React from 'react';
import moment from 'moment';

import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { SwipeAction } from 'antd-mobile';
import { List,  Popup, Button } from 'antd-mobile';
import { Icon} from 'antd';

class DocumentListMobile extends React.Component {
  constructor(props) {
      super(props);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'] ? permissionData['sys_config'].indexOf('action') != -1 : false;
      this.state = {
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        currentPage:1, //当前页。
      };
  }

  onClickPrePage = ()=>{ //上一页
    let currentPage = this.state.currentPage;
    if(currentPage > 1){
      this.setState({
        currentPage:currentPage-1,
      });
    }
  }
  onClickNextPage = ()=>{ //下一页
    let currentPage = this.state.currentPage;
    const pageCount = Math.ceil(this.props.data.length/10);
    if(currentPage < pageCount){
      this.setState({
        currentPage:currentPage+1,
      });
    }
  }

  handleShowEditModal = (item)=>{
    this.props.handleShowEditModal(item);
  }
  render() {
    const { hasOperaPermission,currentPage } = this.state;
    const { data, currentFileType,  currentFileSubType, currentDepartment,showDeleteConfirm } = this.props;
    const totalCount = data.length;
    const pageCount = Math.ceil(data.length/10);
    let curPageData = data.slice(10*(currentPage-1), 10*currentPage);

    return (
      <div className="am-doc-list doc-table">
        {(!data || data.length<=0) ? (<div style={{textAlign:'center',color:'gray'}}>暂无数据</div>) : null}
        <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
          {curPageData.map((item, index) => (
            <SwipeAction style={{ backgroundColor: '#f3f3f3' }}
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

              <List.Item key={index} multipleLine
                onClick={()=>{hasOperaPermission?this.handleShowEditModal(item):''}}>
                {
                  currentDepartment == '律所'?
                    <div>律所名称：{item.lawOfficeName}</div>:
                    <div>姓名：{item.userName}</div>
                }
                {
                  currentDepartment == '律所'?
                  <List.Item.Brief>
                    律所负责人: {item.lawOfficePrincipal}, 地址:  {item.lawOfficeAddress}
                  </List.Item.Brief>:
                  <List.Item.Brief>
                    性别: {item.gender}, 地址: {currentFileSubType=="律师" ? item.lawOfficeAddress : item.createParty}
                  </List.Item.Brief>
                }
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
            <span>{pageCount>0?currentPage:0}</span>/<span>{pageCount}</span>
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
