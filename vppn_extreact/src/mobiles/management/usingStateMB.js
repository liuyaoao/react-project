import React,{Component} from 'React';
import Intl from '../../intl/Intl';
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField } from '@extjs/ext-react';


class UsingStateMB extends Component{
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
          <div>使用状况的内容区</div>

        </Container>
      </div>
    );
  }
}

export default UsingStateMB;
