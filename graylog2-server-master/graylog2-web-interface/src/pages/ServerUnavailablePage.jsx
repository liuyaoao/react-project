import React from 'react';
import { Modal, Well } from 'react-bootstrap';

import URLUtils from 'util/URLUtils';

import disconnectedStyle from '!style/useable!css!less!stylesheets/disconnected.less';

const ServerUnavailablePage = React.createClass({
  propTypes: {
    server: React.PropTypes.object,
  },

  getInitialState() {
    return {
      showDetails: false,
    };
  },

  componentDidMount() {
    disconnectedStyle.use();
  },

  componentWillUnmount() {
    disconnectedStyle.unuse();
  },

  _toggleDetails() {
    this.setState({showDetails: !this.state.showDetails});
  },

  _formatErrorMessage() {
    if (!this.state.showDetails) {
      return null;
    }

    const noInformationMessage = (
      <div>
        <hr/>
        <p>There is no information available.</p>
      </div>
    );

    if (!this.props.server || !this.props.server.error) {
      return noInformationMessage;
    }

    const error = this.props.server.error;

    const errorDetails = [];
    if (error.message) {
      errorDetails.push(<dt key="error-title">Error message</dt>, <dd key="error-desc">{error.message}</dd>);
    }
    if (error.originalError) {
      const originalError = error.originalError;
      errorDetails.push(
        <dt key="status-original-request-title">Original Request</dt>,
        <dd key="status-original-request-content">{String(originalError.method)} {String(originalError.url)}</dd>
      );
      errorDetails.push(
        <dt key="status-code-title">Status code</dt>,
        <dd key="status-code-desc">{String(originalError.status)}</dd>
      );

      if (typeof originalError.toString === 'function') {
        errorDetails.push(
          <dt key="full-error-title">Full error message</dt>,
          <dd key="full-error-desc">{originalError.toString()}</dd>
        );
      }
    }

    if (errorDetails.length === 0) {
      return noInformationMessage;
    }

    return (
      <div>
        <hr style={{marginTop: 10, marginBottom: 10}}/>
        <p>下面是从服务器接收到的响应:</p>
        <Well bsSize="small" style={{whiteSpace: 'pre-line'}}>
          <dl style={{marginBottom: 0}}>
            {errorDetails}
          </dl>
        </Well>
      </div>
    );
  },

  render() {
    return (
      <Modal show>
        <Modal.Header>
          <Modal.Title><i className="fa fa-exclamation-triangle"/> 目前服务不可用</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              运行在<i>{URLUtils.qualifyUrl('')}</i>的DeepLOG服务,连接遇到了问题.
              请确认服务是正常运行的.
            </p>
            <p>一旦我们能够连接到服务器,您将被自动重定向到前一页.</p>

            <div>
              <a href="#" onClick={this._toggleDetails}>
                {this.state.showDetails ? '收起' : '展开'}
              </a>
              {this._formatErrorMessage()}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  },
});

export default ServerUnavailablePage;
