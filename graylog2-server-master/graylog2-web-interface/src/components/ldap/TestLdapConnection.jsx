import React, {PropTypes} from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import ActionsProvider from 'injection/ActionsProvider';
const LdapActions = ActionsProvider.getActions('Ldap');

const TestLdapConnection = React.createClass({
  propTypes: {
    ldapSettings: PropTypes.object.isRequired,
    ldapUri: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    return {
      serverConnectionStatus: {},
    };
  },

  componentWillReceiveProps(nextProps) {
    // Reset connection status if ldapSettings changed
    if (JSON.stringify(this.props.ldapSettings) !== JSON.stringify(nextProps.ldapSettings)) {
      this.setState({serverConnectionStatus: {}});
    }
  },

  _testServerConnection() {
    LdapActions.testServerConnection.triggerPromise(this.props.ldapSettings)
      .then(
        result => {
          if (result.connected) {
            this.setState({serverConnectionStatus: {loading: false, success: true}});
          } else {
            this.setState({serverConnectionStatus: {loading: false, error: result.exception}});
          }
        },
        () => {
          this.setState({
            serverConnectionStatus: {
              loading: false,
              error: '无法检查连接，请再试一次。',
            },
          });
        }
      );

    this.setState({serverConnectionStatus: {loading: true}});
  },

  _getServerConnectionStyle() {
    if (this.state.serverConnectionStatus.success) {
      return 'success';
    }
    if (this.state.serverConnectionStatus.error) {
      return 'danger';
    }

    return 'info';
  },

  render() {
    const serverConnectionStatus = this.state.serverConnectionStatus;
    const isDisabled = this.props.disabled || this.props.ldapUri.hostname() === '' || serverConnectionStatus.loading;

    let serverConnectionResult;
    if (serverConnectionStatus.error) {
      serverConnectionResult = <Alert bsStyle="danger">{serverConnectionStatus.error}</Alert>;
    }
    if (serverConnectionStatus.success) {
      serverConnectionResult = <Alert bsStyle="success">连接服务器成功</Alert>;
    }

    return (
      <div className="form-group">
        <Row>
          <Col sm={9} smOffset={3}>
            <Button id="ldap-test-connection" bsStyle={this._getServerConnectionStyle()}
                    disabled={isDisabled}
                    onClick={this._testServerConnection}>
              {serverConnectionStatus.loading ? '测试中...' : '测试服务器连接'}
            </Button>
            <span
              className="help-block">根据上述地址和证书执行后台连接检查。</span>
            {serverConnectionResult}
          </Col>
        </Row>
      </div>
    );
  },
});

export default TestLdapConnection;
