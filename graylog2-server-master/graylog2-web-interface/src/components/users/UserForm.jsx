import React from 'react';
import Reflux from 'reflux';
import { Input, Button, Row, Col, Alert, Panel } from 'react-bootstrap';

import PermissionsMixin from 'util/PermissionsMixin';
import UserNotification from 'util/UserNotification';
import ValidationsUtils from 'util/ValidationsUtils';
import FormsUtils from 'util/FormsUtils';
import ObjectUtils from 'util/ObjectUtils';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');
const DashboardsStore = StoreProvider.getStore('Dashboards');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const UsersStore = StoreProvider.getStore('Users');

import TimeoutInput from 'components/users/TimeoutInput';
import EditRolesForm from 'components/users/EditRolesForm';
import { IfPermitted, MultiSelect, TimezoneSelect, Spinner } from 'components/common';

const UserForm = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },
  mixins: [PermissionsMixin, Reflux.connect(CurrentUserStore)],
  getInitialState() {
    return {
      streams: undefined,
      dashboards: undefined,
      roles: undefined,
      user: this._getUserStateFromProps(this.props),
    };
  },
  componentDidMount() {
    StreamsStore.listStreams().then((streams) => {
      this.setState({
        streams: streams.sort((s1, s2) => s1.title.localeCompare(s2.title)),
      });
    });
    DashboardsStore.listDashboards().then((dashboards) => {
      this.setState({ dashboards: dashboards.toArray().sort((d1, d2) => d1.title.localeCompare(d2.title)) });
    });
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.user.username !== nextProps.user.username) {
      this.setState({
        user: this._getUserStateFromProps(nextProps),
      });
    }
  },

  _getUserStateFromProps(props) {
    return {
      full_name: props.user.full_name,
      email: props.user.email,
      session_timeout_ms: props.user.session_timeout_ms,
      timezone: props.user.timezone,
      permissions: props.user.permissions,
    };
  },

  formatMultiselectOptions(collection) {
    return collection.map((item) => {
      return { value: item.id, label: item.title };
    });
  },
  formatSelectedOptions(permissions, permission, collection) {
    return collection
      .filter((item) => this.isPermitted(permissions, [`${permission}:${item.id}`]))
      .map((item) => item.id)
      .join(',');
  },
  _onPasswordChange() {
    const passwordField = this.refs.password.getInputDOMNode();
    const passwordConfirmField = this.refs.password_repeat.getInputDOMNode();

    if (passwordField.value !== '' && passwordConfirmField.value !== '') {
      ValidationsUtils.setFieldValidity(passwordConfirmField, passwordField.value !== passwordConfirmField.value, 'Passwords do not match');
    }
  },

  _changePassword(evt) {
    evt.preventDefault();
    const request = {};

    if (this.refs.old_password) {
      request.old_password = this.refs.old_password.getValue();
    }
    request.password = this.refs.password.getValue();

    UsersStore.changePassword(this.props.user.username, request).then(() => {
      UserNotification.success('密码修改成功.', '成功');
    }, () => {
      UserNotification.error('不能修改密码.请确认您当前密码是正确的.', '修改密码失败');
    });
  },

  _updateUser(evt) {
    evt.preventDefault();

    UsersStore.update(this.props.user.username, this.state.user).then(() => {
      UserNotification.success('用户修改成功.', '成功');
    }, () => {
      UserNotification.error('不能修改用户. 请检查您的日志,以了解更多信息.', '修改用户失败');
    });
  },

  _updateField(name, value) {
    const updatedUser = ObjectUtils.clone(this.state.user);
    updatedUser[name] = value;
    this.setState({ user: updatedUser });
  },

  _bindValue(event) {
    this._updateField(event.target.name, FormsUtils.getValueFromInput(event.target));
  },

  _onFieldChange(name) {
    return (value) => {
      this._updateField(name, value);
    };
  },

  _onPermissionsChange(entity, permission) {
    return (entityIds) => {
      const userPermissions = this.state.user.permissions.slice();
      let newUserPermissions = userPermissions.filter(p => p.indexOf(`${entity}:${permission}`) !== 0);

      const updatedPermissions = entityIds === '' ? [] : entityIds.split(',').map(id => `${entity}:${permission}:${id}`);
      const previousPermissions = userPermissions.filter(p => p.indexOf(`${entity}:${permission}`) === 0);

      // Remove edit permissions to entities without read permissions
      if (permission === 'read') {
        previousPermissions.forEach(previousPermission => {
          // Do nothing if permission is still there
          if (updatedPermissions.some(p => p === previousPermission)) {
            return;
          }

          // Remove edit permission
          const entityId = previousPermission.split(':').pop();
          newUserPermissions = newUserPermissions.filter(p => p !== `${entity}:edit:${entityId}`);
        });
      }

      // Grant read permissions to entities with edit permissions
      if (permission === 'edit') {
        updatedPermissions.forEach(updatePermission => {
          // Do nothing if permission was there before
          if (previousPermissions.some(p => p === updatePermission)) {
            return;
          }

          // Grant read permission
          const entityId = updatePermission.split(':').pop();
          newUserPermissions.push(`${entity}:read:${entityId}`);
        });
      }

      this._updateField('permissions', newUserPermissions.concat(updatedPermissions));
    };
  },

  render() {
    if (!this.state.streams || !this.state.dashboards) {
      return <Spinner />;
    }

    const user = this.state.user;
    const permissions = this.state.currentUser.permissions;

    let requiresOldPassword = true;
    if (this.isPermitted(permissions, 'users:passwordchange:*')) {
      // Ask for old password if user is editing their own account
      requiresOldPassword = this.props.user.username === this.state.currentUser.username;
    }

    const streamReadOptions = this.formatSelectedOptions(this.state.user.permissions, 'streams:read', this.state.streams);
    const streamEditOptions = this.formatSelectedOptions(this.state.user.permissions, 'streams:edit', this.state.streams);

    const dashboardReadOptions = this.formatSelectedOptions(this.state.user.permissions, 'dashboards:read', this.state.dashboards);
    const dashboardEditOptions = this.formatSelectedOptions(this.state.user.permissions, 'dashboards:edit', this.state.dashboards);

    return (
      <div>
        <Row className="row content">
          <Col lg={8}>
            <h2>用户信息</h2>
            <form className="form-horizontal user-form" id="edit-user-form" onSubmit={this._updateUser}>
              {user.read_only &&
                <span>
                  <Col smOffset={3} sm={9}>
                    <Alert bsStyle="warning" role="alert">
                      The admin user can only be modified in your DeepLOG server configuration file.
                    </Alert>
                  </Col>
                  <div className="clearfix" />
                  <br />
                </span>
              }
              <fieldset disabled={user.read_only}>
                <Input name="full_name" id="full_name" type="text" maxLength={200} value={user.full_name}
                       onChange={this._bindValue} labelClassName="col-sm-3" wrapperClassName="col-sm-9"
                       label="全名" help="为这个账户起一个描述性的名字,如你的全名."
                       required />

                <Input ref="email" name="email" id="email" type="email" maxLength={254} value={user.email}
                       onChange={this._bindValue} labelClassName="col-sm-3" wrapperClassName="col-sm-9"
                       label="邮箱地址" help="给联系人的电子邮件地址." required />

                {this.isPermitted(permissions, 'USERS_EDIT') &&
                  <span>
                    <div className="form-group">
                      <Col sm={9} smOffset={3}>
                        <Panel bsStyle="danger" header="设置个人权限已弃用,请考虑迁移到角色.">
                          这里列出的权限以及相结合的结果所授予的权限分配给用户的角色,
                          {/**The permissions listed here are the result of combining all granted permissions by the roles assigned to a user*/}
                          你可以编辑这个页面的底部,在这之前你可以将个人权限分配给用户.
                        </Panel>
                      </Col>
                      <label className="col-sm-3 control-label" htmlFor="streampermissions">消息流权限</label>
                      <Col sm={9}>
                        <MultiSelect ref="streamReadOptions" placeholder="选择消息流读取权限..."
                                     options={this.formatMultiselectOptions(this.state.streams)}
                                     value={streamReadOptions}
                                     onChange={this._onPermissionsChange('streams', 'read')} />
                                   <span className="help-block">用户可以<strong>查看</strong>选择的消息流
                          . 删除读访也会删除编辑访问权.</span>
                        <MultiSelect ref="streamEditOptions" placeholder="选择消息流编辑权限..."
                                     options={this.formatMultiselectOptions(this.state.streams)}
                                     value={streamEditOptions}
                                     onChange={this._onPermissionsChange('streams', 'edit')} />
                                   <span className="help-block">用户可以<strong>编辑</strong>选择的消息流
                          . 这里选择的值也可以继续访问.</span>
                      </Col>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="dashboardpermissions">仪表板权限</label>
                      <Col sm={9}>
                        <MultiSelect ref="dashboardReadOptions" placeholder="选择仪表板读取权限..."
                                     options={this.formatMultiselectOptions(this.state.dashboards)}
                                     value={dashboardReadOptions}
                                     onChange={this._onPermissionsChange('dashboards', 'read')} />
                                   <span className="help-block">用户可以<strong>查看</strong>仪表板
                          . 删除读访也会删除编辑访问权.</span>
                        <MultiSelect ref="dashboardEditOptions" placeholder="选择仪表板编辑权限..."
                                     options={this.formatMultiselectOptions(this.state.dashboards)}
                                     value={dashboardEditOptions}
                                     onChange={this._onPermissionsChange('dashboards', 'edit')} />
                                   <span className="help-block">用户可以<strong>编辑</strong>选择的仪表板
                          . 这里选择的值也可以继续访问.</span>
                      </Col>
                    </div>
                  </span>
                }
                {this.isPermitted(permissions, '*') &&
                <TimeoutInput ref="session_timeout_ms" value={user.session_timeout_ms} labelSize={3} controlSize={9}
                              onChange={this._onFieldChange('session_timeout_ms')} />
                }



                <div className="form-group">
                  <Col smOffset={3} sm={9}>
                    <Button type="submit" bsStyle="success" className="create-user">
                      更新用户
                    </Button>
                  </Col>
                </div>
              </fieldset>
            </form>
          </Col>
        </Row>
        <Row className="content">
          <Col lg={8}>
            <h2>修改密码</h2>
            {user.read_only ?
            <Col smOffset={3} sm={9}>
              <Alert bsStyle="warning" role="alert">
                请编辑DeepLOG服务器配置文件修改管理员密码.
              </Alert>
            </Col>
            :
              user.external ?
              <Col smOffset={3} sm={9}>
                <Alert bsStyle="warning" role="alert">
                  从外部系统创建这个用户并且你无法改变密码.有关更多信息,请与管理员联系.
                </Alert>
              </Col>
              :
              <form className="form-horizontal" style={{ marginTop: 10 }} onSubmit={this._changePassword}>
                {requiresOldPassword &&
                  <Input ref="old_password" name="old_password" id="old_password" type="password" maxLength={100}
                         labelClassName="col-sm-3" wrapperClassName="col-sm-9"
                         label="旧密码" required />
                }
                <Input ref="password" name="password" id="password" type="password" maxLength={100}
                       labelClassName="col-sm-3" wrapperClassName="col-sm-9"
                       label="新密码" required minLength="6"
                       help="密码长度不能少于6. 我们建议使用强密码."
                       onChange={this._onPasswordChange} />

                <Input ref="password_repeat" name="password_repeat" id="password_repeat" type="password" maxLength={100}
                       labelClassName="col-sm-3" wrapperClassName="col-sm-9"
                       label="重复密码" required minLength="6" onChange={this._onPasswordChange} />

                <div className="form-group">
                  <Col smOffset={3} sm={9}>
                    <Button bsStyle="success" type="submit">
                      更新密码
                    </Button>
                  </Col>
                </div>
              </form>
            }
          </Col>
        </Row>
        <IfPermitted permissions="USERS_ROLESEDIT">
          <EditRolesForm user={this.props.user} />
        </IfPermitted>
      </div>
    );
  },
});

export default UserForm;
