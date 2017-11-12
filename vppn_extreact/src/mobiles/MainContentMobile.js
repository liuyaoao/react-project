
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

import FileStationPageMobile from './fileStation/FileStationPageMobile';
import NetworkPageMobile from './network/NetworkPageMobile';
import VlanPageMobile from './vlan/VlanPageMobile';

class MainContentMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'完成',
      moduleName:'fileStation',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }

  componentWillUnmount () {
  }

  render () {
    let {contentId,displayed} = this.props;
    return (
      <div className="main_content">

        {contentId=="FileStationWindow"||contentId==""?
          <FileStationPageMobile
            toggleSidebar={this.props.toggleSidebar}
          /> : null
        }
        {contentId=="NetworkCenterWindow"?
          <NetworkPageMobile
            toggleSidebar={this.props.toggleSidebar}
          /> : null
        }
        {contentId=="VlanWindow"?
          <VlanPageMobile
            toggleSidebar={this.props.toggleSidebar}

          /> : null
        }
      </div>
    );
  }

}

export default MainContentMobile;
