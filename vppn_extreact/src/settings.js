import $ from 'jquery';
import React, { Component }  from 'react'
import ReactDOM from 'react-dom';

// var WirelessConfig = require('./app/windows/wirelessConfig');
// var VpnConfig = require('./app/windows/vpnConfig');
// var PhonePhoto = require('./app/windows/mobile/phonePhoto');
// var ConnectMobile = require('./app/windows/mobile/connectMobile');
// var DeviceManage = require('./app/windows/mobile/deviceManage');
// var PhoneHelp = require('./app/windows/mobile/phoneHelp');
// var PhoneMusicView = require('./app/windows/mobile/phoneMusicView');
// var PhoneFileView = require('./app/windows/mobile/phoneFileView');
// var PhoneVideo = require('./app/windows/mobile/phoneVideo');
// var RouterPhoto = require('./app/windows/router/routerPhoto');
// var RouterVideo = require('./app/windows/router/routerVideo');
// var RouterFileView = require('./app/windows/router/routerFileView');
// var RouterMusicView = require('./app/windows/router/routerMusicView');
// var AppCenter = require('./app/windows/appCenter');

class Settings extends Component{
  state = {
    name: 'Sam'
  }

  save = ()=>{
    this.setState({
      name: ReactDOM.findDOMNode(this.refs.name).value
    });
  }
  handleFocus = ()=>{
    ReactDOM.findDOMNode(this.refs.name).focus();
  }
  _getSettingContent(){
    let id = '564654';//this.props.id;
    // console.log(id);
    switch (id) {
      // case 'settings-1':
      //   return <WirelessConfig id={id}/>
      //   break;
      // case 'settings-2':
      //   return <VpnConfig id={id} manager={this.props.manager}/>
      //   break;
      // case 'my-phone':
      //   return <ConnectMobile id={id} manager={this.props.manager}/>
      //   break;
      // case 'device-manage':
      //   return <DeviceManage id={id}/>
      //   break;
      // case 'phone_photo':
      //   return <PhonePhoto id={id} manager={this.props.manager}/>
      //   break;
      // case 'phone-help':
      //   return <PhoneHelp id={id}/>
      //   break;
      // case 'phone_music':
      //   return <PhoneMusicView id={id} manager={this.props.manager}/>
      //   break;
      // case 'phone_file':
      //   return <PhoneFileView id={id} manager={this.props.manager}/>
      //   break;
      // case 'phone_video':
      //   return <PhoneVideo id={id} manager={this.props.manager}/>
      //   break;
      // case 'photo':
      //   return <RouterPhoto id={id} manager={this.props.manager}/>
      //   break;
      // case 'video':
      //   return <RouterVideo id={id} manager={this.props.manager}/>
      //   break;
      // case 'file':
      //   return <RouterFileView id={id} manager={this.props.manager}/>
      //   break;
      // case 'music':
      //   return <RouterMusicView id={id} manager={this.props.manager}/>
      //   break;
      // case 'app-center':
      //   return <AppCenter id={id}/>
      //   break;
      default:
        return null;
    }
  }
  render () {
    var Content = this._getSettingContent();
    return (
      <div className="window-content" style={{padding:"0 1px"}}>
        { Content ? Content :
          <div className="padding10"><label>Name:</label>
            <input ref='name' type='text' defaultValue={this.state.name} />
            <button onClick={this.save}>Save</button>
            <br />
            <p>My name is: {this.state.name}</p>
          </div>
        }
      </div>
    );
  }

}

export default Settings;
