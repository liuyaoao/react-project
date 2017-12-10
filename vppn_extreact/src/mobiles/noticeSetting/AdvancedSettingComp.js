
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class AdvancedSettingComp extends Component{
  state = {
    noticeType:"",
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount() {
  }
  onNoticeTypeChanged = (item)=>{
    this.setState({ noticeType:item.value });
  }

  render () {
    let {bodyHeight,noticeType} = this.state;
    let {} = this.state;
    let {contentId} = this.props;
    return (
      <div style={{padding:'10px'}}>
        <div>{Intl.get('message_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <Container layout={{type:'hbox',pack:'left',align:'bottom'}} margin="10 10 10 10">
              <Button text={Intl.get('Edit Message')} ui={'confirm raised'} style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Save')} ui={'decline raised'} style={{marginLeft:'10px'}}/>
              <Button text={Intl.get('Edit Variables')} ui={'decline raised'} style={{marginLeft:'10px'}}/>
          </Container>
          <Button shadow ui="menu" text="所有通知" style={{width:'100%','float':'left'}} >
             <Menu defaults={{ handler: this.onNoticeTypeChanged, group: 'buttonstyle' }}>
                 <MenuItem text="所有通知" value="所有通知" iconCls={noticeType === '所有通知' && 'x-font-icon md-icon-check'}/>
                 <MenuItem text="电子邮件" value="电子邮件" iconCls={noticeType === '电子邮件' && 'x-font-icon md-icon-check'}/>
             </Menu>
          </Button>
          {/* todos*/}

        </Container>
        <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
        </Container>
      </div>
    );
  }

}

export default AdvancedSettingComp;
