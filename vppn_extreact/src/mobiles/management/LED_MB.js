import React,{Component} from 'React';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
import { Container,Sheet,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField } from '@extjs/ext-react';


class LED_MB extends Component{
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
          <div>LED的内容区</div>

        </Container>
      </div>
    );
  }
}

export default LED_MB;
