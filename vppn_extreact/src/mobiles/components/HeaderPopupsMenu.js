
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,List,Button, Label,FormPanel, Panel } from '@extjs/ext-react';

Ext.require('Ext.Toast');

class HeaderPopupsMenu extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
  }
  store = Ext.create('Ext.data.Store', {
      data: [
          {id:'findMe',title: '找到我'},
          {id:'refresh',title: '重启'},
          {id:'shutdown',title: '关机'},
          {id:'settings',title: '设置'},
          {id:'cancel',title: '取消'}
      ]
    })
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }
  onClickPopupMask = ()=>{
    this.props.onHideHeaderPopup();
  }
  tpl = data => (
      <div>
          <div style={{fontSize: '21px',color:'#0087ff',textAlign:'center' }} onClick={(evt)=>this.onItemClick(data)}>{data.title}</div>
      </div>
  )
  onItemClick = (record)=>{
    this.props.onHideHeaderPopup();
    Ext.toast(`You selected ${record.title}.`);
    console.log("onPopupDeSelect----:",record);
  }
  render () {
    let {popupsDisplayed} = this.props;
    return (
      <div className="">
        <div className={popupsDisplayed?"header-popups-mask active":"header-popups-mask"} onClick={this.onClickPopupMask}></div>
        <Container cls={popupsDisplayed?"popup_content active":"popup_content"}
          zIndex={'100'}
          height={'auto'}
          padding="0 10"
          style={{backgroundColor:'#fff',borderBottom: '1px solid #bfbbbb',position:'fixed'}}
          >
            <List cls="list_container"
              selfAlign="center"
              record={null}
              disableSelection={true}
              itemTpl={this.tpl}
              store={this.store}
            />
        </Container>
      </div>
    );
  }

}

export default HeaderPopupsMenu;
