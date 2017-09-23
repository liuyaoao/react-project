
import $ from 'jquery';

import React from 'react';
import {Button,Icon} from 'antd';
import {Toast} from 'antd-mobile';
import {browserHistory} from 'react-router/es6';
import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
// import * as GlobalActions from 'actions/global_actions.jsx';

//可以写自定义的退出按钮传进来，不传也可以用默认的。
//默认： <LogOutComp />
//自定义原生： <LogOutComp> <button>退出</button></LogOutComp> ,可参考pages/modules_page.jsx.
export default class LogOutComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        // $('body').addClass('sticky');
        // $('#root').addClass('container-fluid');
    }
    componentWillUnmount() {
        // $('body').removeClass('sticky');
        // $('#root').removeClass('container-fluid');
    }
    onClickGoBack(){
      // browserHistory.go(-1);
      browserHistory.push('/modules');
    }
    onClickExitBtn(e){
      console.log("click 退出按钮：",e);
      Toast.info(<div><Icon type={'loading'} /><span>  正在退出...</span></div>, 3, null, true);
      myWebClient.removeToken();
      localStorage.removeItem(OAUtils.OA_LOGIN_INFO_KEY);
      myWebClient.logout(
          () => {
            Toast.hide();
            browserHistory.push('/login');
          },
          () => {
              browserHistory.push('/login');
          }
      );
    }
    render() {
        const content = [];
        const gobackEle = this.props.addGoBackBtn?(<button type="button" className="btn btn-primary comment-btn"
              style={{marginRight:'10px'}}
              onClick={this.onClickGoBack}>返回
            </button>):null;
        let childrenEle;
        if(this.props.children){
          childrenEle = (
            <div>{gobackEle}<div style={{display:'inline-block'}} onClick={this.onClickExitBtn}>{this.props.children}</div></div>
          );
        } else{
          childrenEle = (
            <div>{gobackEle}<button type="button" className="btn btn-primary comment-btn" onClick={this.onClickExitBtn}>退出</button></div>
          );
        }
        let cls_name = "log_out_btn " + this.props.className;
        return (
            <div className={cls_name} style={{display:'inline-block'}} >
              {childrenEle}
            </div>
        );
    }
}

LogOutComp.defaultProps = {
  addGoBackBtn:false
};

LogOutComp.propTypes = {
    children: React.PropTypes.object,
    addGoBackBtn:React.PropTypes.bool,
    className: React.PropTypes.string
};