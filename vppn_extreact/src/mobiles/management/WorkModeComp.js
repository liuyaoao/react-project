
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

class WorkModeComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    workMode:'wirelessRouter',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  onChoseWorkMode = (workMode)=>{
    this.setState({workMode});
  }
  componentWillUnmount () {
  }

  render () {
    let {workMode} = this.state;

    return (
      <div className='work_mode_cnt' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div>{Intl.get('workMode_desc')}</div>

          <div className={workMode=="wirelessRouter"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessRouter")}>
            <div>{Intl.get('Wireless Router')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>
          <div className={workMode=="wirelessAcPoint"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessAcPoint")}>
            <div>{Intl.get('Wireless access point')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>
          <div className={workMode=="wirelessClient"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessClient")}>
            <div>{Intl.get('Wireless client')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>
          <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
              <Button text={"应用"} ui={'confirm alt'} style={{marginRight:'10px'}}></Button>
              <Button text={"重置"} ui={'decline alt'} style={{marginLeft:'10px'}}></Button>
          </Container>

        </div>
      </div>
    );
  }

}

export default WorkModeComp;
