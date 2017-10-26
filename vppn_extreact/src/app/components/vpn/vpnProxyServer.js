import React,{Component} from 'react';
import Utils from '../../script/utils';

class VpnProxyServer extends Component{
  state = {
  }
  componentDidMount() {
    this.getVPNManagerServer();
    // this.getVPNServerList();
  }
  render() {
    const { managerServerIP, managerServerPort, proxyServerList } = this.props;
    // var {vpnProxyServerList} = this.state;
    var VpnProxyServerList = proxyServerList.map(function(proxyServer, i){
      return (
        <tr key={i}>
          <td>{proxyServer.IP}</td>
          <td>{proxyServer.CountryName}</td>
          <td>{proxyServer.hasOwnProperty("time") ? (proxyServer.time+" ms") : "-"}</td>
          <td><button type="button" className="button no-margin" onClick={this.handlePingServer.bind(this, proxyServer.IP)}>Ping</button></td>
        </tr>
      )
    }.bind(this));
    return (
      <div className="wi-right-1 padding20 auto-y">
        <div className="wire-block">
          <h5>Virtual Private Network Proxy Server
            <button type="button" className="button info info2 text-shadow place-right" style={{marginTop:"-10px"}} onClick={this.handleRefreshServerList}>
              <span className="mif-loop2"></span>
            </button>
          </h5>
          <div className="grid">
            <div className="form-group row cells6">
              <form className="cell colspan6" style={{paddingTop:"13px"}} onSubmit={this.setVPNManagerServer}>
                <label>Manager Server:</label>
                <div className="inline m-l-15">
                  <div className="input-control text full-size">
                    <input id="vpn_managerServerIP" type="text" defaultValue={managerServerIP}/>
                  </div>
                </div>
                <label className="m-l-25">Port:</label>
                <div className="inline m-l-15">
                  <div className="input-control text" style={{width:"9.447rem"}}>
                    <input id="vpn_managerServerPort" type="text" defaultValue={managerServerPort} style={{width:"5.447rem"}}/>
                    <button type="submit" className="button m-l-15" style={{marginLeft:"15px",right:"-15px"}}>Save</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="wire-block over-table">
          <table className="table hovered">
            <thead>
              <tr>
                <th>Proxy Address</th>
                <th>Country Name</th>
                <th>Latency</th>
                <th>Testing</th>
              </tr>
            </thead>
            <tbody>
              {VpnProxyServerList}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  getVPNManagerServer() {
    var postData = {
      act_type: "get_managerserver"
    }
    var formEl = document.getElementById("vpnForm_1");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "fail") {
            document.getElementById("vpn_managerServerIP").value = "";
            document.getElementById("vpn_managerServerPort").value = "";
            console.log("Get manager server error!");
            return;
          }

          if(res.hasOwnProperty("cloud_host")) {
            document.getElementById("vpn_managerServerIP").value = res.cloud_host;
          }
          else {
            document.getElementById("vpn_managerServerIP").value = "";
            console.log("Get manager server IP error!");
          }

          if(res.hasOwnProperty("cloud_port")) {
            document.getElementById("vpn_managerServerPort").value = res.cloud_port;
          }
          else {
            document.getElementById("vpn_managerServerPort").value = "";
            console.log("Get manager server port error!");
          }
        } catch (e) {
          document.getElementById("vpn_managerServerIP").value = "";
          document.getElementById("vpn_managerServerPort").value = "";
          console.log("Get manager server error!")
        }
        _this.props.setManagerServerIP(document.getElementById("vpn_managerServerIP").value);
        _this.props.setManagerServerPort(document.getElementById("vpn_managerServerPort").value);
        var sessionId = Utils.generateUuid(16);
        _this.props.setManagerServerSessionId(sessionId);
        _this.getVPNServerList(sessionId);
      }
    });
  }
  handleRefreshServerList() {
    var sessionId = Utils.generateUuid(16);
    this.props.setManagerServerSessionId(sessionId);
    this.getVPNServerList(sessionId);
    // setTimeout(function(){
    //   this.getVPNServerStatus(sessionId);
    // }.bind(this), 100)
    var num = 0;
    var timer = setInterval(function(){
      num++;
      this.getVPNServerStatus(sessionId);
      if(num == 3) {
        clearInterval(timer);
        timer = null;
      }
    }.bind(this), 5000);
  }
  getVPNServerList(sessionId) {
    const { managerServerIP, managerServerPort } = this.props;
    var postData = {
      act_type: "get_serverlist",
      host: managerServerIP,
      port: managerServerPort,
      session_id: sessionId
    }
    var formEl = document.getElementById("vpnForm_1");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.length > 0) {
            // _this.setState({vpnProxyServerList: res});
            _this.props.setProxyServerList(res);
          }
          else {
            // _this.setState({vpnProxyServerList: []});
            _this.props.setProxyServerList([]);
          }
        } catch (e) {
          // _this.setState({vpnProxyServerList: []});
          _this.props.setProxyServerList([]);
          console.log("Get server list error!")
        }
      }
    });
  }
  getVPNServerStatus(sessionId) {
    var postData = {
      act_type: "get_serverstatus",
      session_id: sessionId
    }
    var formEl = document.getElementById("vpnForm_1");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("results")) {
            var proxyServerList = _this.props.proxyServerList.slice(0);
            for(var i = 0; i < res.results.length; i++) {
              for(var j = 0; j < proxyServerList.length; j++) {
                if(proxyServerList[j].IP == res.results[i].IP) {
                  proxyServerList[j].time = res.results[i].time;
                  break;
                }
              }
            }
            _this.props.setProxyServerList(proxyServerList);
          }
          else {
            console.log("Get server status error!")
          }
        } catch (e) {
          console.log("Get server status error!")
        }
      }
    });
  }
  setVPNManagerServer(e) {
    e.preventDefault();
    var dialogMsg = {
      title: 'Tips'
    }
    var dialogId = "vpnDiaglog";
    if (!document.getElementById("vpn_managerServerIP").value.trim() || !document.getElementById("vpn_managerServerPort").value.trim()) {
      dialogMsg.content = 'You must configure manager server address and port first .'
      this._showDialog(dialogMsg, dialogId);
      return;
    }
    var postData = {
      act_type: "set_managerserver",
      host: document.getElementById("vpn_managerServerIP").value.trim(),
      port: document.getElementById("vpn_managerServerPort").value.trim()
    }
    var formEl = document.getElementById("vpnForm_1");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("status") && res.status == "success") {
            _this.props.setManagerServerIP(document.getElementById("vpn_managerServerIP").value);
            _this.props.setManagerServerPort(document.getElementById("vpn_managerServerPort").value);
          }
          else {
            console.log("Set manager server error!");
          }
        } catch (e) {
          console.log("Set manager server error!")
        }
      }
    });
  }
  handlePingServer(serverIp){
    var dialogEl = $("#vpnDiaglog #content");
    dialogEl[0].innerHTML = '';
    var dialogMsg = {
      title: 'Pinging ' + serverIp + ' ...',
      content: null
    }
    this.props.setDialogMsg(dialogMsg);
    showMetroDialog('#vpnDiaglog')

    var postData = {
      act_type: "get_speed",
      dest_ip: serverIp
    }
    var formEl = document.getElementById("vpnForm_1");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "json",
      cache:false,
      data: postData,
      complete : function(result){
        var dialogMsg2 = {
          title: 'Pinging ' + serverIp + ' ...',
          content: null
        }
        try {
          var res = JSON.parse(result.responseText);
          if(res.hasOwnProperty("time")) {
            dialogMsg2.title = 'Ping ' + serverIp + ' results:';
            dialogMsg2.content = res.time+" ms";
          }
          else {
            console.log("Get speed error!");
            dialogMsg2.title = 'Ping ' + serverIp + ' results:';
            dialogMsg2.content = 'Error';
          }
        } catch (e) {
          console.log("Get speed error!");
          dialogMsg2.title = 'Ping ' + serverIp + ' results:';
          dialogMsg2.content = 'Error';
        }
        _this.props.setDialogMsg(dialogMsg2);
      }
    });
    // dialogEl.append("<p>One</p>");
  }
  _showDialog(dialogMsg, dialogId) {
    this.props.setDialogMsg(dialogMsg);
    showMetroDialog('#' + dialogId);
  }
}

export default VpnProxyServer;
