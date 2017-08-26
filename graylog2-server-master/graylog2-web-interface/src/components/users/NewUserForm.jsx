import React from 'react';
import { Row, Col, Input, Button } from 'react-bootstrap';

import RolesSelect from 'components/users/RolesSelect';
import TimeoutInput from 'components/users/TimeoutInput';
import { TimezoneSelect } from 'components/common';

import StoreProvider from 'injection/StoreProvider';
const UsersStore = StoreProvider.getStore('Users');

import ValidationsUtils from 'util/ValidationsUtils';

const NewUserForm = React.createClass({
  propTypes: {
    roles: React.PropTypes.array.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      users: [],
    };
  },

  componentDidMount() {
    UsersStore.loadUsers().then(users => {
      this.setState({ users });
    });
  },

  _onUsernameChange(event) {
    const usernameField = this.refs.username.getInputDOMNode();
    const usernameExists = this.state.users.some(user => user.username === event.target.value);

    ValidationsUtils.setFieldValidity(usernameField, usernameExists, '用户名已存在');
  },

  _onPasswordChange() {
    const passwordField = this.refs.password;
    const passwordConfirmField = this.refs.password_repeat;

    if (passwordField.value !== '' && passwordConfirmField.value !== '') {
      ValidationsUtils.setFieldValidity(passwordConfirmField, passwordField.value !== passwordConfirmField.value, '密码不匹配');
    }
  },

  _onSubmit(evt) {
    evt.preventDefault();
    const result = {};
    Object.keys(this.refs).forEach((ref) => {
      if (ref !== 'password_repeat') {
        result[ref] = (this.refs[ref].getValue ? this.refs[ref].getValue() : this.refs[ref].value);
      }
    });

    this.props.onSubmit(result);
  },

  render() {
    const rolesHelp = (
      <span className="help-block">
        分配有关的角色给该用户以授予其访问有关消息流和仪表板的权限。<br />
        <em>Reader</em> 角色授予对系统的基本访问权限并启用。<br />
        <em>Admin</em> 角色授予对DeepLOG一切的访问权限。
      </span>
    );
    return (
      <form id="create-user-form" className="form-horizontal" onSubmit={this._onSubmit}>
        <Input ref="username" name="username" id="username" type="text" maxLength={100}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="用户名" help="选择一个用于登录的唯一用户名。" required
               onChange={this._onUsernameChange} autoFocus />

        <Input ref="full_name" name="fullname" id="fullname" type="text" maxLength={200}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="全名" help="给这个账户一个描述性名称，例如全名。" required />

        <Input ref="email" name="email" id="email" type="email" maxLength={254}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10"
               label="邮箱地址" help="给出用于联系的邮箱地址" required />

        <Input label="密码"
               help="密码必须至少6个字符长。我们建议使用一个强壮的密码。"
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <Row>
            <Col sm={6}>
              <input className="form-control" ref="password" name="password" id="password" type="password"
                     placeholder="密码" required minLength="6" onChange={this._onPasswordChange} />
            </Col>
            <Col sm={6}>
              <input className="form-control" ref="password_repeat" id="password-repeat" type="password"
                     placeholder="重复密码" required minLength="6" onChange={this._onPasswordChange} />
            </Col>
          </Row>
        </Input>

        <Input label="角色" help={rolesHelp}
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <RolesSelect ref="roles" availableRoles={this.props.roles} userRoles={['Reader']} className="form-control" />
        </Input>

        <TimeoutInput ref="session_timeout_ms" />

        <Input label="时区" help="选择时区用以显示时间，或者不管它以使用系统的默认时间。"
               labelClassName="col-sm-2" wrapperClassName="col-sm-10">
          <TimezoneSelect ref="timezone" className="timezone-select" />
        </Input>

        <div className="form-group">
          <Col smOffset={2} sm={10}>
            <Button type="submit" bsStyle="success" className="create-user">
              创建用户
            </Button>
          </Col>
        </div>
      </form>
    );
  },
});

export default NewUserForm;
