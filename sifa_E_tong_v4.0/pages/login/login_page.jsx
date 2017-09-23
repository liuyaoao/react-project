// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

// import ErrorBar from 'components/error_bar.jsx';
import FormError from 'components/form_error.jsx';

// import { webLogin} from 'actions/user_actions.jsx';
import myWebClient from 'client/my_web_client.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import * as commonUtils from 'pages/utils/common_utils.jsx';
import Constants from 'utils/constants.jsx';
const ActionTypes = Constants.ActionTypes;
import {browserHistory, Link} from 'react-router/es6';

import React from 'react';
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';
// import logoImage from 'images/logo.png';
import logoImage from 'images/signup_logo.png';
import lockImage from 'images/signup_lock.png';
import userImage from 'images/signup_user.png';

export default class LoginPage extends React.Component {
    static get propTypes() {
        return {
            location: React.PropTypes.object.isRequired,
            params: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);

        this.preSubmit = this.preSubmit.bind(this);
        this.submit = this.submit.bind(this);
        this.finishSignin = this.finishSignin.bind(this);

        this.handleLoginIdChange = this.handleLoginIdChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.createNewVerifyCode = this.createNewVerifyCode.bind(this);

        let loginId = '';
        // if (this.props.location.query.extra === Constants.SIGNIN_VERIFIED && this.props.location.query.email) {
        //     loginId = this.props.location.query.email;
        // }

        this.state = {
            loginId,
            password: '',
            verifyCode:'',
            createdVerifyCode:'',
            loading: false
        };
    }
    componentWillMount() {
      this.createNewVerifyCode();
    }
    componentDidMount() {
        document.title = global.window.mm_config.SiteName;
        if (localStorage.getItem(window.localStoreTokenName)) {
            browserHistory.push("/modules");
        }
    }

    preSubmit(e) {
        e.preventDefault();

        // password managers don't always call onInput handlers for form fields so it's possible
        // for the state to get out of sync with what the user sees in the browser
        let loginId = this.refs.loginId.value;
        if (loginId !== this.state.loginId) {
            this.setState({loginId});
        }

        const password = this.refs.password.value;
        if (password !== this.state.password) {
            this.setState({password});
        }

        let verifyCode = this.refs.verifyCode.value;
        if (verifyCode !== this.state.verifyCode) {
            this.setState({verifyCode});
        }
        // 判断验证码是否正确，暂时注释掉。
        // if(verifyCode.toLowerCase() != this.state.createdVerifyCode.toLowerCase()){ //验证码有错误.
        //   this.setState({
        //       serverError: '验证码有误！'
        //   });
				// 	return;
				// }

        // don't trim the password since we support spaces in passwords
        loginId = loginId.trim().toLowerCase();

        if (!loginId) {
            // it's slightly weird to be constructing the message ID, but it's a bit nicer than triply nested if statements
            let msgId = 'login.no';
            this.setState({
                serverError: '请填写登录账号！'
            });
            return;
        }

        if (!password) {
            this.setState({
                serverError: '请填写你的密码！'
            });
            return;
        }
        this.submit(loginId, password, '');
    }

    submit(loginId, password, token) {
        this.setState({serverError: null, loading: true});

        myWebClient.webLogin(
            loginId,
            commonUtils.Base64Encode(password),
            token,
            () => {
                // check for query params brought over from signup_user_complete
                // const hash = this.props.location.query.h;
                // const data = this.props.location.query.d;
                // const inviteId = this.props.location.query.id;
                this.finishSignin();
            },
            (err) => {
                if (err.id === 'api.user.login.not_verified.app_error') {
                    browserHistory.push('/should_verify_email?&email=' + encodeURIComponent(loginId));
                } else if (err.id === 'store.sql_user.get_for_login.app_error' ||
                    err.id === 'ent.ldap.do_login.user_not_registered.app_error') {
                    this.setState({
                        loading: false,
                        serverError: '没有发现匹配账户信息！'
                    });
                } else if (err.id === 'api.user.check_user_password.invalid.app_error' || err.id === 'ent.ldap.do_login.invalid_password.app_error') {
                    this.setState({
                        loading: false,
                        serverError: '你的密码不正确！'
                    });
                } else {
                    let message = "请检查你的用户名和密码是否有错，请重新输入！！"; //err.message
                    this.setState({
                      serverError: err.message,
                      loading: false
                    });
                }
            }
        );
    }

    finishSignin(team) {
        const query = this.props.location.query;
        myWebClient.getInitialLoad(
            (data, res) => {
                if (!data && res.text) {
                    data = JSON.parse(res.text);
                }
                global.window.mm_config = data.client_cfg;
                global.window.mm_config.SiteName = "司法e通";
                UserStore.setNoAccounts(data.no_accounts);
                UserStore.setIsAdmin(data.isadmin);
                data.permissions && UserStore.setPermissionData(data.permissions);
                if (data.user && data.user.id) {
                    global.window.mm_user = data.user;
                    AppDispatcher.handleServerAction({
                        type: ActionTypes.RECEIVED_ME,
                        me: data.user
                    });
                }

                if (data.preferences) {
                    AppDispatcher.handleServerAction({
                        type: ActionTypes.RECEIVED_PREFERENCES,
                        preferences: data.preferences
                    });
                }
                browserHistory.push("/modules");
            },
            (err) => {
              let method = 'getInitialLoad';
              AppDispatcher.handleServerAction({
                  type: ActionTypes.RECEIVED_ERROR,
                  err,
                  method
              });
              callback && callback();
            }
        );
    }


