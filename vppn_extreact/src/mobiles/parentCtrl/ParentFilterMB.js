
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField, Menu,MenuItem,
  TabPanel,FormPanel, Panel,CheckBoxField,Grid,CheckColumn,Column } from '@extjs/ext-react';

class ParentFilterMB extends Component{
  state = {
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
    let {bodyHeight} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div style={{marginBottom:'10px'}}>{Intl.get("You can customize the allowed list to always allow access to the site in this list. The list of allowable lists will have a higher priority than the blockade list and the 'basic' and 'protected' filters.")}</div>
          <Container shadow layout={{type:'vbox',pack:'left',aglin:'bottom'}} style={{padding:'8px',background:'#dae8ec',marginBottom:'10px'}}>
            <div style={{margin:'10px 0'}}>
              <span className="mif-file-text mif-2x" style={{color:'green'}}></span>
              <span style={{fontWeight:'bold'}}>{Intl.get('Allow access to custom sites')}</span>
              <div style={{marginLeft:'30px'}}>{Intl.get('Allows you to customize the URL that is considered secure.')}</div>
            </div>
            <Container><Button ui="action raised" text="Editor allowed list"/></Container>
          </Container>
          <div style={{marginBottom:'10px'}}>{Intl.get("You can choose from the following filters ('basic' and 'protected') or custom blocking lists to block access to inappropriate or harmful websites.")}</div>
          <Container shadow layout={{type:'vbox',pack:'left',aglin:'bottom'}} style={{padding:'10px',background:'#dae8ec'}}>
            <div style={{margin:'10px 0',borderBottom:'1px dotted gray',paddingBottom:'10px'}}>
              <span className="mif-lock mif-2x" style={{color:'green'}}></span>
              <span style={{fontWeight:'bold'}}>{Intl.get('Access to known malicious web sites (basic)')}</span>
              <div style={{marginLeft:'28px'}}>{Intl.get("Blockade sites for your security and potential threats, such as malware and phishing sites.")}</div>
            </div>
            <div style={{margin:'10px 0',borderBottom:'1px dotted gray',paddingBottom:'10px'}}>
              <span className="mif-lock mif-2x" style={{color:'orange'}}></span>
              <span style={{fontWeight:'bold'}}>{Intl.get('Access to malicious and adult web sites (protected)')}</span>
              <div style={{marginLeft:'28px'}}>{Intl.get("The blockade is not suitable for minors' websites, including adults, drugs and gambling sites.")}</div>
            </div>
            <div style={{margin:'10px 0',borderBottom:'1px dotted gray',paddingBottom:'10px'}}>
              <span className="mif-lock mif-2x" style={{color:'blue'}}></span>
              <span style={{fontWeight:'bold'}}>{Intl.get('Blocking access to a custom site (custom)')}</span>
              <div style={{marginLeft:'28px'}}>{Intl.get("Block custom web site categories and URL.")}</div>
            </div>
            <Container><Button ui="action raised" text="Edit blockade list"/></Container>
          </Container>

        </div>
      </div>
    );
  }

}

export default ParentFilterMB;
