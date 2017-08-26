import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';
import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');

require('!script!../../public/javascripts/paper-full.min.js');
import InfoModal from 'components/architecture/infoModal';
var ReactWidgets = require('react-widgets');
var widget = require('./widget.js');
import AppConfig from 'util/AppConfig';

var SERVERADDRESS = AppConfig.gl2ServerUrl();//192.168.54.110:8080    192.168.9.163:8080  192.168.6.18   192.168.9.241:9000

const AlarmInfoPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  getInitialState: function() {
      return {
          initFrom: 1,
          initNumPerPage: 25,
          initCurrentPage: 1,
          errorLogList:[],
          errorLogCount:0
      }
  },
  //获取table数据
  getData(data){
    var startFrom = 1;
    var endTo = 25;
    var startDate =  Date.parse($("#errorFlowStartTime").find('input').val().replace(/-/,"/"));
    var endDate = Date.parse($("#errorFlowEndTime").find('input').val().replace(/-/,"/"));
    if(data != null){
      startFrom = data.from;
      endTo = data.to;
      startDate = data.startTime;
      endDate = data.endTime;
    }
    var _this = this;
    var address = SERVERADDRESS+"/business?action=allerror&id=&start="+startDate+"&end="+endDate+"&from="+startFrom+"&to="+endTo;
    $.ajax({
          type: "get",
          async: false,
          url: address,
          dataType: "json",
          cache:false,
          success: function (data) {
            _this.setState({errorLogCount:data.total});
            _this.setState({errorLogList:data.list});
          },
          timeout: 30000,
          error: function (data) {

          }
        });
  },
  componentWillUnmount(){
    $('#businessNav').attr("class","");
  },
  valueFormatter(value,row){
    if(value == undefined) return;
    return value+"ms";
  },
  getIntegralTime(){
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  },
  _request(param){

    var errorFlowStartTime = Date.parse($("#errorFlowStartTime").find('input').val().replace(/-/,"/"));
    var errorFlowEndTime = Date.parse($("#errorFlowEndTime").find('input').val().replace(/-/,"/"));
    console.log('yoyo=========',errorFlowStartTime,errorFlowEndTime);
    // console.log('slaCreateTime==',today.toString());
    var _this = this;
        var data = {};
        data.startTime = errorFlowStartTime;
        data.endTime = errorFlowEndTime;
        data.from = param.range.from - 1;
        data.to = param.range.to-param.range.from + 1;
        if(param.sort_name) data.sort_name=param.sort_name;
        if(param.sort_order) data.sort_order=param.sort_order;
        // this.getFlux().actions.AssetManageActions.get_monitor_data({
        // this.props.get_monitor_data({
        //     data: data
        // });
        this.getData(data);
  },
  onClickRow(e){
    var _this = this;
    var address = SERVERADDRESS+"/business?action=listmsg&id="+e.businessID;
    $.ajax({
          type: "get",
          async: false,
          url: address,
          dataType: "json",
          cache:false,
          success: function (data) {
            _this.refs.errorFlowModal.refreshTable(data);
            _this.refs.errorFlowModal.setCurrentId(e.businessID);
          },
          timeout: 30000,
          error: function (data) {
            console.log('错误记录：',data);
          }
        });
    this.refs.errorFlowModal.show();
  },
  onQuery(){
    // this.getColumns(null);
    this.getData(null);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    var columns = [
    {
        field: 'state',
        checkbox: true,
    }, {
        title: '业务ID',
        field: 'businessID',
        halign: 'left',
        align: 'left',
        sortable: true
    },{
        title: 'RA 耗时',
        field: 'raDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: 'CA 耗时',
        field: 'caDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: 'KM 耗时',
        field: 'kmDuration',
        formatter: this.valueFormatter,
        halign: 'left',
        align: 'left',
        sortable: true
    }, {
        title: '开始时间',
        field: 'startTime',
        sortable: true,
        halign: 'left',
        align: 'left'
    }, {
        title: '结束时间',
        field: 'endTime',
        sortable: true,
        halign: 'left',
        align: 'left'
    }, {
        field: 'EQUIPMENTTYPE',
        visible: false
    }];
    return (
      <div >
        <InfoModal/>

        <PageHeader title="告警信息">
          <span>告警信息展示。</span>

        </PageHeader>

        <Row className="content">
          <widget.ErrorFlowModal ref="errorFlowModal"/>
            <div className="form-inline" role="form" style={{textAlign:'end',marginRight:'auto'}}>
              <div className="form-group">
                <span style={{fontSize:'16px'}}>时间段: </span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                  <ReactWidgets.DateTimePicker format={"yyyy-MM-dd HH:mm:ss"} id="errorFlowStartTime" defaultValue={this.getIntegralTime()}/>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <span style={{fontSize:'16px'}}>至: </span>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                  <ReactWidgets.DateTimePicker format={"yyyy-MM-dd HH:mm:ss"} id="errorFlowEndTime" defaultValue={new Date()}/>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <button type="button" className="btn btn-success" onClick={this.onQuery}>查询</button>
              </div>
              <div className="form-group" style={{marginLeft:"15px"}}>
                <LinkContainer to={Routes.BUSINESSFLOWVIEW}>
                  <button type="button" className="btn btn-success">查看业务流程图</button>
                </LinkContainer>

              </div>
            </div>
            {/**
            <canvas id="canvas" style={{width:"100%", height:"100%", backgroundColor:"white"}}></canvas>*/}
            <widget.PaginationTable
                          initFrom={this.state.initFrom}
                          initNumPerPage={this.state.initNumPerPage}
                          initCurrentPage={this.state.initCurrentPage}
                          columns={columns}
                          list={this.state.errorLogList}
                          id={"alarmInfoTable"}
                          count={this.state.errorLogCount}
                          onClickRow={this.onClickRow}
                          onClickSort={this.onClickSort}
                          onClickRefresh={this.onClickRefresh}
                          request={this._request} />

        </Row>
      </div>
    );
  },
});

export default AlarmInfoPage;
