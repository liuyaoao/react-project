import $ from 'jquery';
import React, { Component }  from 'react';
import ReactDOM from 'react-dom';

//窗口内容模板 组件
class WindowContentTpl extends Component{
  state = {
    ContentComp:null
  }
  componentDidMount(){
    let comp = require("../../windows/"+this.props.contentComp);
    this.setState({
      ContentComp:comp.default
    });
  }
  componentWillMount(){

  }
  render () {
    let {ContentComp} = this.state;
    // let ContentComp = require(""+this.props.contentComp).default;
    return (
      <div className="window-content" style={{padding:"0 1px"}}>
        { ContentComp ? <ContentComp manager={this.props.manager}/>:
          <div className="padding10"><label>该窗口还没有添加任何内容:</label>
            <br/>
            <p>请确保窗口内容是否添加正确！</p>
          </div>
        }
      </div>
    )
  }

}

export default WindowContentTpl;
