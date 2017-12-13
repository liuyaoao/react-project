
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField, Grid, CheckColumn,Column  } from '@extjs/ext-react';

class AdvancedSettingComp extends Component{
  state = {
    noticeType:"",
    vPathList:new Ext.data.Store({
      data:[
        {uri:'432',vproxy:'gregre',desc:'gfretgre'},
        {uri:'765',vproxy:'fdegre',desc:'bresgr'}
      ],
      sorters:'domain'
    }),//vPath列表
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
          <Button shadow ui="menu" text={Intl.get('All notifications')} style={{width:'100%','float':'left'}} >
             <Menu defaults={{ handler: this.onNoticeTypeChanged, group: 'buttonstyle' }}>
                 <MenuItem text={Intl.get('All notifications')} value="allNotice" iconCls={noticeType === 'allNotice' && 'x-font-icon md-icon-check'}/>
                 <MenuItem text={Intl.get('Email')} value="emailNotice" iconCls={noticeType === 'emailNotice' && 'x-font-icon md-icon-check'}/>
             </Menu>
          </Button>
          <Grid store={this.state.vPathList} grouped width={'98%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
              <Column text={Intl.get('Events')} flex={2} dataIndex="uri"/>
              <CheckColumn text={Intl.get('Email')} flex={1} dataIndex="vproxy" groupable={false} sortable={false}/>
              <CheckColumn text={Intl.get('Message')} flex={1} dataIndex="desc" groupable={false} sortable={false}/>
              <CheckColumn text={Intl.get('Mobile Device')} flex={1} dataIndex="desc" groupable={false} sortable={false}/>
          </Grid>

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
