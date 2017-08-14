//信息发布的通知公告--列表
import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { Modal,WhiteSpace, SwipeAction,Button,Tabs,List,ListView,Toast} from 'antd-mobile';
import Notice_DetailComp from './noticeDetail_comp.jsx';
import Notice_AddEditComp from './noticeAddEdit_comp.jsx';
import { Icon} from 'antd';
const alert = Modal.alert;
const TabPane = Tabs.TabPane;
//通知公告
class NoticeList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        rootlbunid: '72060E133431242D987C0A80A4124268',
        tabsArr:["待审核", "已通过", "未通过"],
        activeTabkey:'待审核',
        colsNameCn:[ "标题", "发布日期", "所属类别", "所属单位"],
        colsNameEn:["fileTitle", "publishTime", "type" ,"unit"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据。
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        showDetail:false,
        showAddEdit:false,
      };
  }
  componentWillMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  getServerListData = (keyName,currentpage)=>{ //从服务端获取列表数据
    this.setState({isLoading:true});
    OAUtils.getNoticeListData({
      tokenunid: this.props.tokenunid,
      currentpage:currentpage,
      rootlbunid:this.state.rootlbunid,
      shbz:({"待审核":"0", "已通过":"1", "未通过":"-1"})[keyName],
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        console.log("get 通知公告的list data:",currentpage,data);
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        for(let i in parseData){
          parseData[i]["verifyState"] = keyName;
        }
        let listData = this.state.listData.concat(parseData);
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:currentpage+1,
          totalPageCount:data.totalcount,
          listData:listData,
          hasMore:(currentpage+1)<=data.totalcount,
          dataSource: this.state.dataSource.cloneWithRows(listData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false,isMoreLoading:false});
      }
    });
  }
  showDeleteConfirmDialog = (record)=>{
    let selectedId = record.unid ? record.unid : '';
    alert('删除', '确定删除么??', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDelete(selectedId) },
    ]);
  }
  showVerifyConfirmDialog = (record,toVerifyState)=>{
    let selectedId = record.unid ? record.unid : '';
    alert(toVerifyState, '确定'+toVerifyState+'吗？', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmVerify(selectedId,toVerifyState) },
    ]);
  }
  confirmVerify = (selectedId, toVerifyState)=>{
    console.log("待审核数据的unid:",selectedId);
    OAUtils.verifyNotice({
      tokenunid: this.props.tokenunid,
      unids:selectedId+'',
      shzt:({"审核通过":"shtg", "审核不通过":"shbtg"})[toVerifyState],
      successCall: (data)=>{
        Toast.info("审核成功",2);
        console.log("审核成功:",data);
        this.handleTabClick(this.state.activeTabkey);
      },
      errorCall: (data)=>{
        Toast.info("审核失败",2);
        console.log("审核失败:",data);
      }
    });
  }
  confirmDelete = (selectedId)=>{ //确认删除
    OAUtils.deleteItem({
      tokenunid: this.props.tokenunid,
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
    // console.log("通知公告 click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true, showAddEdit:false});
  }
  onClickAddEdit = ()=>{
    this.setState({showAddEdit:true, showDetail:false});
  }
  backToTableListCall = ()=>{
    this.setState({showDetail:false,showAddEdit:false});
  }
  onClickLoadMore = (evt)=>{
    let {currentpage,totalPageCount,hasMore} = this.state;
    if (!this.state.isMoreLoading && !hasMore) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage);
  }
  updateListViewCall = ()=>{ //跟新列表。
    this.setState({
      listData:[],
      currentpage:1
    });
    this.getServerListData(this.state.activeTabkey,1);
  }
  afterAddNewCall = (formData)=>{ //新建后处理。
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
      let verifyNotPass = {
        text: '审核不通过',
        onPress: () => {this.showVerifyConfirmDialog(rowData,"审核不通过")},
        style: { backgroundColor: '#108ee9', color: 'white' },
      };
      let verifyPass = {
        text: '审核通过',
        onPress: () => {this.showVerifyConfirmDialog(rowData,"审核通过")},
        style: { backgroundColor: '#108ee9', color: 'white' },
      };
      let deleteEle = {
        text: '删除',
        onPress: ()=>{this.showDeleteConfirmDialog(rowData)},
        style: { backgroundColor: '#F4333C', color: 'white' },
      };
      let cancelEle = {
        text: '取消',
        onPress: () => console.log('cancel'),
        style: { backgroundColor: '#ddd', color: 'white' },
      };
      let swipeRight=[];
      switch(rowData.verifyState){
        case "待审核":
          swipeRight.push(verifyPass,verifyNotPass,deleteEle);
          break;
        case "已通过":
          swipeRight.push(verifyNotPass,deleteEle);
          break;
        case "未通过":
          swipeRight.push(verifyPass,deleteEle);
          break;
        default:
          swipeRight.push(cancelEle,deleteEle);
        break;
      }

      return (
        <SwipeAction style={{ backgroundColor: 'gray' }}
          autoClose
          disabled={false}
          right={swipeRight}
          >
          <div key={rowID} className={'custom_listView_item'}
            style={{
              padding: '0.08rem 0.16rem',
              backgroundColor: 'white',
            }} onClick={()=>this.onClickOneRow(rowData)}
          >
            <div className={'list_item_container'}>
              <div className={'list_item_middle'}>
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.fileTitle}</div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.publishTime}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.verifyState}</div>
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
      return (
        <TabPane tab={tabName} key={tabName} >
          <Button type="primary"
            style={{margin:'0 auto',marginTop:'0.1rem',width:'98%'}}
            onClick={()=>this.onClickAddEdit()}>
            <Icon type="plus" />新建
          </Button>
          {
            this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null
          }
          {
            (!this.state.isLoading && this.state.listData.length<=0)?
            <div style={{textAlign:'center'}}>暂无数据</div>:null
          }
          {(!this.state.showAddEdit && !this.state.showDetail)?(<ListView
            dataSource={this.state.dataSource}
            renderRow={listRow}
            renderSeparator={separator}
            renderFooter={listViewRenderFooter}
            initialListSize={this.state.currentpage*10}
            pageSize={this.state.currentpage*10}
            scrollRenderAheadDistance={400}
            scrollEventThrottle={20}
            useBodyScroll={true}
            scrollerOptions={{ scrollbars: false }}
          />):null}
        </TabPane>);
    });
    return (
      <div className="noticeList">
          <Tabs defaultActiveKey={this.state.activeTabkey}
          pageSize={4}
          swipeable={false}
          onTabClick={this.handleTabClick}>
            {multiTabPanels}
          </Tabs>
          <WhiteSpace />
          {this.state.showAddEdit?
            (
              <Notice_AddEditComp
                tokenunid={this.props.tokenunid}
                afterAddNewCall={this.afterAddNewCall}
                backToTableListCall={()=>this.backToTableListCall()}
                />
            ):null}
          {this.state.showDetail?
            (
              <Notice_DetailComp
                tokenunid={this.props.tokenunid}
                detailInfo={this.state.detailInfo}
                backToTableListCall={()=>this.backToTableListCall()}
                />
            ):null}
      </div>
    )
  }
}

NoticeList.defaultProps = {
};
NoticeList.propTypes = {
};

export default NoticeList;
