//督办管理
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { Modal,WingBlank, WhiteSpace,Popup, SwipeAction,Button, Tabs, RefreshControl, ListView,SearchBar} from 'antd-mobile';
import { Icon} from 'antd';
const TabPane = Tabs.TabPane;

import SuperviseAdd from './superviseAdd_comp.jsx';
import SuperviseDetail from './superviseDetail_comp.jsx';

const alert = Modal.alert;
const loginUrl = 'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.ValidatePerson';

//督办管理
class SuperviseList extends React.Component {
  constructor(props) {
      super(props);
      this.showDeleteConfirmDialog = this.showDeleteConfirmDialog.bind(this);
      const dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        loginUrl:loginUrl,
        url:'http://10.192.0.241/openagent?agent=hcit.project.moa.transform.agent.OpenMobilePage',
        moduleUrl:'/openagent?agent=hcit.project.moa.transform.agent.MobileViewWork', //模块url,当前是通知通告模块
        tabsArr:["待办", "办理中", "已办结", "所有"],
        activeTabkey:'待办',
        listData:[],
        dataSource: dataSource.cloneWithRows([]),
        tokenunid:'',
        refreshing: true,
        showAdd:false,
        showDetail:false,
      };
  }
  componentWillMount(){
    const data = [{
      key: '1',
      title:'督办管理111',
      superviseType: '督办A',
      handleUsers: '吴龙',
      sendTime:'2017/06/21'
    }, {
      key: '2',
      title:'督办管理2222',
      superviseType: '督办B',
      handleUsers: '吴龙,王焕清',
      sendTime:'2017/05/01'
    }, {
      key: '3',
      title:'督办管理333',
      superviseType: '督办A',
      handleUsers: '吴龙,王焕清,尹小英',
      sendTime:'2017/06/01'
    }];
    //本地假数据
    setTimeout(() => {
      this.setState({
        listData:data,
        dataSource: this.state.dataSource.cloneWithRows(data),
        refreshing: false
      });
    }, 1000);
    // this.loginOASystem();
    //从服务端获取数据。
    // this.getServerListData();
  }
  onRefresh = () => {
    if(this.state.refreshing){ //如果正在刷新就不用重复刷了。
      return;
    }
    console.log('onRefresh');
    this.setState({ refreshing: true });
    //本地假数据
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.state.listData),
        refreshing: false
      });
    }, 2000);
    //从服务端获取数据。
    // this.getServerListData();
  }
  loginOASystem = ()=>{
    var param = encodeURIComponent(JSON.stringify({
			"ver" : "2",
			"params" : {
				"username" : 'whq',
				"password" : '123'
			}
		}));
    $.ajax({
				url : this.state.loginUrl,
				data : {
					"param" : param
				},
				async : true,
				success : (result)=>{
					var data  = decodeURIComponent(result);
          data = data.replace(/%20/g, " ");
					console.log("get server login data:",data);
          if(data.code == "1"){
            // this.setState({
            //   listData:data,
            // });
          }
				}
			});
  }
  getServerListData = ()=>{ //从服务端获取列表数据
    var param = encodeURIComponent(JSON.stringify({
			"ver" : "2",
			"params" : {
				"key" : 10,
				"currentpage" : 1,
				"viewname" : "hcit.module.qbgl.ui.VeCld",
				"viewcolumntitles" : "文件标题,主办部门,拟稿日期,当前办理人,办理状态"
			}
		}));
    $.ajax({
				url : this.state.url,
				data : {
					"tokenunid" : "7503071114382B3716EAC10A53773B25",
					"param" : param,
          "url" : this.state.moduleUrl
				},
				async : true,
				success : (result)=>{
					var data  = decodeURIComponent(result);
          data = data.replace(/%20/g, " ");
					console.log("get server notice list data:",data);
          if(data.code == "1"){
            this.setState({
              listData:data,
              dataSource: this.state.dataSource.cloneWithRows(data.values),
              refreshing: false
            });
          }
				}
			});

  }
  showDeleteConfirmDialog = (record)=>{
    let selectedId = record.id ? record.id : '';
    alert('删除', '确定删除么??', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmDelete(selectedId) },
    ]);
  }
  confirmDelete = (selectedId)=>{ //确认删除
    //TODO.
  }
  handleTabClick = (key)=>{
    this.setState({
      activeTabkey:key
    });
  }
  onClickOneRow = (rowData)=>{
    console.log("incomingList click rowData:",rowData);
    this.setState({showDetail:true});
  }
  onClickAddNew = ()=>{
    this.setState({showAdd:true});
  }
  backToTableListCall = ()=>{   //返回到列表页。
    this.setState({showAdd:false,showDetail:false});
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
                <div style={{color:'black',fontSize:'0.33rem',fontWeight:'bold'}}>{rowData.title}</div>
                <div>当前办理人：<span>{rowData.handleUsers}</span></div>
              </div>
              <div className={'list_item_left'}>
                <span className={'list_item_left_icon'} >
                  <Icon type="schedule" style={{fontSize:'3em'}} />
                </span>
              </div>
              <div className={'list_item_right'}>
                <div style={{position:'absolute',top:'0',right:'0'}}>{rowData.sendTime}</div>
                <div style={{ position:'absolute',bottom:'-1rem',right:'0' }}>{rowData.superviseType}</div>
              </div>
            </div>
        </div>
      </SwipeAction>
      );
    };
    let multiTabPanels = this.state.tabsArr.map((tabName,index)=>{
      return (<TabPane tab={tabName} key={tabName} >
        <WhiteSpace />
        <WingBlank>
          <Button className="btn" type="primary" onClick={this.onClickAddNew}><Icon type="plus"/>新建</Button>
        </WingBlank>
        <SearchBar placeholder="搜索" />
        {(!this.state.showAdd && !this.state.showDetail)?(<ListView
          dataSource={this.state.dataSource}
          renderRow={listRow}
          renderSeparator={separator}
          initialListSize={5}
          pageSize={5}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
          }}
          useBodyScroll={true}
          scrollerOptions={{ scrollbars: false }}
          refreshControl={<RefreshControl
            loading={(<Icon type="loading" />)}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
        />):null}
      </TabPane>);
    });

    return (
      <div>
        <Tabs defaultActiveKey={this.state.activeTabkey}
          pageSize={5}
          swipeable={false}
          onTabClick={this.handleTabClick}>
          {multiTabPanels}
        </Tabs>
        <WhiteSpace />
        {this.state.showAdd?<SuperviseAdd backToTableListCall={this.backToTableListCall}/>:null}
        {this.state.showDetail?<SuperviseDetail backToTableListCall={this.backToTableListCall}/>:null}
      </div>
    )
  }
}

SuperviseList.defaultProps = {
};
SuperviseList.propTypes = {
};

export default SuperviseList;
