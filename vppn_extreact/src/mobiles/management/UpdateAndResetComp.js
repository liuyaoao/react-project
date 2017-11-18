
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel,
  Panel,TextField,TextAreaField  } from '@extjs/ext-react';

class UpdateAndResetComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
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

    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('System Update')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <TextField disabled label={Intl.get('Product model')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="RT1900ac"
                cls="disable_text"
                textAlign="right"/>
              <TextField disabled label={"SRM "+Intl.get('Version')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="SRM 1.0.2-60022 Update 1"
                cls="disable_text"
                textAlign="right"/>
              <TextAreaField  disabled label={Intl.get('State')+"："}
                labelTextAlign="text" labelAlign="left" width="100%" height="60px"
                value={Intl.get('Version can be downloaded',null,{version:'SRM 1.1.5-6542'})}
                cls="disable_text"
                maxRows={2}
                textAlign="right"/>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0">
                <Button flex={1} text={Intl.get('Download')} ui="decline alt" style={{marginLeft:'10px'}}/>
              </Container>
            </Container>
            <Container layout={{type:'hbox',pack:'center',aglin:'bottom'}} width="100%" margin="10 0 10 0">
              <Button flex={1} text={Intl.get('Manual Update')+' SRM'} ui="confirm alt" style={{marginRight:'10px'}}/>
              <Button flex={1} text={Intl.get('Update Setting')} ui="decline alt"/>
            </Container>
          </div>

          <div className="cnt">
            <div className="title">{Intl.get('Configuring backup and restore')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <div>{Intl.get('Backup router configuration and save configuration file(.dss) to your computer.')}</div>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0">
                <Button text={Intl.get('Backup Configuration')} ui="confirm alt"/>
              </Container>
              <div>{Intl.get('Restore the backup configuration or restore the router to factory settings.')}</div>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0" width="100%">
                <Button text={Intl.get('Restore Configuration')} ui="confirm alt" style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Restore Factory Settings')} ui="decline alt"/>
              </Container>
            </Container>
          </div>

        </div>
      </div>
    );
  }

}

export default UpdateAndResetComp;
