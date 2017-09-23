//发文管理
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Modal,WhiteSpace, SwipeAction, Tabs, Toast, ListView, Button} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;
import DS_DetailComp from './ds_detail_comp.jsx';//详情
import DS_AddComp from './ds_add_comp.jsx';//新增

const alert = Modal.alert;
//发文管理
class DispatchList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["草稿箱", "待办", "办理中", "已定稿", "已发布","按时间","按年度","按主办部门","按承办部门", "所有"],
        activeTabkey:'待办',
        colsNameCn:["拟稿日期","拟稿单位", "拟稿人", "文件标题", "发文类型", "发文文号", "当前办理人", "办理状态"],
        colsNameEn:["draftDate", "draftUnit", "draftPerson", "fileTitle", "fileType", "fileNum", "curUsers", "status"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[],
        detailInfo:null,
        dataSource: dataSource.cloneWithRows([]),
        refreshing: true,
        showDetail:false,
        showAdd:false,
        tokenunid:'',
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  getServerListData = (keyName,currentpage,callback)=>{ //从服务端获取列表数据
    let loginInfo = localStorage.getItem(OAUtils.OA_LOGIN_INFO_KEY);
    let tokenunid = JSON.parse(loginInfo)['tockenunid'];
    this.setState({
      tokenunid,
      isLoading:true
    });
    OAUtils.getDispatchListData({
      tokenunid: tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        // console.log("get server signReport list data:",data);
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        let listData = this.state.listData.concat(parseData);
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:this.state.currentpage+1,
          totalPageCount:data.totalcount,
          hasMore:(currentpage+1)<=data.totalcount,
          listData:listData,
          dataSource: this.state.dataSource.cloneWithRows(listData),
        });
        callback && callback();
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
  }
  onEndReached = (evt)=>{
    let {currentpage,totalPageCount} = this.state;
    if (this.state.isMoreLoading && (currentpage==totalPageCount)) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage++);
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedId = record.id ? record.id : '';
    alert('删除', '确定删除么??', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDelete(selectedId) },
    ]);
  }
  confirmDelete = (selectedId)=>{ //确认删除
    OAUtils.deleteItem({
      tokenunid: this.state.tokenunid,
      successCall: (data)=>{
        console.log("删除成功:",data);
        Toast.info("删除成功",2);
        this.handleTabClick(this.state.activeTabkey);
      },
      errorCall: (data)=>{
        Toast.info("删除失败",2);
        console.log("删除失败:",data);
      }
    });
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key,
      listData:[],
      currentpage:1
    });
    this.getServerListData(key,1);
  }
  onClickOneRow = (rowData)=>{
    // console.log("发文管理 click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true,showAdd: false});
  }

  backToTableListCall = (showType)=>{
    let showAdd = false,showDetail = false;
    if(showType == "showAdd"){
      showAdd = true;
    }else if(showType == "showDetail"){
      showDetail = true;
    }
    this.setState({showAdd,showDetail });
  }
  onClickLoadMore = (evt)=>{
    let {currentpage,totalPageCount,hasMore} = this.state;
    if (!this.state.isMoreLoading && !hasMore) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage);
  }

  onClickAddEdit = ()=>{
    this.setState({showDetail:false, showAdd: true});
  }
  updateListViewCall = ()=>{ //跟新列表。
    this.setState({
      listData:[],
      currentpage:1
    });
    this.getServerListData(this.state.activeTabkey,1);
  }
  afterAddNewCall = (formData)=>{
    this.onClickOneRow(formData);
    this.updateListViewCall();
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const listRow = (rowData, sectionID, rowID) => {
      return (
        <SwipeAction style={{ backgroundColor: 'gray' }}
          autoClose
          disabled={false}
          right={[
            {
              text: '取消',
              onPress: () => console.log('cancel'),
              style: { backgroundColor: '#ddd', color: 'white' },
            },
            {
              text: '删除',
              onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
              style: { backgroundColor: '#F4333C', color: 'white' },
            },
          ]}
          onOpen={() => console.log('global open')}
          onClose={() => console.log('global close')}
          >
          <div key={rowID} className={'custom_listView_item'}
            style={{
              padding: '0.08rem 0.16rem',
              backgroundColor: 'white',
            }}
            onClick={()=>this.onClickOneRow(rowData)}
          >
            <div className={'list_item_container'}>
              <div className={'list_item_middle'}>
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.fileTitle}</div>
                <div>当前办理人：<span>{rowData.curUsers}</span></div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.draftDate}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.status}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    const listViewRenderFooter = ()=>{
      if(this.state.isMoreLoading){
        return (<div style={{ padding: 10, textAlign: 'center' }}>加载中...</div>);
      }else if(this.state.hasMore){
        return (<div style={{ padding: 10, textAlign: 'center' }} >
              <Button type="default" style={{margin:'0 auto',width:'90%'}}
                onClick={()=>this.onClickLoadMore()}>加载更多</Button>
            </div>);
      }
      return (<div style={{ padding: 10, textAlign: 'center' }}>没有更多了！</div>);
    }
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      let {dataSource} = this.state;
      if(this.state.activeTabkey != tabName){
        dataSource = this.state.dataSource.cloneWithRows([]);
      }
      return (<TabPane tab={tabName} key={tabName} >
        <Button className="btn" type="primary" style={{margin:"0.16rem"}} onClick={()=>this.onClickAddEdit()}><Icon type="plus" />发文拟稿</Button>
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?
          <div style={{textAlign:'center'}}>暂无数据</div>:null}
        {!this.state.showAdd && !this.state.showDetail ? (
          <ListView
            dataSource={dataSource}
            renderRow={listRow}
            renderSeparator={separator}
            renderFooter={listViewRenderFooter}
            initialListSize={this.state.currentpage*10}
            pageSize={this.state.currentpage*10}
            scrollRenderAheadDistance={200}
            scrollEventThrottle={20}
            useBodyScroll={true}
            scrollerOptions={{ scrollbars: false }}
          />
        ):null}
      </TabPane>);
    });

    return (
      <div>
        <Tabs
          defaultActiveKey={this.state.activeTabkey}
          pageSize={5}
          swipeable={false}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showAdd?
          (<DS_AddComp
            tokenunid={this.state.tokenunid}
            afterAddNewCall={this.afterAddNewCall}
            backToTableListCall={()=>this.backToTableListCall()}
            />):null
        }
        {this.state.showDetail?
          (<DS_DetailComp
            detailInfo={this.state.detailInfo}
            tokenunid={this.state.tokenunid}
            updateListViewCall={this.updateListViewCall}
            backToTableListCall={()=>this.backToTableListCall()}
            />):null
        }
      </div>
    )
  }
}

DispatchList.defaultProps = {
};
DispatchList.propTypes = {
};

export default DispatchList;
