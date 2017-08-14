
import jquery from 'jquery';
import React from 'react';
import Mock from 'mockjs';
import { Card,Row,Col,Tabs,Icon } from 'antd';
import { lineData } from '../data/data.js';

const TabPane = Tabs.TabPane;
import VPortContentPanel from './VPortContentPanel.jsx';
import SettingContentPanel from './SettingContentPanel.jsx';
import DiagnoseContentPanel from './DiagnoseContentPanel.jsx';
import '../less/Container.less'

export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          active_vPort:1,
          active_toolTab:'',
          idx: []
        }
    }

    componentDidMount() {
        // jquery.ajax({
        //     url:'getProfile'
        // })
        // .done(function(res) {
        //     let data = JSON.parse(res);
        //     // 需要绑定this
        //     this.setState({idx:data.idx})
        // }.bind(this))
    }
    onClickVPortTab=(evt)=>{
      console.log("left tab changed--:",evt,jquery(evt.target).data("key"));
      this.setState({
        active_vPort:jquery(evt.target).data("key"),
        active_toolTab:'',
      });
    }
    onClickToolTab = (evt)=>{
      this.setState({
        active_vPort:0,
        active_toolTab:jquery(evt.target).closest("li").data("key"),
      });
    }

    render() {
        return (
            <div>
              <div className={'main_container'}>
                  <div className={'left_tab'}>
                    <ul>
                      <li className={this.state.active_vPort==1?'active':''} onClick={this.onClickVPortTab} data-key="1">vPort 1</li>
                      <li className={this.state.active_vPort==2?'active':''} onClick={this.onClickVPortTab} data-key="2">vPort 2</li>
                      <li className={this.state.active_vPort==3?'active':''} onClick={this.onClickVPortTab} data-key="3">vPort 3</li>
                      <li className={this.state.active_vPort==4?'active':''} onClick={this.onClickVPortTab} data-key="4">vPort 4</li>
                      <li className={this.state.active_vPort==5?'active':''} onClick={this.onClickVPortTab} data-key="5">vPort 5</li>

                      <li className={'blank_tab'}></li>
                      <li className={this.state.active_toolTab=="setting"?'tool_tab active':'tool_tab'}
                        onClick={this.onClickToolTab}
                        data-key="setting"><Icon onClick={this.onClickToolTab} type="setting" />
                      </li>
                      <li className={this.state.active_toolTab=="diagnose"?'tool_tab active':'tool_tab'}
                        onClick={this.onClickToolTab}
                        data-key="diagnose"><Icon onClick={this.onClickToolTab} type="eye-o" />
                      </li>
                    </ul>
                  </div>
                  <div className={'main_content'}>
                    {this.state.active_vPort?<VPortContentPanel/>:null}
                    {this.state.active_toolTab=="setting"?<SettingContentPanel/>:null}
                    {this.state.active_toolTab=="diagnose"?<DiagnoseContentPanel/>:null}
                  </div>
              </div>
            </div>
        )
    }
}
