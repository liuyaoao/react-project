import React, {PropTypes} from 'react';
import {Row, Col, Input, Button} from 'react-bootstrap';

import ActionsProvider from 'injection/ActionsProvider';
const ExtractorsActions = ActionsProvider.getActions('Extractors');

import UserNotification from 'util/UserNotification';

const ImportExtractors = React.createClass({
  propTypes: {
    input: PropTypes.object.isRequired,
  },
  _onSubmit(event) {
    event.preventDefault();
    try {
      const parsedExtractors = JSON.parse(this.refs.extractorsInput.getValue());
      const extractors = parsedExtractors.extractors;
      ExtractorsActions.import(this.props.input.id, extractors);
    } catch (error) {
      UserNotification.error('转义提取器出错。请确定是JSON格式？' + error,
        '无法导入提取器');
    }
  },
  render() {
    return (
      <Row className="content">
        <Col md={12}>
          <Row>
            <Col md={12}>
              <h2>提取器JSON</h2>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <form onSubmit={this._onSubmit}>
                <Input type="textarea" ref="extractorsInput" id="extractor-export-textarea" rows={30}/>
                <Button type="submit" bsStyle="success">为输入值添加提取器</Button>
              </form>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  },
});

export default ImportExtractors;
