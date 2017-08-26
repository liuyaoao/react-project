import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import PageHeader from 'components/common/PageHeader';
import { Spinner } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
import moment from 'moment';
// var cettia = require("cettia-client");
require('!script!../../public/javascripts/echarts-2.2.7/dist/echarts-all.js');
require('!script!../../public/javascripts/cettia.min.js');

var ReactWidgets = require('react-widgets');
var Globalize = require('globalize');
var globalizeLocalizer = require('react-widgets/lib/localizers/globalize');
globalizeLocalizer(Globalize);
import AppConfig from 'util/AppConfig';
var socket, bBusinessViewPageMounted = false, isOpen = false;

const alarmOnUrl = require('images/alarmOn.gif');
const alarmOffUrl = require('images/alarmOff.gif');

Date.prototype.Format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

function isTime(str)
{
    var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
    if (a == null) {
        return false;
    }
    if (a[1]<0 || a[1]>24 || a[3]<0 || a[3]>60 || a[4]<0 || a[4]>60)
    {
        return false
    }
    return true;
}

function durationFormatter(value, row) {
  var min = 500, max = 800;
  if (row.businessName == 'KM') {
    min = 100, max = 160;
  } else {
    min = 500, max = 800;
  }
    if(value <= min) {
        return [
            '<span style="color:#00aa00">',
            value,
            '</span>'
        ].join('');
    }
    else if(value > min && value <= max) {
        return [
            '<span style="color:#f08000">',
            value,
            '</span>'
        ].join('');
    }
    else if(value > max) {
        return [
            '<span style="color:#cc0000">',
            value,
            '</span>'
        ].join('');
    }
}

function showDateTimePicker() {
  var $self = $(this);
  $self.addClass("rw-state-focus rw-open");
  $self.find(".rw-select").next().css({"display":"block","overflow":"visible"});
  $self.find(".rw-select").next().find(".rw-popup").css({"transform":"translateY(0px)"});
}
function hideDateTimePicker() {
  var $self = $(this);
  $self.find(".rw-select").next().css({"display":"none","overflow":"hidden"});
  $self.find(".rw-select").next().find(".rw-popup").css({"position":"absolute","transform":"translateY(-100%)"});
  $self.removeClass("rw-state-focus rw-open");
}

