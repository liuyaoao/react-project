var React = require('react');

var VpnSidebar = React.createClass({
  render: function(){
    return (
      <ul className="sidebar2 sidebar3">
        <li id="vpnSidebar_li_6" className="active"><a onClick={this.handleShow.bind(this, 6)}> Overview</a></li>
        <li id="vpnSidebar_li_8"><a onClick={this.handleShow.bind(this, 8)}><span className="mif-list2 icon"></span> Proxy Server</a></li>
        <li id="vpnSidebar_li_7"><a onClick={this.handleShow.bind(this, 7)}> Topology</a></li>
        <li id="vpnSidebar_li_1"><a onClick={this.handleShow.bind(this, 1)}> Tunnel 1</a></li>
        <li id="vpnSidebar_li_2"><a onClick={this.handleShow.bind(this, 2)}> Tunnel 2</a></li>
        <li id="vpnSidebar_li_3"><a onClick={this.handleShow.bind(this, 3)}> Tunnel 3</a></li>
        <li id="vpnSidebar_li_4"><a onClick={this.handleShow.bind(this, 4)}> Tunnel 4</a></li>
        <li id="vpnSidebar_li_5"><a onClick={this.handleShow.bind(this, 5)}> Tunnel 5</a></li>
      </ul>
    )
  },
  handleShow: function(key, e){
    $('#vpnWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    var _this = this;
    $('#vpnWindow .sidebar3 li').each(function(i){
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      }
    })
    $(e.target.parentNode).addClass('active');
    $('#vpnWindow #wi_right_' + key).addClass('active');
    // if (key == 6 || key == 7) return;
    switch (key) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        this.props.getVPNStatus(key);
        this.props.getVPNConfig(key);
        // this.props.getVPNServerList(key);
        break;
      case 6:
        for(var i = 1; i < 6; i++) {
          this.props.getVPNStatus_overview(i);
          this.props.getVPNConfig_overview(i);
        }
        // this.props.getVPNServerList_overview();
        break;
      case 7:
        for(var i=1; i<6; i++){
          this.props.getVPNStatus_vpntopolopy(i);
          this.props.getVPNConfig_vpntopolopy(i);
        }
        break;
      case 8:
        // this.props.getVPNServerList_proxyServer();
        this.props.getVPNManagerServer();
        break;
      default:
        break;
    }
  },
});

module.exports = VpnSidebar;
