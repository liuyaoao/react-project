// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import LoginMfa from './components/login_mfa.jsx';
import ErrorBar from 'components/error_bar.jsx';
import FormError from 'components/form_error.jsx';

import * as GlobalActions from 'actions/global_actions.jsx';
import {addUserToTeamFromInvite} from 'actions/team_actions.jsx';
import {checkMfa, webLogin} from 'actions/user_actions.jsx';
import BrowserStore from 'stores/browser_store.jsx';
import UserStore from 'stores/user_store.jsx';

import Client from 'client/web_client.jsx';
import * as AsyncClient from 'utils/async_client.jsx';
import * as TextFormatting from 'utils/text_formatting.jsx';

import * as Utils from 'utils/utils.jsx';
import Constants from 'utils/constants.jsx';

import {FormattedMessage} from 'react-intl';
import {browserHistory, Link} from 'react-router/es6';

import React from 'react';
// import logoImage from 'images/logo.png';
import logoImage from 'images/signup_logo.png';
import lockImage from 'images/signup_lock.png';
import userImage from 'images/signup_user.png';

export default class LoginController extends React.Component {
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
        if (this.props.location.query.extra === Constants.SIGNIN_VERIFIED && this.props.location.query.email) {
            loginId = this.props.location.query.email;
        }