var totalTimeGauge, CATimeGauge, RATimeGauge, KMTimeGauge, timeChart;
var gaugeOption, gaugeOption_total, chartOption;
var timeTicket;
var SERVERADDRESS = AppConfig.gl2ServerUrl();//192.168.54.110:8080    192.168.9.163:8080  192.168.6.18
const BusinessViewPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  getInitialState() {
    return {
        bRefresh: true,
        sourceData: [],
        businessTableData: [],
        searchOptions: {},
        audioAlarmUrl: ''
    };
  },
  componentDidMount() {
    totalTimeGauge = echarts.init(document.getElementById('totalTime_gaugeDiv'), 'macarons');
    CATimeGauge = echarts.init(document.getElementById('CATime_gaugeDiv'), 'macarons');
    RATimeGauge = echarts.init(document.getElementById('RATime_gaugeDiv'), 'macarons');
    KMTimeGauge = echarts.init(document.getElementById('KMTime_gaugeDiv'), 'macarons');
    timeChart = echarts.init(document.getElementById('time_chartDiv'), 'macarons');
    gaugeOption = {
        tooltip : {
            // formatter: "{a} <br/>{b} : {c}%"
            formatter: "{b} : {c}ms"
        },
        series : [
            {
                // name:'业务指标',
                type:'gauge',
                radius: [0, '100%'],
                max: 1000,
                splitNumber: 10,       // 分割段数，默认为5
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.5, '#00aa00'],[0.8, '#f08000'],[1, '#cc0000']],
                        width: 18
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 5,   // 每份split细分多少段
                    length :8,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: '#eee'
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        // fontSize: 2,
                    }
                },
                splitLine: {           // 分隔线
                    show: true,        // 默认显示，属性show控制显示与否
                    length :18,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: '#eee'
                    }
                },
                pointer : {
                    width : 3
                },
                title : {
                    show : true,
                    offsetCenter: [0, '80%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 16,
                        color: '#5ab1ef'
                    }
                },
                detail : {
                    formatter:'{value}ms',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 16,
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 0, name: ''}]
            }
        ]
    };

    gaugeOption_total = {
        tooltip : {
            // formatter: "{a} <br/>{b} : {c}%"
            formatter: "{b} : {c}ms"
        },
        series : [
            {
                // name:'业务指标',
                type:'gauge',
                radius: [0, '90%'],
                max: 2200,
                splitNumber: 10,       // 分割段数，默认为5
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: [[0.5, '#00aa00'],[0.8, '#f08000'],[1, '#cc0000']],
                        width: 8
                    }
                },
                axisTick: {            // 坐标轴小标记
                    splitNumber: 10,   // 每份split细分多少段
                    length :12,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    show: true,        // 默认显示，属性show控制显示与否
                    length :24,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                pointer : {
                    width : 5
                },
                title : {
                    show : true,
                    offsetCenter: [0, '80%'],       // x, y，单位px
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 24,
                        color: '#00aa00'
                    }
                },
                detail : {
                    formatter:'{value}ms',
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: 'auto',
                        fontSize: 24,
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 0, name: '总时长'}]
            }
        ]
    };
    gaugeOption.series[0].data[0].value = 0;
    gaugeOption.series[0].data[0].name = "CA";
    CATimeGauge.setOption(gaugeOption,true);
    gaugeOption.series[0].data[0].value = 0;
    gaugeOption.series[0].data[0].name = "RA";
    RATimeGauge.setOption(gaugeOption,true);
    gaugeOption.series[0].data[0].value = 0;
    gaugeOption.series[0].data[0].name = "KM";
    gaugeOption.series[0].max = 200;
    KMTimeGauge.setOption(gaugeOption,true);
    gaugeOption_total.series[0].data[0].value = 0;
    totalTimeGauge.setOption(gaugeOption_total,true);

    chartOption = {
        tooltip : {
            trigger: 'axis',
            formatter: "{b} <br/> {a0} : {c0}ms <br/> {a1} : {c1}ms <br/> {a2} : {c2}ms"
        },
        legend: {
            data:['CA', 'RA', 'KM']
        },
        dataZoom: {
            show: true,
            start : 66,
            end : 100,
        },
        xAxis: [
            {
                type : 'category',
                boundaryGap : false,
                data : (function (){
                    var now = new Date();
                    var res = [];
                    var len = 30;
                    while (len--) {
                        // res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                        res.unshift(now.Format("hh:mm:ss"));
                        now = new Date(now - 1000);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type : 'value',
                min: 0,
                max: 3000,
                scale: false,
                name : '时长(ms)',
                boundaryGap: [0.2, 0.2]
            }
        ],
        series : [
            {
                name:'CA',
                type:'line',
                stack:'总时长',
                itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'right'}}},
                data:(function (){
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.push(0);
                    }
                    return res;
                })()
            },
            {
                name:'RA',
                type:'line',
                stack:'总时长',
                itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'right'}}},
                data:(function (){
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.push(0);
                    }
                    return res;
                })()
            },
            {
                name:'KM',
                type:'line',
                stack:'总时长',
                itemStyle: {normal: {areaStyle: {type: 'default'}, label: {show: true, position: 'right'}}},
                data:(function (){
                    var res = [];
                    var len = 30;
                    while (len--) {
                        res.push(0);
                    }
                    return res;
                })()
            }
        ]
    };
    timeChart.setOption(chartOption,true);
    // timeChart.on("click", this.eConsole);

    $('#businessTable').bootstrapTable({
        columns: [
            {
                title: '业务名称',
                field: 'businessName',
                // width: 120,
                sortable: false
            }, {
                title: '时长(ms)',
                field: 'duration',
                // width: 150,
                sortable: false,
                formatter: durationFormatter
            }, {
                title: '时间',
                field: 'time',
                // width: 150,
                sortable: false
            }
        ],
        data: this.state.businessTableData
    });

    // if(this.state.bRefresh) {
    //     timeTicket = setInterval(this.intervalFunc, 1000);
    // }

    // get audioalarm url
    // this._getAlertAudioUrl();

    $(window).resize(function () {
        CATimeGauge.resize();
        RATimeGauge.resize();
        KMTimeGauge.resize();
        totalTimeGauge.resize();
        timeChart.resize();
    });

    bBusinessViewPageMounted = true;
    this.socketConnect();
    // $("#searchTimeFrom").mouseover(showDateTimePicker);
    // $("#searchTimeFrom").mouseout(hideDateTimePicker);
    // $("#searchTimeTo").mouseover(showDateTimePicker);
    // $("#searchTimeTo").mouseout(hideDateTimePicker);

    var searchBusinessName = document.getElementById("searchBusinessName").value;
    var searchDurationFrom = document.getElementById("searchDurationFrom").value;
    var searchDurationTo = document.getElementById("searchDurationTo").value;
    // var searchTimeFrom = document.getElementById("searchTimeFrom").childNodes[0].value;
    // var searchTimeTo = document.getElementById("searchTimeTo").childNodes[0].value;
    var searchOptions = {
      searchBusinessName,
      searchDurationFrom: searchDurationFrom ? parseInt(searchDurationFrom) : "",
      searchDurationTo: searchDurationTo ? parseInt(searchDurationTo) : ""
    }
    this.setState({searchOptions: searchOptions});
  },
  componentDidUpdate() {
    //   if(this.state.bRefresh) {
          $('#businessTable').bootstrapTable('resetView');
          $('#businessTable').bootstrapTable('load', this.state.businessTableData);
          $('#businessTable').bootstrapTable('scrollTo', 'bottom');
    //   }
  },
  componentWillUnmount() {
      clearInterval(timeTicket);
      bBusinessViewPageMounted = false;
      // socket.send("close");
      socket.close();
    //   socket = null;
  },
  socketConnect() {
      var _this = this;
      socket = cettia.open(SERVERADDRESS+"/cettia", {reconnect: false});
      socket.on("new", function() {
        console.log("on new");
      });
      // When the selected transport starts connecting to the server
      socket.on("connecting", function() {
        console.log("on connecting");
      });
      // When the connection is established successfully
      socket.on("open", function() {
        console.log("on open");
      });
      // When an error happens on the socket
      socket.on("error", function(error) {
        console.error("on error", error.message);
      });
      // When the connection is closed, regarded as closed or could not be opened
      socket.on("close", function() {
        console.log("on close");
        isOpen = false;
        socket.send("cmds", "cmds");
        if(bBusinessViewPageMounted) {
            _this.socketConnect();
        }
      });
      // When a reconnection is scheduled
      socket.on("waiting", function(delay, attempts) {
        console.log("on waiting", attempts, delay);
      });

      // echo and chat events
      socket.on("open", function() {
        // Text data
        // socket.send("echo", "echo");
        // socket.send("chat", "chat");
        isOpen = true;
        if(_this.state.bRefresh) {
            socket.send("cmds", "cmds");
        }
      });
    //   socket.on("echo", function(data) {
    //     console.log("on echo", data);
    //   });
    //   socket.on("chat", function(data) {
    //     console.log("on chat", data);
    //   });
      socket.on("cmds", function(data) {
        console.log(data);
        _this.receiveData(data);
        if(_this.state.bRefresh) {
            socket.send("cmds", "cmds");
        }
      });
  },
  // intervalFunc() {
  receiveData(data) {
      var dataId = data.length==0 ? 0 : data[data.length-1].id
      var value_CA = data.length==0 ? 0 : data[data.length-1].caDuration;
      var value_RA = data.length==0 ? 0 : data[data.length-1].raDuration;
      var value_KM = data.length==0 ? 0 : data[data.length-1].kmDuration;
    //   var value_CA = (Math.random()*1000).toFixed(1) - 0;
    //   var value_RA = (Math.random()*1000).toFixed(1) - 0;
    //   var value_KM = (Math.random()*1000).toFixed(1) - 0;
      gaugeOption.series[0].data[0].value = value_CA;
      gaugeOption.series[0].data[0].name = "CA";
      gaugeOption.series[0].max = 1000;
      CATimeGauge.setOption(gaugeOption,true);
      gaugeOption.series[0].data[0].value = value_RA;
      gaugeOption.series[0].data[0].name = "RA";
      gaugeOption.series[0].max = 1000;
      RATimeGauge.setOption(gaugeOption,true);
      gaugeOption.series[0].data[0].value = value_KM;
      gaugeOption.series[0].data[0].name = "KM";
      gaugeOption.series[0].max = 200;
      KMTimeGauge.setOption(gaugeOption,true);
      gaugeOption_total.series[0].data[0].value = value_CA + value_RA + value_KM;
      totalTimeGauge.setOption(gaugeOption_total,true);

      if (gaugeOption_total > 2200 * 0.8 || value_CA > 800 || value_RA > 800 || value_KM > 160) {
        console.log('触发声音告警');
        this._playOrPaused();
      }

      // var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
      var axisData = (new Date()).Format("hh:mm:ss");
      timeChart.addData([
          [
              0,        // 系列索引
              value_CA, // 新增数据
              false,     // 新增数据是否从队列头部插入
              false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              axisData
          ],
          [
              1,        // 系列索引
              value_RA, // 新增数据
              false,     // 新增数据是否从队列头部插入
              false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              // axisData
          ],
          [
              2,        // 系列索引
              value_KM, // 新增数据
              false,     // 新增数据是否从队列头部插入
              false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
              // axisData
          ]
      ]);

      var data = this.state.sourceData.slice(0);
      data.push({dataId:dataId, businessName:"CA", duration:value_CA, time:axisData});
      data.push({dataId:dataId, businessName:"RA", duration:value_RA, time:axisData});
      data.push({dataId:dataId, businessName:"KM", duration:value_KM, time:axisData});
      if(data.length > 3*60) {        //只保存过去60秒的数据
          data.splice(0, 3);
      }
      this.setState({sourceData: data}, function(){
        this.searchBusinessTable(1)
      }.bind(this));
      // this.setState({businessTableData: data});
  },
  // eConsole(param) {
  //   console.log(param);
  // },
  handleClickRefreshBtn() {
      var bRefresh = !this.state.bRefresh;
      this.setState({bRefresh: bRefresh});
      if(bRefresh) {
        //   timeTicket = setInterval(this.intervalFunc, 1000);
        bBusinessViewPageMounted = true;
        if (!isOpen) {
          this.socketConnect();
        } else {
          socket.send("cmds", "cmds");
        }

      }
      else {
          bBusinessViewPageMounted = false;
          socket.close();
          clearInterval(timeTicket);
          gaugeOption.series[0].data[0].value = 0;
          gaugeOption.series[0].data[0].name = "CA";
          CATimeGauge.setOption(gaugeOption,true);
          gaugeOption.series[0].data[0].value = 0;
          gaugeOption.series[0].data[0].name = "RA";
          RATimeGauge.setOption(gaugeOption,true);
          gaugeOption.series[0].data[0].value = 0;
          gaugeOption.series[0].data[0].name = "KM";
          KMTimeGauge.setOption(gaugeOption,true);
          gaugeOption_total.series[0].data[0].value = 0;
          totalTimeGauge.setOption(gaugeOption_total,true);
      }
  },
  searchBusinessTable(options, e) {
      var businessTableData = [];
      var searchOptions = {};
      if (options) {
        searchOptions = this.state.searchOptions;
      } else {
        var searchBusinessName = document.getElementById("searchBusinessName").value;
        var searchDurationFrom = document.getElementById("searchDurationFrom").value;
        var searchDurationTo = document.getElementById("searchDurationTo").value;
        // var searchTimeFrom = document.getElementById("searchTimeFrom").childNodes[0].value;
        // var searchTimeTo = document.getElementById("searchTimeTo").childNodes[0].value;
        searchOptions = {
          searchBusinessName,
          searchDurationFrom: searchDurationFrom ? parseInt(searchDurationFrom) : "",
          searchDurationTo: searchDurationTo ? parseInt(searchDurationTo) : ""
        }
        if((searchDurationFrom==""&&searchDurationTo!="") || (searchDurationFrom!=""&&searchDurationTo=="") || (parseFloat(searchDurationFrom)>parseFloat(searchDurationTo))) {
            alert("时长范围设置错误！");
            return;
        }
        // if(!isTime(searchTimeFrom)) {
        //     alert("起始时间格式错误！");
        //     return;
        // }
        // if(!isTime(searchTimeTo)) {
        //     alert("结束时间格式错误！");
        //     return;
        // }
        // if(searchTimeFrom>searchTimeTo) {
        //     alert("时间范围设置错误！");
        //     return;
        // }
        this.setState({searchOptions: searchOptions});
      }
      // console.log(searchOptions);
      var {searchBusinessName, searchDurationFrom, searchDurationTo} = searchOptions;
      var data = this.state.sourceData.slice(0);
      // console.log(data);
      // var today = moment().format('YYYY-MM-DD');
      for(var i = 0; i < data.length; i++) {
        // var time = moment(today + " " + data[i].time).valueOf();
        // var fromTime = moment(today + " " + searchTimeFrom).valueOf(), toTime = moment(today + " " + searchTimeTo).valueOf();
        // && (time >= fromTime && time <= toTime)
        if (((searchBusinessName != "" && data[i].businessName == searchBusinessName.toUpperCase()) || searchBusinessName == "")
          && ((searchDurationFrom == "" && searchDurationTo=="") || (data[i].duration >= searchDurationFrom && data[i].duration <= searchDurationTo))
        ) {
          // console.log(data[i].duration);
          businessTableData.push(data[i]);
        }
      }
      // console.log(businessTableData);
      this.setState({businessTableData: businessTableData});
  },
  _getAlertAudioUrl() {
    var address = SERVERADDRESS+"/business?action=audioalarm";
    // console.log(address);
    $.ajax({
          type: "get",
          async: false,
          url: address,
          dataType: "json",
          cache:false,
          success: function (data) {
            console.log(data);
            if (data.audiourl) {
              this.setState({audioAlarmUrl: data.audiourl});
            }
          },
          timeout: 30000,
          error: function (data) {

          }
        });
  },
  _playMuted() {
    var alertAudio = document.getElementById('alertAudio');
    var volumePlayTag = document.getElementById('volumePlayTag');
    // console.log(alertAudio.muted);
    if (alertAudio.muted) {
      alertAudio.muted = false;
      // volumePlayTag.className = "glyphicon glyphicon-volume-down";
      volumePlayTag.src = alarmOnUrl;
    } else {
      alertAudio.muted = true;
      // volumePlayTag.className = "glyphicon glyphicon-volume-off";
      volumePlayTag.src = alarmOffUrl;
    }
  },
  _playOrPaused() {
    var alertAudio = document.getElementById('alertAudio');
    if (!alertAudio.muted) {
      alertAudio.play();
    } else {
      console.log('已禁音');
    }
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    var today = moment().format('YYYY-MM-DD');
    // <span id="volumePlayTag" style={{fontSize: "16px"}} className="glyphicon glyphicon-volume-down"></span>
    return (
      <div>
        <div>
          <Row className="content content-head">
            <Col sm={11}>
              <h1>
                业务性能视图
              </h1>
              <p className="description">
                业务性能视图展示。
              </p>
            </Col>
            <Col sm={1}>
                <Button type="submit" bsStyle="success" className="pull-right" onClick={this.handleClickRefreshBtn}>
                  {this.state.bRefresh ? <i className="fa fa-pause" style={{marginRight:"5px"}}/> : <i className="fa fa-play" style={{marginRight:"5px"}}/>}
                  {this.state.bRefresh ? "不更新" : "更新"}
                </Button>
            </Col>
          </Row>
        </div>

        <Row className="content">
          <Col md={12}>
            <div style={{margin: "-10px 0 0 -10px"}}>
              <a href="javascript:;" onClick={this._playMuted}>
                <img id="volumePlayTag" style={{width: "30px"}} src={alarmOnUrl} />
              </a>
              <audio src="public/audio/critical.wav" controls="controls" id="alertAudio" style={{display: "none"}}></audio>
            </div>
            <div id="totalTime_gaugeDiv" style={{float:"left", width: "40%", height: "340px"}}></div>
            <div id="CATime_gaugeDiv" style={{float:"left", width: "20%", height: "200px", marginTop:"70px"}}></div>
            <div id="RATime_gaugeDiv" style={{float:"left", width: "20%", height: "200px", marginTop:"70px"}}></div>
            <div id="KMTime_gaugeDiv" style={{float:"left", width: "20%", height: "200px", marginTop:"70px"}}></div>
          </Col>
        </Row>
        <Row className="content" style={{float:"left", width: "50%"}}>
          <Col md={12}>
            <div id="time_chartDiv" style={{height: "380px"}}></div>
          </Col>
        </Row>
        <Row className="content" style={{float:"left", width: "50%", marginLeft:"45px"}}>
          <Col md={12}>
            <div>
                <div id="toolbar">
                    <div className="form-inline" role="form">
                        <div className="form-group">
                            <span>名称: </span>
                            <input id="searchBusinessName" className="form-control" style={{width:"100px"}} type="text"/>
                        </div>
                        <div className="form-group" style={{marginLeft:"5px"}}>
                            <span style={{marginRight:"5px"}}>时长:</span>
                            <input id="searchDurationFrom" className="form-control" style={{width:"80px"}} type="number" defaultValue="0"/>
                            <span style={{marginRight:"5px"}}>至</span>
                            <input id="searchDurationTo" className="form-control" style={{width:"80px"}} type="number" defaultValue="200"/>
                        </div>
                        {/*<div className="form-group" style={{display:"inline-flex",marginLeft:"5px"}}>
                            <span style={{marginRight:"5px"}}>时间:</span>
                            <ReactWidgets.DateTimePicker id="searchTimeFrom" className="dateTimePickerStyle" calendar={false} format={"HH:mm:ss"} defaultValue={new Date()} />
                            <span style={{marginRight:"5px"}}>至</span>
                            <ReactWidgets.DateTimePicker id="searchTimeTo" className="dateTimePickerStyle" calendar={false} format={"HH:mm:ss"} defaultValue={new Date(today + " " + "23:59:59")} />
                        </div>*/}
                        <button id="ok" type="submit" className="btn btn-default" style={{marginLeft:"5px"}} onClick={this.searchBusinessTable.bind(this, 0)}>OK</button>
                    </div>
                </div>
                <table id="businessTable"
                       data-toggle="table"
                       data-classes="table table-striped table-hover"
                       data-height="380"
                       data-toolbar="#toolbar"
                       data-show-toggle="true"
                       data-show-columns="true">
                </table>
            </div>
          </Col>
        </Row>
      </div>
    );
  },
});

export default BusinessViewPage;
