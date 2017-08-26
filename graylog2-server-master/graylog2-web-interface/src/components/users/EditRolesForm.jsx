import React from 'react';
import { Alert, Col, Button, Input, Row } from 'react-bootstrap';

import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const RolesStore = StoreProvider.getStore('Roles');
const UsersStore = StoreProvider.getStore('Users');

import RolesSelect from 'components/users/RolesSelect';
import { Spinner } from 'components/common';

const EditRolesForm = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentDidMount() {
    RolesStore.loadRoles().then(roles => {
      this.setState({ roles: roles.sort((r1, r2) => r1.name.localeCompare(r2.name)) });
    });
  },
  _updateRoles(evt) {
    evt.preventDefault();
    if (confirm(`确定要更新角色 "${this.props.user.username}" 吗？`)) {
      const roles = this.refs.roles.getValue().filter((value) => value !== '');
      UsersStore.updateRoles(this.props.user.username, roles).then(() => {
        UserNotification.success('角色更新成功。', '成功！');
      }, () => {
        UserNotification.error('角色更新失败。', '错误！');
      });
    }
  },
  render() {
    const user = this.props.user;
    if (!this.state.roles) {
      return <Spinner />;
    }
    const externalUser = user.external ?
      (
        <Col smOffset={3} sm={9} style={{ marginBottom: 15 }}>
          <Alert bsStyle="warning" role="alert">
            该用户是由外部LDAP系统创建, 请考虑映射LDAP组以代替在此手动编辑角色。
            请更新LDAP组映射进行更改或者联系管理员获取更多信息。
          </Alert>
        </Col>
      ) : null;
    const editUserForm = user.read_only ? (
      <Col smOffset={3} sm={9}>
        <Alert bsStyle="warning" role="alert">
          您无法编辑admin的用户角色。
        </Alert>
      </Col>
    ) : (
      <span>
        {externalUser}
        <form className="form-horizontal" style={{ marginTop: '10px' }} onSubmit={this._updateRoles}>
          <Input label="角色" help="选择该用户应该成为其一员的角色。所有授予的权限将被合并。"
                 labelClassName="col-sm-3" wrapperClassName="col-sm-9">
            <RolesSelect ref="roles" userRoles={user.roles} availableRoles={this.state.roles} />
          </Input>
          <div className="form-group">
            <Col smOffset={3} sm={9}>
              <Button bsStyle="success" type="submit">
                更新角色
              </Button>
            </Col>
          </div>
        </form>
      </span>
    );
    return (
      <Row className="content">
        <Col md={8}>
          <h2>更改用户角色</h2>
          {editUserForm}
        </Col>
      </Row>
    );
  },
});

export default EditRolesForm;
