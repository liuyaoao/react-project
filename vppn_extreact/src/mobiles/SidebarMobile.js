
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,List,Button, Label,FormPanel, Panel } from '@extjs/ext-react';

Ext.require('Ext.Toast');

class SidebarMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      popupsDisplayed:false,
  }
  store = Ext.create('Ext.data.Store', {
      data: [
          {title: '找到我'},
          {title: '重启'},
          {title: '关机'},
          {title: '设置'},
          {title: '取消'}
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
  onClickHeaderSetting = ()=>{
    this.props.toggleMenu();
    this.setState({
      popupsDisplayed:!this.state.popupsDisplayed
    });
  }
  onClickPopupMask = ()=>{
    this.setState({
      popupsDisplayed:!this.state.popupsDisplayed
    });
  }
  tpl = data => (
        <div>
            <div style={{fontSize: '21px',color:'#0087ff',textAlign:'center' }}>{data.title} {data.last_name}</div>
        </div>
    )
    onPopupSelect = (list, record) => {
      this.setState({
        popupsDisplayed:!this.state.popupsDisplayed
      });
        Ext.toast(`You selected ${record.get('title')}.`)
    }
  render () {
    let {popupsDisplayed} = this.state;
    let {displayed} = this.props;
    return (
      <div className="" style={{width:'100%',height:'100%'}}>
        <Container
            width='100%'
            height='100%'
            layout='vbox'
        >
            <Container layout={{type: 'hbox',pack: 'space-between',align: 'bottom'}} padding="20 20 10 20" height="115px" style={{backgroundColor: '#569fea'}}>
              <div>
                <div style={{height:'60px',textAlign:'center'}}>
                  <span className="x-fa fa-user-circle-o" style={{fontSize:'45px',color:'#dad5d5'}}></span>
                </div>
                <div style={{}}><span style={{color:'#fff'}}>Administrator</span></div>
                <div style={{}}><span style={{color:'#dad5d5'}}>192.168.9.67</span></div>
              </div>
              <div><Button ui="alt" cls="icon_big" iconCls="x-fa fa-gear" onTap={this.onClickHeaderSetting}/></div>
            </Container>
            <Button text="Settings" iconCls="x-fa fa-gear" onTap={this.props.toggleMenu}/>
            <Button text="New Item" iconCls="x-fa fa-pencil" onTap={this.props.toggleMenu} />
            <Button text="Star" iconCls="x-fa fa-star" onTap={this.props.toggleMenu}/>
        </Container>

        <div className={popupsDisplayed?"header-popups-mask active":"header-popups-mask"} onClick={this.onClickPopupMask}></div>
        <Container cls={popupsDisplayed?"popup_content active":"popup_content"}
          zIndex={'100'}
          height={'auto'}
          padding="0 10"
          style={{backgroundColor:'#fff',borderBottom: '1px solid #bfbbbb',position:'fixed'}}
          >
            <List cls="list_container"
              selfAlign="center"
              itemTpl={this.tpl}
              onSelect={this.onPopupSelect}
              store={this.store}
            />
        </Container>
      </div>
    );
  }

}

export default SidebarMobile;
