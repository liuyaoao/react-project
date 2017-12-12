import React,{Component} from 'react';
import Intl from '../../intl/Intl';
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField, Menu,MenuItem,
  TabPanel,FormPanel, Panel,CheckBoxField,Grid,CheckColumn,Column } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class ParentalCtrlContent extends Component {
    state={
    }
    render(){
      return (
        <div className='parentalCtrl_content' style={{height:'100%'}}>
          <TabPanel cls='parentalCtrl_tabPanel'
            height={'100%'}
            defaults={{
                cls: "card",
                // layout: "center",
                tab: {
                    flex: 0,
                    minWidth: 100
                }
            }}
            tabBar={{
                layout: {
                    pack: 'left'
                }
            }}>
              <Container title={Intl.get('Plan')} cls="plan_tab" scrollable={true}>
                  <ParentPlanMB />
              </Container>
              <Container title={Intl.get('Website Filter')} cls="pageFilter_tab" scrollable={true}>
                  <ParentFilterMB />
              </Container>
            </TabPanel>
        </div>
    );
  }
}


//计划
class ParentPlanMB extends Component{
  state = {
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  componentDidMount(){
  }
  render () {
    return (
      <div style={{padding:'10px'}}>
        <div style={{marginBottom:'10px'}}>{Intl.get('Protect your child from aggressive content and potentially harmful sites through ‘parental control’.This allows you to restrict Internet access to each connection device.')}</div>
        <Container layout={{type:'hbox',pack:'start',aglin:'bottom'}}>
          <Button text={Intl.get('Add')} ui="confirm alt raised" style={{marginRight:'10px'}}/>
          <Button text={Intl.get('Delete')} ui="decline alt raised" style={{marginRight:'10px'}}/>
          <Button text={Intl.get('Setting Plan')} ui="raised" style={{marginRight:'10px'}}/>
          <CheckBoxField boxLabel={Intl.get('Allow')} cls="black_label"/>
        </Container>
        <Container width="100%" margin="10 0 10 0">
          <Grid shadow grouped
            store={this.dataStore}
            style={{minHeight:'360px'}}
            selectable={{}}
            scrollable={true}>
              <Column text={Intl.get('Device List')} flex={1} dataIndex="price"/>
              <Column text={Intl.get('Allow surf the Internet time')} flex={1} dataIndex="priceChange"/>
              <Column text={Intl.get('Web filter')} flex={1} dataIndex="priceChange"/>
          </Grid>
        </Container>
      </div>
    );
  }
}


//网页过滤器
class ParentFilterMB extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
      <div style={{padding:'10px'}}>
        <div style={{marginBottom:'10px'}}>{Intl.get("You can customize the allowed list to always allow access to the site in this list. The list of allowable lists will have a higher priority than the blockade list and the 'basic' and 'protected' filters.")}</div>
        <Container shadow layout={{type:'vbox',pack:'left',aglin:'bottom'}} style={{padding:'8px',background:'#dae8ec',marginBottom:'10px'}}>
          <div style={{margin:'10px 0'}}>
            <span className="mif-file-text mif-2x" style={{color:'green'}}></span>
            <span style={{fontWeight:'bold'}}>{Intl.get('Allow access to custom sites')}</span>
          </div>
          <div style={{margin:'10px 0',marginLeft:'30px'}}>{Intl.get('Allows you to customize the URL that is considered secure.')}</div>
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
    );
  }
}
