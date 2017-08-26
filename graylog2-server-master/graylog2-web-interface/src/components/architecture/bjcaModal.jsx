import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import AppConfig from 'util/AppConfig';

require('!script!../../../public/javascripts/bootstrap-table-dist/bootstrap-table.min.js');
require('!script!../../../public/javascripts/bootstrap-table-dist/locale/bootstrap-table-zh-CN.min.js');
// require('!style/useable!css!../../../public/javascripts/bootstrap-table-dist/bootstrap-table.min.css')

var newData = [
    // { quotaName:'每分钟业务数 (笔)', quotaValue:'' },
    { quotaName:'总业务数 (笔)', quotaValue:'' },
    { quotaName:'业务平均时间 (毫秒)', quotaValue:'' },
    { quotaName:'最大业务时间 (毫秒)', quotaValue:'' },
    { quotaName:'最小业务时间 (毫秒)', quotaValue:'' },
    { quotaName:'最后业务结束时间', quotaValue:'' }
];

var arrayDropValue = [
  {key:'5m',value:'5分钟'},
  {key:'10m',value:'10分钟'},
  {key:'30m',value:'30分钟'},
  {key:'2h',value:'2小时'},
  // {key:'8h',value:'8小时'},
  // {key:'24h',value:'24小时'}
];
var dataList = [];