    handleLoginIdChange(e) {
        this.setState({
            loginId: e.target.value
        });
    }

    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        });
    }
    handleVerifyCodeChange = (e)=>{ //验证码
      this.setState({
        verifyCode:e.target.value
      });
    }
    onClickChangeVerifyCode = (e)=>{ //点击了更换验证码
      this.createNewVerifyCode();
    }
    createNewVerifyCode(){
			// 验证码组成库
			let arrays=new Array(
                '1','2','3','4','5','6','7','8','9','0',
                'a','b','c','d','e','f','g','h','i','j',
                'k','l','m','n','o','p','q','r','s','t',
                'u','v','w','x','y','z',
                'A','B','C','D','E','F','G','H','I','J',
                'K','L','M','N','O','P','Q','R','S','T',
                'U','V','W','X','Y','Z'
          	);
			// 重新初始化验证码
			let code ='';
			// 随机从数组中获取四个元素组成验证码
			for(let i = 0; i<4; i++){
				// 随机获取一个数组的下标
				let r = parseInt(Math.random()*arrays.length);
				code += arrays[r];
			}
			this.setState({createdVerifyCode:code});
		}


    createLoginOptions() {
        // const extraParam = this.props.location.query.extra;
        const loginControls = [];

        let errorClass = '';
        if (this.state.serverError) {
            errorClass = ' has-error';
        }

        let loginButton = '登 录';

        if (this.state.loading) {
            loginButton =
            (<span>
                <span className='fa fa-refresh icon--rotate'/>
                <span>登录中...</span>
            </span>);
        }

        loginControls.push(
            <form
                key='loginBoxes'
                onSubmit={this.preSubmit}
            >
                <div className='signup__email-container'>
                    <FormError
                        error={this.state.serverError}
                        margin={true}
                    />
                    <div className={'form-group' + errorClass}>
                        <input
                            className='form-control'
                            ref='loginId'
                            name='loginId'
                            value={this.state.loginId}
                            onChange={this.handleLoginIdChange}
                            placeholder={'电子邮件或用户名'}
                            spellCheck='false'
                            autoCapitalize='off'
                        />
                    </div>
                    <div className={'form-group' + errorClass}>
                        <input
                            type='password'
                            className='form-control'
                            ref='password'
                            name='password'
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            placeholder={'密码'}
                            spellCheck='false'
                        />
                    </div>
                    {/*<span style={{margin:'-15px 0 15px 0',
                    display:'inline-block',color:'#999',fontSize:'15px'}}>
                    默认账户:test3ren@163.com
                    &nbsp;密码:siteview
                    </span>*/}
                    <div className='form-group'>
                      <input style={{display:'inline-block',width:'50%'}}
                          className='form-control'
                          ref='verifyCode'
                          name='verifyCode'
                          value={this.state.verifyCode}
                          onChange={this.handleVerifyCodeChange}
                          autoComplete="off"
                          placeholder='验证码'
                      />
                      <span className='verifyCodeContainer'>{this.state.createdVerifyCode}</span>
                      <a href="#" style={{display:'inline-block',color:'#fff'}} onClick={this.onClickChangeVerifyCode}>换一个</a>
                    </div>
                    <div className='form-group'>
                        <button
                            id='loginButton'
                            type='submit'
                            className='btn btn-primary'
                            style={{width:'100%',borderRadius:'3px'}}
                        >
                            { loginButton }
                        </button>
                    </div>
                </div>
            </form>
        );

        return (
            <div>
                {loginControls}
            </div>
        );
    }

    render() {
        let content;
        let customContent=null;
        content = this.createLoginOptions();

        return (
            <div style={{fontSize:'16px'}}>
                <div className="signup_backgroundImg"></div>
                {/*<ErrorBar/>*/}
                <div className='col-sm-12'>
                    <div className={'signup-team__container sifa_login_container'}>
                        <div className='signup__markdown'>
                            {customContent}
                        </div>
                        <img
                            className='signup-team-logo'
                            src={logoImage}
                        />
                        <div className={'sifa_login_title'} style={{textAlign:'center',lineHeight:'60px',marginBottom:'24px'}}>
                            <img className='' src={logoImage} style={{display:'inline-block',width: '60px',marginRight: '12px'}}/>
                            <span style={{color:'#fff',lineHeight:'60px',fontSize:'36px',verticalAlign: 'middle'}}>司法e通</span>
                        </div>
                        <div className='signup__content'>
                            <div className='signup_background'></div>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
