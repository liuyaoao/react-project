
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

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
    let {} = this.state;
    let {contentId} = this.props;
    return (
      <div style={{margin:'0',padding:'10px'}}>
        <Container
          layout={{ type: 'vbox', pack: 'left',align:'left'}}
        >
          网页过滤器
        </Container>
      </div>
    );
  }

}

export default ParentFilterMB;
