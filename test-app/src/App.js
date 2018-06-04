import React, { Component } from 'react';
import $ from 'jquery';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  state={
    leftZoneCls:'content leftZone',
    rightOneCls:'content rightOne',
    rightTwoCls:'content rightTwo',
    showRightOne:true,
    showRightTwo:true,
  }
  onClickLeftOne = (e)=>{
    // console.log($(e));
    var leftZoneCls = this.state.leftZoneCls;
    var rightOneCls = this.state.rightOneCls;
    var leftZoneArr = leftZoneCls.split(' ');
    var rightTwoArr = rightOneCls.split(' ');
    var newLeftZoneCls = '',newRightTwoCls = '';
    if(leftZoneArr.indexOf('foldRightOne') != -1){
      leftZoneArr.splice(leftZoneArr.indexOf('foldRightOne'),1);
      newLeftZoneCls = leftZoneArr.join(' ');

      rightTwoArr.splice(rightTwoArr.indexOf('foldRightOne'),1);
      newRightTwoCls = rightTwoArr.join(' ');
      // showRightOne = true;
    }else{
      newLeftZoneCls = this.state.leftZoneCls+' foldRightOne';
      newRightTwoCls = this.state.rightOneCls+' foldRightOne';
      // showRightOne = false;
    }

    this.setState({
      leftZoneCls:newLeftZoneCls,
      rightOneCls:newRightTwoCls,
      showRightOne:!this.state.showRightOne,
    });
  }
  onClickLeftTwo = (e)=>{
      var leftZoneCls = this.state.leftZoneCls;
      var rightTwoCls = this.state.rightTwoCls;
      var leftZoneArr = leftZoneCls.split(' ');
      var rightTwoArr = rightTwoCls.split(' ');
      var newLeftZoneCls = '',newRightTwoCls = '';
      if(leftZoneArr.indexOf('foldRightTwo') != -1){
        leftZoneArr.splice(leftZoneArr.indexOf('foldRightTwo'),1);
        newLeftZoneCls = leftZoneArr.join(' ');

        rightTwoArr.splice(rightTwoArr.indexOf('foldRightTwo'),1);
        newRightTwoCls = rightTwoArr.join(' ');
      }else{
        newLeftZoneCls = this.state.leftZoneCls+' foldRightTwo';
        newRightTwoCls = this.state.rightTwoCls+' foldRightTwo';
      }

      this.setState({
        leftZoneCls:newLeftZoneCls,
        rightTwoCls:newRightTwoCls,
        showRightTwo:!this.state.showRightTwo,
      });
  }
  render(){
    return (
      <div className='container'>
        <div className={this.state.leftZoneCls}>线图缺少纬度和度量项。</div>
        <div className={this.state.rightOneCls}>
          <div style={{display:this.state.showRightOne?'block':'none'}}>右边块一区域</div>
          <button type="button" onClick={this.onClickLeftOne}>收起</button>
        </div>
        <div className={this.state.rightTwoCls}>
          <div style={{display:this.state.showRightTwo?'block':'none'}}>右边块二区域</div>
          <button type="button" onClick={this.onClickLeftTwo}>收起</button>
        </div>
      </div>
    );
  }
}


// class App extends Component {
//   state={
//     value1:'',
//     value2:'',
//   }
//   onChildValueChange = (valueType,value)=>{
//     this.setState({
//       ['value'+valueType]:value
//     });
//   }
//   onChangeValue1 = (e)=>{
//     console.log(e.target);
//     this.setState({
//       value1:e.target.value
//     });
//   }
//   onChangeValue2 = (e)=>{
//     this.setState({
//       value2:e.target.value
//     });
//   }
//   render() {
//     return (
//       <div className="App">
//         <div>父组件：</div>
//         <div>
//           <input type='text' value={this.state.value1} onChange={this.onChangeValue1}/>
//           <input type='text' value={this.state.value2} onChange={this.onChangeValue2}/>
//         </div>
//         <ChildApp childValue1={this.state.value1} childValue2={this.state.value2} onChildValueChange={this.onChildValueChange.bind(this)}/>
//       </div>
//     );
//   }
// }
//
// class ChildApp extends Component{
//   state={
//   }
//   onChangeValue1 = (e)=>{
//     this.props.onChildValueChange(1,e.target.value);
//   }
//   onChangeValue2 = (e)=>{
//     this.props.onChildValueChange(2,e.target.value);
//   }
//   render(){
//     return (
//       <div>
//         <div>子组件：</div>
//         <div>
//           <input type='text' value={this.props.childValue1} onChange={this.onChangeValue1}/>
//           <input type='text' value={this.props.childValue2} onChange={this.onChangeValue2}/>
//         </div>
//       </div>
//     );
//   }
// }

export default App;
