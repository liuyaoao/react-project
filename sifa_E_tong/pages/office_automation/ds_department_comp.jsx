//发送- 按部门
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { SearchBar, Button } from 'antd-mobile';
import { Icon } from 'antd';

class DS_DepartmentComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  onClickSend = () => {
    this.props.backSendContentCall();
  }

  render() {
    const data = [
     { value: 0, label: '李喆' },
     { value: 1, label: '邓双红' },
     { value: 2, label: '赖涛生' },
     { value: 3, label: '陈林' },
     { value: 4, label: '王剑' },
     { value: 5, label: '赵兴' },
     { value: 6, label: '王文' },
     { value: 7, label: '杨昌励' },
     { value: 8, label: '尹光宇' },
     { value: 9, label: '简洁' },
     { value: 10, label: '李煜明' },
     { value: 11, label: '张记' },
     { value: 12, label: '付利军' },
     { value: 13, label: '任宇' },
     { value: 14, label: '郭政权' },
     { value: 15, label: '邓红' },
     { value: 16, label: '高建湘' },
     { value: 17, label: '向良军' }
   ];
    return (
      <div style={{minHeight:"5rem",padding:"0.2rem"}}>
          <div className="flex-container">
            <div className="sub-title">
              <h5 className="pull-left">长沙市司法局</h5>
            </div>
            <div className="searchBar_custom">
              <SearchBar placeholder="搜索" />
            </div>
            <div className="checkbox_list">
              {data.map(i => (
                <div key={i.value} className="checkbox_custom">
                  <input type="checkbox" id={i.value} className="checkbox" />
                  <label htmlFor={i.value}><span className="box"><i></i></span>{i.label}</label>
                </div>
              ))}
            </div>
            <Button className="btn" type="primary" onClick={this.onClickSend}>发送</Button>
          </div>
      </div>
    )
  }
}

DS_DepartmentComp.defaultProps = {
};

DS_DepartmentComp.propTypes = {
};

export default DS_DepartmentComp;
