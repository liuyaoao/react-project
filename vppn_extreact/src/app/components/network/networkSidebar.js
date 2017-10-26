import React,{Component} from 'react';

class NetworkSidebar extends Component{
  render(){
    return (
      <ul className="sidebar2 sidebar3">
        <li className="active"><a onClick={this.handleShow.bind(this, 1)}><span className="mif-wifi-connect icon"></span> Wireless</a></li>
        <li className=""><a onClick={this.handleShow.bind(this, 2)}><span className="mif-earth icon"></span> Internet</a></li>
        <li className=""><a><span className="mif-local-service icon"></span> Local Network</a></li>
        <li className=""><a><span className="mif-users icon"></span> Parental Control</a></li>
        <li className=""><a><span className="mif-equalizer-v icon"></span> Traffic Control</a></li>
        <li className=""><a><span className="mif-security icon"></span> Security</a></li>
        <li className=""><a><span className="mif-notification icon"></span> Notification</a></li>
      </ul>
    )
  }
  handleShow(key, e){
    $('#networkWindow .wi').each(function(){
      $(this).removeClass('active');
    })
    $('#networkWindow .sidebar3 li').each(function(){
      $(this).removeClass('active');
    })
    $(e.target.parentNode).addClass('active');
    $('#networkWindow #wi_right_' + key).addClass('active');
    switch (key) {
      case 1:
        this.props.getWifiSettingsInfo();
        this.props.getWifiSettingsWPASecurityKeys();
        break;
      default:
        break;
    }
  }

}

export default NetworkSidebar;