const BjcaModal = React.createClass({
  getInitialState: function() {
    return {
      isShow:false,
      isShowSelect:false,
      dropDownValue: arrayDropValue[0].value,
      defaultTime: '5m', //相对搜索默认时间  m h
      errorLogList:[],
      errorLogCount:0,
      newData: newData,
      ipAddress:""
    }
  },
  componentDidMount() {
    $('#infoTable').bootstrapTable({
        columns: [
            {
              field: 'quotaName',
              width: 150,
              sortable: false
            }, {
                field: 'quotaValue',
                sortable: false
              }
          ],
        data: this.state.newData
      });
      //hover时 dropdown显示
      var hoverTimeout;
      $('.dropdown').hover(function() {
          clearTimeout(hoverTimeout);
          $(this).addClass('open');
      }, function() {
          var $self = $(this);
          hoverTimeout = setTimeout(function() {
              $self.removeClass('open');
          }, 50);
      });
    $('#infoModal').on('hidden.bs.modal', function (e) {
      this.setState({defaultTime:'5m'});
      this.setState({dropDownValue: arrayDropValue[0].value});
    }.bind(this))
  },
  _clearData(){
    $("#ipAddress").val("");
    $("#infoTable").bootstrapTable('removeAll');
  },
  componentWillUpdate: function(nextProps, nextState){
      var _this = this;
     if (nextProps.hostname){
       $("#ipAddress").val(nextProps.ipAddress);
       $("#infoTable").bootstrapTable('load',{data: nextProps.newData});
     }
     if(nextState.ipAddress !== this.state.ipAddress) {
       $("#ipAddress").val(nextState.ipAddress);
       $("#infoTable").bootstrapTable('load',{data: nextState.newData});
     }
     return true;
   },
  getData(data){
    var _this = this;
      var now = new Date();
      var sD = '';//起始时间    结束时间 -起始时间
      var eD = '';
        // var time = now.getTime() - 1000*60*30;//过去30分钟
      var tString = this.state.defaultTime;
      var searchTime= '';
      if(data != null){
        var ipAddress = data.ip;
        var type = data.type;
        var savekey = data.name;
        var hostname = data.hostname;
      }
      // console.log(tString);
      if(tString.indexOf('m') > 0){//5 15 30
        var newStr=tString.replace("m","");
        var time = now.getTime()-1000*60*newStr;
        // console.log('过去半小时？',new Date(time));
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }else if(tString.indexOf('h') > 0){ //1 2 8
        var newStr=tString.replace("h","");
        var time = now.getTime()-1000*60*60*newStr;
        sD = Date.parse(new Date(time));
        eD = Date.parse(now);
        // console.log('sD=',sD,'eD=',eD);
      }
      var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";
      // var address = SERVERADDRESS+"business?action=bsstatistics&id=&start="+sD+"&end="+eD+"&from=&to=&type="+type+"&ip="+ipAddress;
      // configtype = saveconfig, queryconfig
      // SERVERADDRESS = "http://220.168.30.12:10063/";
      var address = SERVERADDRESS+"business?action=bsstatistics&id=&start="+sD+"&end="+eD+"&from=&to=&bstype="+type+"&ip="+ipAddress+"&bushostname="+hostname+"&configtype=saveconfig";
      // console.log(address);
      $.ajax({
            type: "get",
            async: false,
            url: address,
            dataType: "json",
            cache:false,
            success: function (data) {
              if (type == 'message') {
                var results = [
                    { quotaName:'总记录数 (笔)', quotaValue:data.total},
                    { quotaName:'平均记录数 (笔)', quotaValue:data.avgtotal},
                    { quotaName:'最后记录时间', quotaValue:data.endTime}
                ];
              } else {
                var results = [
                    // { quotaName:'每分钟业务数 (笔)', quotaValue:data.avgbuseiness },
                    { quotaName:'总业务数 (笔)', quotaValue:data.total},
                    { quotaName:'业务平均时间 (毫秒)', quotaValue:data.avgtotal},
                    { quotaName:'最大业务时间 (毫秒)', quotaValue:data.maxTime},
                    { quotaName:'最小业务时间 (毫秒)', quotaValue:data.minTime},
                    { quotaName:'最后业务结束时间', quotaValue:data.endTime}
                ];
              }
              _this.setState({newData:results, ipAddress: ipAddress});
            },
            timeout: 30000,
            error: function (data) {

            }
          });
  },
  bindIP(){
    var job = [];
    if(window.localStorage.job){
      job = JSON.parse(window.localStorage.job);
    }
    var ipAddress = $.trim($("#ipAddress").val());
    var data = {};
    data.ip = ipAddress;
    data.type = this.props.deviceType;
    data.name = this.props.deviceName;
    data.hostname = this.props.hostname;
    job.push(data);
    // window.localStorage.job = JSON.stringify(job); //将storage转变为字符串存储
    console.log('data-------------', data);
    this.getData(data);
  },

  onDropdown(){
    if(this.state.isShowSelect){
      this.setState({isShowSelect:false});
    }else{
      this.setState({isShowSelect:true});
    }
    this.setState({isShow:false});
  },
  onLiTime(obj){
    this.setState({defaultTime:obj.key});
    this.setState({dropDownValue: obj.value});
    var data = {};
    data.ip = '';
    data.type = this.props.deviceType;
    data.name = this.props.deviceName;
    data.hostname = this.props.hostname;
    this.props.getQueryData(data, obj.key);
  },
  render() {
    var way = arrayDropValue.map(function(obj,i){
      return(
        <li role="presentation" key={obj.value} onClick={this.onLiTime.bind(this,obj)}><a role="menuitem" tabIndex="-1" href="#">{obj.value}</a></li>
      )
    }.bind(this));
    return (
            <div className="modal fade" id="infoModal" tabIndex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true">
                <div className="modal-dialog infoModalDialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h5 className="modal-title">详细信息</h5>
                        </div>
                        <div className="modal-body">
                            <div className="top-form">

                              <div className="form-group pull-left" style={{marginLeft:"15px"}}>
                                <ButtonToolbar>
                                  <DropdownButton title={this.state.dropDownValue} ref="onDropdownValue" id='dropdownMenu1' bsStyle="info" onSelect={this.onDropdown}>
                                    {way}
                                  </DropdownButton>
                                </ButtonToolbar>
                              </div>
                              <input type="text" className="form-control pull-left" style={{width:"180px"}}  placeholder="在此输入您IP地址" id="ipAddress"/>
                              <button type="button" className="btn btn-success pull-left" onClick={this.bindIP}>绑定</button>
                            </div>
                            <table id="infoTable"
                                   data-toggle="table"
                                   data-classes="table table-no-bordered table-striped table-hover">
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-success" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
  },
});

export default BjcaModal;
