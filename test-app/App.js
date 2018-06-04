import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  state={
    value1:'',
    value2:'',
  }
  onChildValueChange = (valueType,value)=>{
    this.setState({
      ['value'+valueType]:value
    });
  }
  onChangeValue1 = (e)=>{
    console.log(e.target);
    this.setState({
      value1:e.target.value
    });
  }
  onChangeValue2 = (e)=>{
    this.setState({
      value2:e.target.value
    });
  }
  render() {
    return (
      <div className="App">
        <div>父组件：</div>
        <div>
          <input type='text' value={this.state.value1} onChange={this.onChangeValue1}/>
          <input type='text' value={this.state.value2} onChange={this.onChangeValue2}/>
        </div>
        <ChildApp childValue1={this.state.value1} childValue2={this.state.value2} onChildValueChange={this.onChildValueChange.bind(this)}/>
      </div>
    );
  }
}

class ChildApp extends Component{
  state={
  }
  onChangeValue1 = (e)=>{
    this.props.onChildValueChange(1,e.target.value);
  }
  onChangeValue2 = (e)=>{
    this.props.onChildValueChange(2,e.target.value);
  }
  render(){
    return (
      <div>
        <div>子组件：</div>
        <div>
          <input type='text' value={this.props.childValue1} onChange={this.onChangeValue1}/>
          <input type='text' value={this.props.childValue2} onChange={this.onChangeValue2}/>
        </div>
      </div>
    );
  }
}

export default App;
