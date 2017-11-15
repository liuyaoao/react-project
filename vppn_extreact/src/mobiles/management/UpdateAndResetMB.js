import React,{Component} from 'React';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';


class UpdateAndResetMB extends Component{
  state={
    bodyHeight:500,
    bodyWidth:'100%',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  render(){
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <Container layout="vbox" padding="10 10 10 10">
          <Panel layout="vbox">
            <div>系统更新</div>

          </Panel>
          <Panel layout="vbox">
            <div>配置备份和还原</div>

          </Panel>
        </Container>
      </div>
    );
  }

}
export default UpdateAndResetMB;
