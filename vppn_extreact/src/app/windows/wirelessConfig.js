
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import Utils from '../script/utils';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container } from '@extjs/ext-react';
import NetworkSidebar from'../components/network/networkSidebar';
import CommonDialog from'../components/common/dialog';

var setRightHeight = function(id){
  // console.log(id);
  var windowId = '#window-' + id;
  var height = $(windowId).height();
  var headerHeight = 38;  //49
  $(windowId + ' .sidebar3').css("height", height - headerHeight - 30);
  $(windowId + ' .wi-right').css("height", height - headerHeight);
  $(windowId + ' .wi-right-1').css("height", height - headerHeight - 30);
  $(windowId + ' .wi-right-1 .frame').css("height", height - headerHeight - 30 - 51 - 60);
  $('#wi_wait').css("height", height - headerHeight - 30);
  $(windowId + ' .in-form').css("height", height - headerHeight - 30 - 60);
}

var bGetWifiSettingsInfo_done = false, bGetWifiSettingsWPASecurityKeys_done = false;
var getWifiSetting_timer = null;

class WirelessConfig extends Component{
  state = {
    vpnSwitch: true,
    vpnWhite: [],
    dialogMsg: ""
  }
  componentDidMount(){
    setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    $(".ws-select").select2();
    // $('.content').css('overflow', 'hidden');
    // document.addEventListener('mouseup', this.handleMouseUp);
    // this.getWifiSettingsInfo();
    // this.getWifiSettingsWPASecurityKeys();
    var _this = this;
    bGetWifiSettingsInfo_done = false;
    bGetWifiSettingsWPASecurityKeys_done = false;
    getWifiSetting_timer = setInterval(function(){
      _this.getWifiSettingsInfo();
      _this.getWifiSettingsWPASecurityKeys();
    }, 3000);
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    // document.removeEventListener('mouseup', this.handleMouseUp);
    // $('.content').css('overflow', 'auto');
    clearInterval(getWifiSetting_timer);
    getWifiSetting_timer = null;
  }
  handleMouseMove = ()=>{
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setRightHeight(this.props.id);
    }
  }
  render () {
    var Channel2GList = this._getChannelMenu(2);
    var Channel5GList = this._getChannelMenu(5);
    return (
      <div className="grid condensed net-win" id="networkWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <NetworkSidebar getWifiSettingsInfo={this.getWifiSettingsInfo} getWifiSettingsWPASecurityKeys={this.getWifiSettingsWPASecurityKeys}/>
          </div>
          <div className="cell colspan3 wi-right">
            {/*第一个tab的右边内容块*/}
            <div className="wi active" id="wi_right_1">
              <form id="wifiSettingForm" action="/cgi-bin/wifi_settings.cgi" method="post" onSubmit={this.handleSubmitWifiSettings} style={{display:"none"}}>
                <div className="wi-right-1">
                  <div className="tabcontrol" data-role="tabcontrol">
                    <ul className="tabs">
                        <li className="active"><a href="#wi_child_1">2.4 Ghz</a></li>
                        <li><a href="#wi_child_2">5 Ghz</a></li>
                    </ul>
                    <div className="frames">
                      <div className="frame" id="wi_child_1">
                        <div className="wire-block">
                          <h5>Wireless 2.4GHz Network Setup (b/g/n)</h5>
                          <label className="input-control checkbox small-check">
                            <input type="checkbox" defaultChecked />
                            <span className="check"></span>
                            <span className="caption"> Enable SSID Broadcast</span>
                          </label>
                          <div className="grid">
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Name (SSID):</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control text full-size">
                                  <input type="text" ref="ssid_2g" defaultValue=""/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Channel:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" ref="channel_2g" defaultValue="">
                                    <option value="">Auto</option>
                                    {Channel2GList}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Security Options:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" ref="securityLevel_2g" defaultValue="None">
                                    <option value="None">None</option>
                                    {/*<option value="WEP">WEP</option>
                                    <option value="WPA-PSK[TKIP]">WPA-PSK[TKIP]</option>*/}
                                    <option value="WPA2-PSK">WPA2-PSK[AES]</option>
                                    <option value="WPA-PSK/WPA2-PSK">WPA-PSK[TKIP] + WPA2-PSK[AES]</option>
                                    {/*<option value="WPA/WPA2企业版">WPA/WPA2企业版</option>*/}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Passphrase:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control text full-size">
                                  <input type="text" ref="password_2g" defaultValue=""/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Wireless Mode:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" ref="wirelessMode_2g" defaultValue="">
                                    <option value="54Mbps">Max 54Mbps</option>
                                    <option value="217Mbps">Max 217Mbps</option>
                                    <option value="450Mbps">Max 450Mbps</option>
                                    <option value="800Mbps">Max 800Mbps</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Area:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" ref="area_selection" defaultValue="">
                                    <option value="ZH">China</option>
                                    <option value="US">United States</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="frame" id="wi_child_2">
                        <div className="wire-block">
                          <h5>Wireless 5GHz Network Setup (a/n/ac)</h5>
                          <label className="input-control checkbox small-check">
                            <input type="checkbox" defaultChecked/>
                            <span className="check"></span>
                            <span className="caption"> Enable SSID Broadcast</span>
                          </label>
                          <div className="grid">
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Name (SSID):</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control text full-size">
                                  <input type="text" defaultValue="aqc-5G"/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Channel:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" defaultValue="153">
                                    {Channel5GList}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Security Options:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" defaultValue="WPA2-PSK">
                                    <option value="None">None</option>
                                    <option value="WPA2-PSK">WPA2-PSK[AES]</option>
                                    <option value="WPA-PSK/WPA2-PSK">WPA-PSK[TKIP] + WPA2-PSK[AES]</option>
                                    {/*<option value="WPA/WPA2企业版">WPA/WPA2企业版</option>*/}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Passphrase:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control text full-size">
                                  <input type="text" defaultValue="siteview"/>
                                </div>
                              </div>
                            </div>
                            <div className="form-group row cells6">
                              <div className="cell colspan2" style={{paddingTop:"13px"}}>
                                <label>Wireless Mode:</label>
                              </div>
                              <div className="cell colspan2">
                                <div className="input-control full-size" data-role="select" data-placeholder="Select">
                                  <select className="full-size ws-select" defaultValue="max-600">
                                    <option value="max-600">Max 600Mbps</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bottom">
                    <button type="submit" className="button info info2 no-margin-right">Apply</button>
                  </div>
                </div>
              </form>
              <div id="wi_wait" style={{textAlign:"center"}}>
                <div style={{fontWeight:"bold", paddingTop:"20px"}}>Please wait a moment...</div>
                {/*<span className="mif-spinner mif-ani-spin icon" style={{fontSize:"30px", marginTop:"18px"}}/>*/}
                <img src="images/loading.gif" style={{width:"40px", height:"40px", marginTop:"20px"}}/>
              </div>
            </div>
            {/*第一个tab的右边内容块*/}
            <div className="wi" id="wi_right_2">
              <div className="wi-right-1">
                <form id="internetForm" className="in-form auto-y" action="/cgi-bin/set-tinc.cgi" method="post" onSubmit={this.handleSubmitInternet}>
                  <div className="padding20">
                    <div className="wire-block">
                      <h5>Client</h5>
                      <div className="grid">
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>Interface:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="clientInterface" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>IP Address:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="clientIP" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>Gateway:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="clientGateway" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>Netmask:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="clientNetmask" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="wire-block">
                      <h5>Server</h5>
                      <div className="grid">
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>IP Address:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="serverIP" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row cells6">
                          <div className="cell" style={{paddingTop:"13px"}}>
                            <label>Port:</label>
                          </div>
                          <div className="cell colspan2">
                            <div className="input-control text full-size">
                              <input type="text" ref="serverPost" defaultValue=""/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bottom">
                    <button type="submit" className="button info info2">Apply</button>
                    <button type="button" className="button">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <CommonDialog id="networkDiaglog" dialogMsg={this.state.dialogMsg} />
      </div>
    );
  }
  _getChannelMenu(band){
    var channelArr =  Utils.getChannelMenu(band);
    var ChannelMenu = channelArr.map(function(ch, i){
      if (ch < 10) {
        ch = "0" + ch;
      }else {
        ch = "" + ch;
      }
      return (
        <option key={i} value={ch}>{ch}</option>
      )
    }.bind(this))
    return ChannelMenu;
  }
  handleSubmitWifiSettings(e) {
    e.preventDefault();
    $("#wifiSettingForm").hide();
    $("#wi_wait").show();
    var postData = {
      modle_name: "WLANConfiguration",
      method: "SetWLANWPAPSKByPassphrase",
      NewRegion: "Asia",
      NewSSID: this.refs.ssid_2g.value.trim(),
      NewChannel: this.refs.channel_2g.value.trim(),
      NewWPAEncryptionModes: this.refs.securityLevel_2g.value.trim(),
      NewWPAPassphrase: this.refs.password_2g.value.trim(),
      NewWirelessMode: this.refs.wirelessMode_2g.value.trim()
    }

    var formEl = document.getElementById("wifiSettingForm");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "xml",
      cache:false,
      data: postData,
      complete : function(result){
        var res = result.responseText;
        $(res).each(function () {
          if(this.nodeName == "RESPONSECODE") {
            if(this.innerText == "000") {
              bGetWifiSettingsInfo_done = false;
              bGetWifiSettingsWPASecurityKeys_done = false;
              getWifiSetting_timer = setInterval(function(){
                _this.getWifiSettingsInfo();
                _this.getWifiSettingsWPASecurityKeys();
              }, 3000);
            }
            else {
              console.log("SetWLANWPAPSKByPassphrase error!");
              $("#wifiSettingForm").show();
              $("#wi_wait").hide();
              var dialogMsg = {
                title: 'Tips',
                content: 'Submit Wifi settings fail.'
              }
              _this.setState({dialogMsg: dialogMsg})
              showMetroDialog('#networkDiaglog');
            }
          }
        });
      }
    });
  }
  getWifiSettingsInfo() {
    var postData = {
      modle_name: "WLANConfiguration",
      method: "GetInfo"
    }
    var formEl = document.getElementById("wifiSettingForm");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "xml",
      cache:false,
      data: postData,
      complete : function(result){
        var res = result.responseText;
        $(res).each(function () {
          if(this.nodeName == "RESPONSECODE") {
            if(this.innerText == "000") {
              $(res).each(function () {
                if(this.nodeName == "M:GETINFORESPONSE") {
                  for(var i = 0; i < this.children.length; i++) {
                    if(this.children[i].nodeName == "NEWSSID") {
                      _this.refs.ssid_2g.value = this.children[i].innerText;
                    }
                    else if(this.children[i].nodeName == "NEWCHANNEL") {
                      $(_this.refs.channel_2g).val(this.children[i].innerText).trigger("change");
                    }
                    else if(this.children[i].nodeName == "NEWWPAENCRYPTIONMODES") {
                      $(_this.refs.securityLevel_2g).val(this.children[i].innerText).trigger("change");
                    }
                    else if(this.children[i].nodeName == "NEWWIRELESSMODE") {
                      $(_this.refs.wirelessMode_2g).val(this.children[i].innerText).trigger("change");
                    }
                  }
                  bGetWifiSettingsInfo_done = true;
                  if(bGetWifiSettingsInfo_done && bGetWifiSettingsWPASecurityKeys_done) {
                    clearInterval(getWifiSetting_timer);
                    getWifiSetting_timer = null;
                    $("#wifiSettingForm").show();
                    $("#wi_wait").hide();
                  }
                }
              });
            }
            else {
              console.log("GetInfo error!");
            }
          }
        });
      }
    });
  }
  getWifiSettingsWPASecurityKeys() {
    var postData = {
      modle_name: "WLANConfiguration",
      method: "GetWPASecurityKeys"
    }
    var formEl = document.getElementById("wifiSettingForm");
    var _this = this;
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "xml",
      cache:false,
      data: postData,
      complete : function(result){
        var res = result.responseText;
        $(res).each(function () {
          if(this.nodeName == "RESPONSECODE") {
            if(this.innerText == "000") {
              $(res).each(function () {
                if(this.nodeName == "M:GETWPASECURITYKEYSRESPONSE") {
                  for(var i = 0; i < this.children.length; i++) {
                    if(this.children[i].nodeName == "NEWWPAPASSPHRASE") {
                      _this.refs.password_2g.value = this.children[i].innerText;
                    }
                  }
                  bGetWifiSettingsWPASecurityKeys_done = true;
                  if(bGetWifiSettingsInfo_done && bGetWifiSettingsWPASecurityKeys_done) {
                    clearInterval(getWifiSetting_timer);
                    getWifiSetting_timer = null;
                    $("#wifiSettingForm").show();
                    $("#wi_wait").hide();
                  }
                }
              });
            }
            else {
              console.log("GetWPASecurityKeys error!");
            }
          }
        });
      }
    });
  }
  handleSubmitInternet(e){
    e.preventDefault();
    var postData = {
      interface: this.refs.clientInterface.value.trim(),
      client_ip: this.refs.clientIP.value.trim(),
      gateway: this.refs.clientGateway.value.trim(),
      netmask: this.refs.clientNetmask.value.trim(),
      server_ip: this.refs.serverIP.value.trim(),
      server_port: this.refs.serverPost.value.trim()
    }
    var formEl = document.getElementById("internetForm");
    $.ajax({
      type: "POST",
      async: true,
      url: formEl.action,
      dataType: "xml",
      cache:false,
      data: postData,
      complete : function(result){
        console.log(result);
      }
    });
  }
}

export default WirelessConfig;
