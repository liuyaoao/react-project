
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import WorkModeComp from './WorkModeComp';
import UpdateAndResetComp from './UpdateAndResetComp';
import SRMSettingComp from './SRMSettingComp';
import ServiceComp from './ServiceComp';
import RegionOptionsComp from './RegionOptionsComp';
import LED_Comp from './LED_Comp';
import UsingStateComp from './UsingStateComp';

class ManagementPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
      showMenu:true,
      tabType:'workMode',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }

  componentWillUnmount () {
  }
  onTabTypeChange = (item)=>{
    console.log("onTabTypeChange:",item.value);
    this.setState({
      tabType:item.value,
    });
  }

  render () {
    let {tabType,bodyHeight,showMenu} = this.state;
    let {displayed} = this.props;
    return (
      <div className="page_content">
        <TitleBar
            cls="titlebar-mobile"
            title={Intl.get('management')}
            height="45px"
            zIndex="108"
            platformConfig={{
                phone: {titleAlign: 'center'}
            }}
            style={{position:'fixed',top:'0'}}
        >
          <Button align="left" ui="default" iconCls="x-fa fa-bars" onTap={this.props.toggleSidebar}/>
          {this.state.titlebarRightText?
            <Button align="right" ui="default" text={this.state.titlebarRightText}/>:null
          }
          {showMenu?
            <Button align="right" ui="default" iconCls="x-fa fa-ellipsis-h" arrow={false}>
              <Menu defaults={{ handler: this.onTabTypeChange, group: 'buttonstyle' }}>
                  <MenuItem text={Intl.get('Work Mode')} value="workMode" iconCls={tabType === 'workMode' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Update And Reset')} value="updateAndReset" iconCls={tabType === 'updateAndReset' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={"SRM "+Intl.get('Setting')} value="SRMSetting" iconCls={tabType === 'SRMSetting' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Service')} value="service" iconCls={tabType === 'service' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Region Options')} value="regionOptions" iconCls={tabType === 'regionOptions' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="LED" value="LED" iconCls={tabType === 'LED' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Using State')} value="usingState" iconCls={tabType === 'usingState' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
            {tabType=='workMode'?
              <WorkModeComp
                tabType={tabType} />:null
            }
            {tabType=='updateAndReset'?
              <UpdateAndResetComp tabType={tabType}/>:null
            }

            {tabType=='SRMSetting'?
              <SRMSettingComp tabType={tabType}/>:null
            }

             {tabType=='service'?
               <ServiceComp
                 tabType={tabType}/>:null
             }
             {tabType=='regionOptions'?
               <RegionOptionsComp
                 tabType={tabType}/>:null
             }

             {tabType=='LED'?
               <LED_Comp
                 tabType={tabType}/>:null
             }

             {tabType=='usingState'?
               <UsingStateComp
                 tabType={tabType}/>:null
             }



        </div>
      </div>

    );
  }

}

export default ManagementPageMobile;
