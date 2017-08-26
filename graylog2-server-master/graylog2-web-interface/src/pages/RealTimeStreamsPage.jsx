import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'

import { Spinner } from 'components/common';
import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

require('!script!../../public/javascripts/cettia.min.js');

var realTimeStreamsData = [];
var socket, bRealTimeStreamsViewMounted = false, bSocketOpened = false;
import AppConfig from 'util/AppConfig';

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

function infoContentFormatter(value, row) {
    return [
        '<span>',
        value,
        '</span>'
    ].join('');
}

const RealTimeStreamsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  getInitialState() {
    return {
      streams: [],
      realTimeStreamsData: []
    };
  },

  componentDidMount: function() {
      if(document.getElementById('realTimeStreamsView') != null) {
          document.getElementById('realTimeStreamsView').style.height = $(window).height() - 62 - 30 + 'px';
      };
      $('#streamsNameTable').bootstrapTable({
          columns: [
              {
                  field: 'state',
                  halign: 'center',
                  align: 'center',
                  checkbox: true
              },
              {
                  title: '消息流名称',
                  field: 'title'
              }
          ],
          onCheck: this.changeSelectedStreams,
          onUncheck: this.changeSelectedStreams,
          onCheckAll: this.changeSelectedStreams,
          onUncheckAll: this.changeSelectedStreams,
          data: this.state.streams
      });
      $('#realTimeStreamsTable').bootstrapTable({
          columns: [
              {
                  title: 'IP',
                  width: 100,
                  field: 'infoEquipmenIp'
              },
              {
                  title: '时间',
                  width: 140,
                  field: 'infoCreateDate'
              },
              {
                  title: '消息流信息',
                  field: 'infoContent',
                  formatter: infoContentFormatter
              }
          ],
          data: this.state.realTimeStreamsData
      });

      this.loadData();
      StreamsStore.onChange(this.loadData);

      bRealTimeStreamsViewMounted = true;
      this.socketConnect();
  },

  componentDidUpdate: function() {
      $('#streamsNameTable').bootstrapTable('load', this.state.streams);
      $('#realTimeStreamsTable').bootstrapTable('load', this.state.realTimeStreamsData);

      for(var i = 0; i < this.state.streams.length; i++) {
        if(this.state.streams[i].id == this.props.streamId) {
          $('#streamsNameTable').bootstrapTable('check', i);
        }
      }
  },

  componentWillUnmount() {
      socket.send("close");
      bRealTimeStreamsViewMounted = false;
      bSocketOpened = false;
      realTimeStreamsData = [];
      this.setState({realTimeStreamsData: realTimeStreamsData});
  },

  _isLoading() {
    return !this.state.currentUser;
  },

  changeSelectedStreams() {
    var selectedStreams = $('#streamsNameTable').bootstrapTable('getSelections');
    var selectedStreamNames = "";
    for(var i = 0; i < selectedStreams.length; i++) {
      if(selectedStreamNames == "") {
        selectedStreamNames += selectedStreams[i].id;
      }
      else {
        selectedStreamNames += ","+selectedStreams[i].id;
      }
    }
    if(bSocketOpened) {
      socket.send("streams", selectedStreamNames);
    }
  },

  loadData() {
    StreamsStore.load((streams) => {
      this.setState({
        streams: streams
      });
    });
  },

  socketConnect() {
      var _this = this;
      // var SERVERADDRESS = 'http://192.168.9.241:9000/';//192.168.54.110:8080    192.168.9.163:8080
      // var SERVERADDRESS = localStorage.getItem("servletServiceUrl");
      var SERVERADDRESS = AppConfig.gl2ServerUrl();
      socket = cettia.open(SERVERADDRESS+"/cettia", {reconnect: true});
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
        bSocketOpened = true;
      });
      // When an error happens on the socket
      socket.on("error", function(error) {
        console.error("on error", error);
      });
      // When the connection is closed, regarded as closed or could not be opened
      socket.on("close", function() {
        console.log("on close");
        bSocketOpened = false;
        if(bRealTimeStreamsViewMounted) {
            _this.socketConnect();
        }
      });
      // When a reconnection is scheduled
      socket.on("waiting", function(delay, attempts) {
        console.log("on waiting", attempts, delay);
      });

      socket.on("open", function() {
        var selectedStreams = $('#streamsNameTable').bootstrapTable('getSelections');
        var selectedStreamNames = "";
        for(var i = 0; i < selectedStreams.length; i++) {
          if(selectedStreamNames == "") {
            selectedStreamNames += selectedStreams[i].id;
          }
          else {
            selectedStreamNames += ","+selectedStreams[i].id;
          }
        }
        socket.send("streams", selectedStreamNames);
      });

      socket.on("streams", function(data) {
        // console.log(data);
        _this.receiveData(data);
      });
  },

  receiveData(data) {
      if(!data){
        return;
      };
      for (var i = 0; i < data.length; i++) {
        if(data[i]){
          var time = data[i].timestamp;
          var dispatchTime = new Date(parseInt(time));
          time = dispatchTime.Format("yyyy-MM-dd hh:mm:ss");

          var infoContent = "";
          for(var key in data[i]) {
            // if(key.substr(0,5) == "snmp_") {
              if(infoContent == "") {
                infoContent += key+":"+"<b>"+data[i][key]+"</b>";
              }
              else {
                infoContent += ", "+key+":"+"<b>"+data[i][key]+"</b>";
              }
            // }
          }

          var value = {
            infoEquipmenIp:data[i].gl2_remote_ip,
            infoCreateDate:time,
            infoContent:infoContent
          };

          realTimeStreamsData.unshift(value);
        }
      };
      if(realTimeStreamsData.length > 800) {
          realTimeStreamsData.splice(0, 600);
      }
      this.setState({realTimeStreamsData: realTimeStreamsData});
  },

  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    var heightvalue = $(window).height() - 240;
    return (
      <div id="realTimeStreamsView" className="hardwareAssetTableBox">
        <div>
          <Row className="content content-head">
            <Col sm={11}>
              <h1>
                实时消息
              </h1>
              <p className="description">
                实时消息展示。
              </p>
            </Col>
            {/*<Col sm={1}>
                <Button type="submit" bsStyle="success" className="pull-right" onClick={this.handleClickRefreshBtn}>
                  {this.state.bRefresh ? <i className="fa fa-pause" style={{marginRight:"5px"}}/> : <i className="fa fa-play" style={{marginRight:"5px"}}/>}
                  {this.state.bRefresh ? "不更新" : "更新"}
                </Button>
            </Col>*/}
          </Row>
        </div>

        <Row className="content" style={{marginBottom:"0"}}>
          <Col md={2}>
            <table id='streamsNameTable'
                data-toggle='table'
                data-classes='table table-no-bordered table-hover'
                data-click-to-select="true"
                data-height={heightvalue} >
            </table>
          </Col>
          <Col md={10}>
            <table id='realTimeStreamsTable'
                data-toggle='table'
                data-classes='table table-no-bordered table-hover'
                data-pagination='true'
                data-show-pagination-switch="false"
                data-page-size='20'
                data-height={heightvalue} >
            </table>
          </Col>
        </Row>
      </div>
    );
  },
});

$(window).resize(function () {
    if(document.getElementById('realTimeStreamsView') != null) {
        document.getElementById('realTimeStreamsView').style.height = $(window).height() - 62 - 30 + 'px';
    }
});

// export default RealTimeStreamsPage;
RealTimeStreamsPage.propTypes = {
  streamId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { streamId } = state.networkTopologyReducer

  return {
    streamId
  }
}

export default connect(mapStateToProps)(RealTimeStreamsPage)
