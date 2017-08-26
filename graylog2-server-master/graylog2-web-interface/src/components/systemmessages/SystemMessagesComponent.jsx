import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const SystemMessagesStore = StoreProvider.getStore('SystemMessages');

import { Spinner } from 'components/common';
import { SystemMessagesList } from 'components/systemmessages';

const SystemMessagesComponent = React.createClass({
  getInitialState() {
    return {currentPage: 1};
  },
  componentDidMount() {
    this.loadMessages(this.state.currentPage);
    this.interval = setInterval(() => { this.loadMessages(this.state.currentPage); }, 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  PER_PAGE: 30,
  loadMessages(page) {
    SystemMessagesStore.all(page).then((response) => {
      this.setState(response);
    });
  },
  _onSelected(event, selectedEvent) {
    const page = selectedEvent.eventKey;

    this.setState({currentPage: page});
    this.loadMessages(page);
  },
  render() {
    if (!this.state.total) {
      return <Spinner />;
    }

    const numberPages = Math.ceil(this.state.total / this.PER_PAGE);
    const paginatorSize = 10;

    return (
      <Row className="content">
        <Col md={12}>
          <h2><i className="fa fa-comments-o"/> 系统通知</h2>

          <p className="description">
			系统通知是由DeepLOG服务器节点生成的可能对DeepLOG管理员有用的信息。您在此处不需要对通知做任何操作因为这些通知会在相应的事件发生时出现。
          </p>

          <SystemMessagesList messages={this.state.messages}/>


          <nav style={{textAlign: 'center'}}>
            <Pagination bsSize="small" items={numberPages}
                        activePage={this.state.currentPage}
                        onSelect={this._onSelected}
                        prev next first last
                        maxButtons={Math.min(paginatorSize, numberPages)}/>
          </nav>
        </Col>
      </Row>
    );
  },
});

export default SystemMessagesComponent;