        this.state = {
            ldapEnabled: global.window.mm_license.IsLicensed === 'true' && global.window.mm_config.EnableLdap === 'true',
            usernameSigninEnabled: global.window.mm_config.EnableSignInWithUsername === 'true',
            emailSigninEnabled: global.window.mm_config.EnableSignInWithEmail === 'true',
            samlEnabled: global.window.mm_license.IsLicensed === 'true' && global.window.mm_config.EnableSaml === 'true',
            loginId,
            password: '',
            verifyCode:'',
            createdVerifyCode:'',
            showMfa: false,
            loading: false
        };
    }
    componentWillMount() {
      this.createNewVerifyCode();
    }
    componentDidMount() {
        document.title = global.window.mm_config.SiteName;
        BrowserStore.removeGlobalItem('team');
        if (UserStore.getCurrentUser()) {
            // GlobalActions.redirectUserToDefaultTeam();
            browserHistory.push("modules");
        }

        if (this.props.location.query.extra === Constants.SIGNIN_VERIFIED && this.props.location.query.email) {
            this.refs.password.focus();
        }

        AsyncClient.checkVersion();
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
        if(verifyCode.toLowerCase() != this.state.createdVerifyCode.toLowerCase()){ //验证码有错误。
          this.setState({
              serverError: (
                  <FormattedMessage
                      id='login.noVerifyCode'
                      defaultMessage='验证码有误！'
                  />
              )
          });
					return;
				}

        // don't trim the password since we support spaces in passwords
        loginId = loginId.trim().toLowerCase();

        if (!loginId) {
            // it's slightly weird to be constructing the message ID, but it's a bit nicer than triply nested if statements
            let msgId = 'login.no';
            if (this.state.emailSigninEnabled) {
                msgId += 'Email';
            }
            if (this.state.usernameSigninEnabled) {
                msgId += 'Username';
            }
            if (this.state.ldapEnabled) {
                msgId += 'LdapUsername';
            }

            this.setState({
                serverError: (
                    <FormattedMessage
                        id={msgId}
                        values={{
                            ldapUsername: global.window.mm_config.LdapLoginFieldName || Utils.localizeMessage('login.ldapUsernameLower', 'AD/LDAP username')
                        }}
                    />
                )
            });
            return;
        }

        if (!password) {
            this.setState({
                serverError: (
                    <FormattedMessage
                        id='login.noPassword'
                        defaultMessage='Please enter your password'
                    />
                )
            });
            return;
        }

        checkMfa(
            loginId,
            (requiresMfa) => {
                if (requiresMfa) {
                    this.setState({showMfa: true});
                } else {
                    this.submit(loginId, password, '');
                }
            },
            (err) => {
                this.setState({serverError: err.message});
            }
        );
    }

    submit(loginId, password, token) {
        this.setState({serverError: null, loading: true});

        webLogin(
            loginId,
            password,
            token,
            () => {
                // check for query params brought over from signup_user_complete
                const hash = this.props.location.query.h;
                const data = this.props.location.query.d;
                const inviteId = this.props.location.query.id;
                if (inviteId || hash) {
                    addUserToTeamFromInvite(
                        data,
                        hash,
                        inviteId,
                        (team) => {
                            this.finishSignin(team);
                        },
                        () => {
                            // there's not really a good way to deal with this, so just let the user log in like normal
                            this.finishSignin();
                        }
                    );

                    return;
                }

                this.finishSignin();
            },
            (err) => {
                if (err.id === 'api.user.login.not_verified.app_error') {
                    browserHistory.push('/should_verify_email?&email=' + encodeURIComponent(loginId));
                } else if (err.id === 'store.sql_user.get_for_login.app_error' ||
                    err.id === 'ent.ldap.do_login.user_not_registered.app_error') {
                    this.setState({
                        showMfa: false,
                        loading: false,
                        serverError: (
                            <FormattedMessage
                                id='login.userNotFound'
                                defaultMessage="We couldn't find an account matching your login credentials."
                            />
                        )
                    });
                } else if (err.id === 'api.user.check_user_password.invalid.app_error' || err.id === 'ent.ldap.do_login.invalid_password.app_error') {
                    this.setState({
                        showMfa: false,
                        loading: false,
                        serverError: (
                            <FormattedMessage
                                id='login.invalidPassword'
                                defaultMessage='Your password is incorrect.'
                            />
                        )
                    });
                } else {
                    let message = "请检查你的用户名和密码是否有错，请重新输入！！"; //err.message
                    this.setState({showMfa: false, serverError: err.message, loading: false});
                }
            }
        );
    }

    finishSignin(team) {
        const query = this.props.location.query;
        GlobalActions.loadCurrentLocale();

        GlobalActions.emitInitialLoad(() => {
          browserHistory.push("/modules");
        })
        // if (query.redirect_to) {
        //     browserHistory.push(query.redirect_to);
        // } else if (team) {
        //     browserHistory.push(`/${team.name}`);
        // } else {
        //     GlobalActions.redirectUserToDefaultTeam();
        // }
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

    createCustomLogin() {
        if (global.window.mm_license.IsLicensed === 'true' &&
                global.window.mm_license.CustomBrand === 'true' &&
                global.window.mm_config.EnableCustomBrand === 'true') {
            const text = global.window.mm_config.CustomBrandText || '';

            return (
                <div>
                    <img
                        src={Client.getAdminRoute() + '/get_brand_image'}
                    />
                    <p dangerouslySetInnerHTML={{__html: TextFormatting.formatText(text)}}/>
                </div>
            );
        }

        return null;
    }

    createLoginPlaceholder() {
        const ldapEnabled = this.state.ldapEnabled;
        const usernameSigninEnabled = this.state.usernameSigninEnabled;
        const emailSigninEnabled = this.state.emailSigninEnabled;

        const loginPlaceholders = [];
        if (emailSigninEnabled) {
            loginPlaceholders.push(Utils.localizeMessage('login.email', 'Email'));
        }

        if (usernameSigninEnabled) {
            loginPlaceholders.push(Utils.localizeMessage('login.username', 'Username'));
        }

        if (ldapEnabled) {
            if (global.window.mm_config.LdapLoginFieldName) {
                loginPlaceholders.push(global.window.mm_config.LdapLoginFieldName);
            } else {
                loginPlaceholders.push(Utils.localizeMessage('login.ldapUsername', 'AD/LDAP Username'));
            }
        }

        if (loginPlaceholders.length >= 2) {
            return loginPlaceholders.slice(0, loginPlaceholders.length - 1).join(', ') +
                Utils.localizeMessage('login.placeholderOr', ' or ') +
                loginPlaceholders[loginPlaceholders.length - 1];
        } else if (loginPlaceholders.length === 1) {
            return loginPlaceholders[0];
        }

        return '';
    }

    checkSignUpEnabled() {
        return global.window.mm_config.EnableSignUpWithEmail === 'true' ||
            global.window.mm_config.EnableSignUpWithGitLab === 'true' ||
            global.window.mm_config.EnableSignUpWithOffice365 === 'true' ||
            global.window.mm_config.EnableSignUpWithGoogle === 'true' ||
            global.window.mm_config.EnableLdap === 'true' ||
            global.window.mm_config.EnableSaml === 'true';
    }

    createLoginOptions() {
        const extraParam = this.props.location.query.extra;
        let extraBox = '';
        if (extraParam) {
            if (extraParam === Constants.SIGNIN_CHANGE) {
                extraBox = (
                    <div className='alert alert-success'>
                        <i className='fa fa-check'/>
                        <FormattedMessage
                            id='login.changed'
                            defaultMessage=' Sign-in method changed successfully'
                        />
                    </div>
                );
            } else if (extraParam === Constants.SIGNIN_VERIFIED) {
                extraBox = (
                    <div className='alert alert-success'>
                        <i className='fa fa-check'/>
                        <FormattedMessage
                            id='login.verified'
                            defaultMessage=' Email Verified'
                        />
                    </div>
                );
            } else if (extraParam === Constants.SESSION_EXPIRED) {
                extraBox = (
                    <div className='alert alert-warning'>
                        <i className='fa fa-exclamation-triangle'/>
                        <FormattedMessage
                            id='login.session_expired'
                            defaultMessage=' Your session has expired. Please login again.'
                        />
                    </div>
                );
            } else if (extraParam === Constants.PASSWORD_CHANGE) {
                extraBox = (
                    <div className='alert alert-success'>
                        <i className='fa fa-check'/>
                        <FormattedMessage
                            id='login.passwordChanged'
                            defaultMessage=' Password updated successfully'
                        />
                    </div>
                );
            }
        }

        const loginControls = [];

        const ldapEnabled = this.state.ldapEnabled;
        const gitlabSigninEnabled = global.window.mm_config.EnableSignUpWithGitLab === 'true';
        const googleSigninEnabled = global.window.mm_config.EnableSignUpWithGoogle === 'true';
        const office365SigninEnabled = global.window.mm_config.EnableSignUpWithOffice365 === 'true';
        const samlSigninEnabled = this.state.samlEnabled;
        const usernameSigninEnabled = this.state.usernameSigninEnabled;
        const emailSigninEnabled = this.state.emailSigninEnabled;

        if (emailSigninEnabled || usernameSigninEnabled || ldapEnabled) {
            let errorClass = '';
            if (this.state.serverError) {
                errorClass = ' has-error';
            }

            let loginButton =
                (<FormattedMessage
                    id='login.signIn'
                    defaultMessage='Sign in'
                 />);

            if (this.state.loading) {
                loginButton =
                (<span>
                    <span className='fa fa-refresh icon--rotate'/>
                    <FormattedMessage
                        id='login.signInLoading'
                        defaultMessage='Signing in...'
                    />
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
                                placeholder={this.createLoginPlaceholder()}
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
                                placeholder={Utils.localizeMessage('login.password', 'Password')}
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
        }

        // if (global.window.mm_config.EnableOpenServer === 'true' && this.checkSignUpEnabled()) {
        //     loginControls.push(
        //         <div
        //             className='form-group'
        //             key='signup'
        //         >
        //             <span>
        //                 <FormattedMessage
        //                     id='login.noAccount'
        //                     defaultMessage="Don't have an account? "
        //                 />
        //                 <Link
        //                     id='signup'
        //                     to={'/signup_user_complete' + this.props.location.search}
        //                     className='signup-team-login'
        //                 >
        //                     <FormattedMessage
        //                         id='login.create'
        //                         defaultMessage='Create one now'
        //                     />
        //                 </Link>
        //             </span>
        //         </div>
        //     );
        // }

        // if (usernameSigninEnabled || emailSigninEnabled) {
        //     loginControls.push(
        //         <div
        //             key='forgotPassword'
        //             className='form-group'
        //         >
        //             <Link to={'/reset_password'}>
        //                 <FormattedMessage
        //                     id='login.forgot'
        //                     defaultMessage='I forgot my password'
        //                 />
        //             </Link>
        //         </div>
        //     );
        // }

        if ((emailSigninEnabled || usernameSigninEnabled || ldapEnabled) && (gitlabSigninEnabled || googleSigninEnabled || samlSigninEnabled || office365SigninEnabled)) {
            loginControls.push(
                <div
                    key='divider'
                    className='or__container'
                >
                    <FormattedMessage
                        id='login.or'
                        defaultMessage='or'
                    />
                </div>
            );

            loginControls.push(
                <h5 key='oauthHeader'>
                    <FormattedMessage
                        id='login.signInWith'
                        defaultMessage='Sign in with:'
                    />
                </h5>
            );
        }

        if (gitlabSigninEnabled) {
            loginControls.push(
                <a
                    className='btn btn-custom-login gitlab'
                    key='gitlab'
                    href={Client.getOAuthRoute() + '/gitlab/login' + this.props.location.search}
                >
                    <span>
                        <span className='icon'/>
                        <span>
                            <FormattedMessage
                                id='login.gitlab'
                                defaultMessage='GitLab'
                            />
                        </span>
                    </span>
                </a>
            );
        }

        if (googleSigninEnabled) {
            loginControls.push(
                <a
                    className='btn btn-custom-login google'
                    key='google'
                    href={Client.getOAuthRoute() + '/google/login' + this.props.location.search}
                >
                    <span>
                        <span className='icon'/>
                        <span>
                            <FormattedMessage
                                id='login.google'
                                defaultMessage='Google Apps'
                            />
                        </span>
                    </span>
                </a>
            );
        }

        if (office365SigninEnabled) {
            loginControls.push(
                <a
                    className='btn btn-custom-login office365'
                    key='office365'
                    href={Client.getOAuthRoute() + '/office365/login' + this.props.location.search}
                >
                    <span>
                        <span className='icon'/>
                        <span>
                            <FormattedMessage
                                id='login.office365'
                                defaultMessage='Office 365'
                            />
                        </span>
                    </span>
                </a>
            );
        }

        if (samlSigninEnabled) {
            loginControls.push(
                <a
                    className='btn btn-custom-login saml'
                    key='saml'
                    href={'/login/sso/saml' + this.props.location.search}
                >
                    <span>
                        <span className='icon fa fa-lock fa--margin-top'/>
                        <span>
                            {global.window.mm_config.SamlLoginButtonText}
                        </span>
                    </span>
                </a>
            );
        }

        if (loginControls.length === 0) {
            loginControls.push(
                <FormError
                    error={
                        <FormattedMessage
                            id='login.noMethods'
                            defaultMessage='No sign-in methods are enabled. Please contact your System Administrator.'
                        />
                    }
                    margin={true}
                />
            );
        }

        return (
            <div>
                {extraBox}
                {loginControls}
            </div>
        );
    }

    render() {
        let content;
        let customContent;
        let customClass;
        if (this.state.showMfa) {
            content = (
                <LoginMfa
                    loginId={this.state.loginId}
                    password={this.state.password}
                    submit={this.submit}
                />
            );
        } else {
            content = this.createLoginOptions();
            customContent = this.createCustomLogin();
            if (customContent) {
                customClass = 'branded';
            }
        }

        let description = null;
        if (global.window.mm_license.IsLicensed === 'true' && global.window.mm_license.CustomBrand === 'true' && global.window.mm_config.EnableCustomBrand === 'true') {
            description = global.window.mm_config.CustomDescriptionText;
        } else {
            description = (
                <FormattedMessage
                    id='web.root.signup_info'
                    defaultMessage='All team communication in one place, searchable and accessible anywhere'
                />
            );
        }

        return (
            <div style={{fontSize:'16px'}}>
                <div className="signup_backgroundImg"></div>
                <ErrorBar/>
                <div className='col-sm-12'>
                    <div className={'signup-team__container ' + customClass}>
                        <div className='signup__markdown'>
                            {customContent}
                        </div>
                        <img
                            className='signup-team-logo'
                            src={logoImage}
                        />
                        <div style={{textAlign:'center',lineHeight:'5rem',marginBottom:'2rem'}}>
                            <img className='' src={logoImage} style={{display:'inline-block',width: '5rem',marginRight: '1rem'}}/>
                            <span style={{display:'inline-block',fontWeight:'bold',color:'#fff',lineHeight:'5rem',fontSize:'3.5rem',verticalAlign: 'middle'}}>司法E通</span>
                        </div>
                        <div className='signup__content'>
                            <div className='signup_background'></div>
                            {/*<h1>{global.window.mm_config.SiteName}</h1>
                            <h4 className='color--light'>
                                {description}
                            </h4>*/}
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
