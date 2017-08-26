import React from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

const MalformedSearchQuery = React.createClass({
  propTypes: {
    error: React.PropTypes.object.isRequired,
  },

  _isGenericError(error) {
    return error.begin_column === null
      || error.begin_line === null
      || error.end_column === null
      || error.end_line === null;
  },

  _highlightQueryError(error) {
    if (error.begin_line > 1 || error.begin_line !== error.end_line) {
      return error.query;
    }

    return (
      <span>
        {error.query.substring(0, error.begin_column)}
        <span className="parse-error">{error.query.substring(error.begin_column, error.end_column)}</span>
        {error.query.substring(error.end_column, error.query.length)}
      </span>
    );
  },

  _getFormattedErrorDescription(error) {
    return (
      <Panel bsStyle="danger">
        <dl style={{ marginBottom: 0 }}>
          <dt>错误信息:</dt>
          <dd>{error.message}</dd>
          <dt>异常:</dt>
          <dd><code>{error.exception_name}</code></dd>
        </dl>
      </Panel>
    );
  },

  render() {
    let explanation;
    if (this._isGenericError(this.props.error)) {
      explanation = (
        <div>
          <p>给定的查询是异常的，并且执行它会引起以下错误:</p>
          {this._getFormattedErrorDescription(this.props.error)}
        </div>
      );
    } else {
      explanation = (
        <div>
          <p>给定的查询在以下位置会报异常:</p>
          <pre>{this._highlightQueryError(this.props.error)}</pre>
          {this._getFormattedErrorDescription(this.props.error)}
        </div>
      );
    }

    return (
      <div>
        <Row className="content content-head">
          <Col md={12}>

            <h1>
              异常搜索查询
            </h1>

            <p className="description">
              搜索查询不能执行，请改正它，然后再试一次.{' '}
            </p>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            {explanation}
          </Col>
        </Row>
        
      </div>
    );
  },
});

export default MalformedSearchQuery;
