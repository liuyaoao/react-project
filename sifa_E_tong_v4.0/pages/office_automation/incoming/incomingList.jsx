//收文管理
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Modal,WhiteSpace, SwipeAction,Toast, Tabs, RefreshControl, ListView} from 'antd-mobile';
import { Icon,Button} from 'antd';
const TabPane = Tabs.TabPane;

const alert = Modal.alert;
//收文管理
class IncomingList extends React.Component {
  constructor(props) {
      super(props);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        tabsArr:["待办", "办理中", "已终结", "已发布","按时间", "所有"],
        activeTabkey:'待办',
        colsNameCn:["收文日期","收文号","来文单位","来文文号","文件标题","主办部门", "当前办理人","办理时限"],
        colsNameEn:["acceptDate", "acceptNum", "sendUnit", "sendNum", "fileTitle","department","curUsers","handleTime"],
        currentpage:1, //当前页码。
        totalPageCount:1, //总页数。
        isLoading:false, //是否在加载列表数据
        isMoreLoading:false, //是否正在加载更多。
        hasMore:false, //是否还有更多数据。
        listData:[],
        isLoading:false,
        dataSource: dataSource.cloneWithRows([]),
        showDetail:false,
        showAdd:false,
        tokenunid:'',
      };
  }
  componentWillMount(){
    if(this.props.location.pathname!="/office_automation/incoming_list"){
      this.setState({ showAdd:false,showDetail:true,detailInfo:{} });
    }
  }
  componentDidMount(){
    //从服务端获取数据。
    this.getServerListData(this.state.activeTabkey,this.state.currentpage);
  }
  componentWillReceiveProps(nextProps){
    // console.log("nextProps---this.props---:",nextProps, this.props);
    if(nextProps.location.pathname=="/office_automation/incoming_list" && nextProps.location.pathname!=this.props.location.pathname){
      this.setState({ showAdd:false,showDetail:false,detailInfo:{} });
      //从服务端获取数据。
      this.getServerListData(this.state.activeTabkey,this.state.currentpage);
    }
  }
  getServerListData = (keyName,currentpage)=>{
    let loginInfo = localStorage.getItem(OAUtils.OA_LOGIN_INFO_KEY);
    let tokenunid = JSON.parse(loginInfo)['tockenunid'];
    this.setState({
      tokenunid,
      isLoading:true
    });
    OAUtils.getIncomingListData({
      tokenunid: tokenunid,
      currentpage:currentpage,
      keyName:keyName,
      viewcolumntitles:this.state.colsNameCn.join(','),
      successCall: (data)=>{
        // console.log("get 收文管理的-list data:",data);
        this.setState({isLoading:false});
        let {colsNameEn} = this.state;
        let parseData = OAUtils.formatServerListData(colsNameEn, data.values);
        let listData = this.state.listData.concat(parseData);
        this.setState({
          isLoading:false,
          isMoreLoading:false,
          currentpage:currentpage+1,
          totalPageCount:data.totalcount,
          hasMore:(currentpage+1)<=data.totalcount,
          listData:listData,
          dataSource: this.state.dataSource.cloneWithRows(listData),
        });
      },
      errorCall: (data)=>{
        this.setState({isLoading:false});
      }
    });
  }
  onClickLoadMore = (evt)=>{
    let {currentpage,totalPageCount,hasMore} = this.state;
    if (!this.state.isMoreLoading && !hasMore) {
      return;
    }
    this.setState({ isMoreLoading: true });
    this.getServerListData(this.state.activeTabkey,currentpage);
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
    // console.log("incomingList click rowData:",rowData);
    this.setState({detailInfo:rowData, showDetail:true,showAdd:false,});
    Toast.info(<div><Icon type={'loading'} /><span>  加载中...</span></div>, 2, null, true);
    browserHistory.push('/office_automation/incoming_list/detail?unid='+rowData.unid);
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
      ></div>
    );
    const listRow = (rowData, sectionID, rowID) => {
      return (
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
              <div>主办部门：<span>{rowData.department}</span></div>
              <div>当前办理人：<span>{rowData.curUsers}</span></div>
            </div>
            <div className={'list_item_left'}>
              <span className={'list_item_left_icon'} >
                <Icon type="schedule" style={{fontSize:'3em'}} />
              </span>
            </div>
            <div className={'list_item_right'}>
              <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.acceptDate}</div>
              {/*<div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.verifState}</div>*/}
            </div>
          </div>
      </div>
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
    };
    //生产各个tab页的内容页。
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      let {dataSource} = this.state;
      if(this.state.activeTabkey != tabName){
        dataSource = this.state.dataSource.cloneWithRows([]);
      }
      return (<TabPane tab={tabName} key={tabName} >
        {this.state.isLoading?<div style={{textAlign:'center'}}><Icon type="loading"/></div>:null}
        {(!this.state.isLoading && this.state.listData.length<=0)?
          <div style={{textAlign:'center'}}>暂无数据</div>:null}
        {!this.state.showDetail?(
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
            scrollerOptions={{ scrollbars: true }}/>
        ):null}
      </TabPane>);
    });

    return (
      <div>
        <Tabs defaultActiveKey={this.state.activeTabkey} pageSize={5} swipeable={false} onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showDetail?this.props.children:null}
      </div>
    )
  }
}

IncomingList.defaultProps = {
};
IncomingList.propTypes = {
};

export default IncomingList;
