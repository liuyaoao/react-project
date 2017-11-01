
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container } from '@extjs/ext-react';
import VlanSidebar from './components/vlanSidebar';
import VportContent from './components/vportContent';
import DiagnosisContent from './components/diagnosisContent';
import SettingContent from './components/settingContent';
import CommonDialog from '../app/components/common/dialog';

class VlanWindow extends Component{
  state = {
    dialogMsg:'',
    windowHeight:570,
    contentId: '1_vport',
    myVirtualIp:'10.100.16.89',
    vProxyIpArr:['10.100.16.84','10.100.16.9','10.100.16.68'],
  }
  componentDidMount(){
    this.setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    $(".ws-select").select2();
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    // document.removeEventListener('mouseup', this.handleMouseUp);
  }
  setRightHeight = (id)=>{
    // console.log(id);
    var windowId = '#window-' + id;
    var height = $(windowId).height();
    var headerHeight = 38;  //49
    $(windowId + ' .sidebar3').css("height", height - headerHeight - 30);
    $(windowId + ' .wi-right').css("height", height - headerHeight);
    this.setState({ windowHeight:height});
  }
  handleMouseMove = ()=>{
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      this.setRightHeight(this.props.id);
    }
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
  }
  render () {
    return (
      <div className="grid condensed net-win" id="networkWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <VlanSidebar onMenuItemClick={this.onMenuItemClick}/>
          </div>
          <div className="cell colspan3 wi-right">
            {/*所有的Vport tab的右边内容块*/}
            <div className="wi active" id="wi_right_vport" style={{height:'100%',width:'100%'}}>
              <VportContent
                windowHeight={this.state.windowHeight}
                myVirtualIp={this.state.myVirtualIp}
                vProxyIpArr={this.state.vProxyIpArr}
                contentId={this.state.contentId}
              />
            </div>
            {/*diagnosis tab的右边内容块*/}
            <div className="wi" id="wi_right_diagnosis" style={{height:'100%',width:'100%'}}>
              <DiagnosisContent
                windowHeight={this.state.windowHeight}
                myVirtualIp={this.state.myVirtualIp}
                contentId={this.state.contentId}
              />
            </div>
            {/*setting tab的右边内容块*/}
            <div className="wi" id="wi_right_setting" style={{height:'100%',width:'100%'}}>
              <SettingContent
                windowHeight={this.state.windowHeight}
                myVirtualIp={this.state.myVirtualIp}
                contentId={this.state.contentId}
              />
            </div>
          </div>
        </div>
        <CommonDialog id="networkDiaglog" dialogMsg={this.state.dialogMsg} />
      </div>
    );
  }

}

export default VlanWindow;
