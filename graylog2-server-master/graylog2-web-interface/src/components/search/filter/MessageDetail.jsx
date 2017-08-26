import React, { PropTypes } from 'react';
import { ButtonGroup, Button, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import Immutable from 'immutable';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');

import StreamLink from 'components/streams/StreamLink';
import MessageFields from 'components/search/MessageFields';
import { Spinner, ClipboardButton, Timestamp } from 'components/common';
import SurroundingSearchButton from 'components/search/SurroundingSearchButton';

import ApiRoutes from 'routing/ApiRoutes';
import Routes from 'routing/Routes';

const MessageDetail = React.createClass({
  propTypes: {
    allStreams: PropTypes.object,
    allStreamsLoaded: PropTypes.bool,
    disableTestAgainstStream: PropTypes.bool,
    disableSurroundingSearch: PropTypes.bool,
    expandAllRenderAsync: PropTypes.bool,
    showTimestamp: PropTypes.bool,
    disableFieldActions: PropTypes.bool,
    possiblyHighlight: PropTypes.func,
    inputs: PropTypes.object,
    nodes: PropTypes.object,
    message: PropTypes.object,
    streams: PropTypes.object,
    customFieldActions: PropTypes.node,
    searchConfig: PropTypes.object,
  },

  getInitialState() {
    return {
      allStreamsLoaded: false,
      allStreams: Immutable.List(),
    };
  },
  componentDidMount() {
    if (this.props.allStreams === undefined) {
      // our parent does not provide allStreams for the test against stream menu, we have to load it ourselves
      // this can happen if the component is used outside the regular search result
      // only load the streams per page
      if (this.state.allStreamsLoaded || this.props.disableTestAgainstStream) {
        return;
      }
      const promise = StreamsStore.listStreams();
      promise.done((streams) => this._onStreamsLoaded(streams));
    }
  },
  _onStreamsLoaded(streams) {
    this.setState({ allStreamsLoaded: true, allStreams: Immutable.List(streams).sortBy(stream => stream.title) });
  },

  _inputName(inputId) {
    const input = this.props.inputs.get(inputId);
    return input ? <span style={{ wordBreak: 'break-word' }}>{input.title}</span> : 'deleted input';
  },
  _nodeName(nodeId) {
    const node = this.props.nodes.get(nodeId);
    let nodeInformation;

    if (node) {
      const nodeURL = ApiRoutes.NodesController.node(nodeId).url;
      nodeInformation = (
        <a href={nodeURL}>
          <i className="fa fa-code-fork" />
          &nbsp;
          <span style={{ wordBreak: 'break-word' }}>{node.short_node_id}</span>&nbsp;/&nbsp;<span
          style={{ wordBreak: 'break-word' }}>{node.hostname}</span>
        </a>
      );
    } else {
      nodeInformation = <span style={{ wordBreak: 'break-word' }}>stopped node</span>;
    }
    return nodeInformation;
  },

  _getAllStreams() {
    if (this.props.allStreams) {
      return this.props.allStreams;
    } else {
      return this.state.allStreams;
    }
  },

  render() {
    // Short circuit when all messages are being expanded at the same time
    if (this.props.expandAllRenderAsync) {
      return (
        <Row>
          <Col md={12}>
            <Spinner />
          </Col>
        </Row>
      );
    }

    const messageUrl = ApiRoutes.SearchController.showMessage(this.props.message.index, this.props.message.id).url;

    let streamList = null;
    this._getAllStreams().forEach((stream) => {
      if (!streamList) {
        streamList = [];
      }
      streamList.push(
        <LinkContainer key={stream.id}
                       to={Routes.stream_edit_example(stream.id, this.props.message.index, this.props.message.id)}>
          <MenuItem>{stream.title}</MenuItem>
        </LinkContainer>
      );
    });

    const streamIds = Immutable.Set(this.props.message.stream_ids);
    const streams = streamIds.map((id) => {
      const stream = this.props.streams.get(id);
      if (stream !== undefined) {
        return <li key={stream.id}><StreamLink stream={stream} /></li>;
      }
      return null;
    });

    // Legacy
    let viaRadio = this.props.message.source_radio_id;
    if (viaRadio) {
      viaRadio = (
        <span>
          via <em>{this._inputName(this.props.message.source_radio_input_id)}</em> on
          radio {this._nodeName(this.props.message.source_radio_id)}
        </span>
      );
    }

    let timestamp = null;
    if (this.props.showTimestamp) {
      timestamp = [];
      const rawTimestamp = this.props.message.fields.timestamp;

      timestamp.push(<dt key={`dt-${rawTimestamp}`}>时间戳</dt>);
      timestamp.push(<dd key={`dd-${rawTimestamp}`}><Timestamp dateTime={rawTimestamp} /></dd>);
    }

    let receivedBy;
    if (this.props.message.source_input_id && this.props.message.source_node_id && this.props.nodes) {
      receivedBy = (
        <div>
          <dt>接收于</dt>
          <dd>
            <em>{this._inputName(this.props.message.source_input_id)}</em>{' '}
            上 {this._nodeName(this.props.message.source_node_id)}
            { viaRadio && <br /> }
            {viaRadio}
          </dd>
        </div>
      );
    } else {
      receivedBy = null;
    }

    const testAgainstStream = (this.props.disableTestAgainstStream ? null :
      <DropdownButton ref="streamDropdown" pullRight bsSize="small" title="反消息流测试"
                      id="select-stream-dropdown">
        { streamList }
        { (!streamList && !this.props.allStreamsLoaded) && <MenuItem header><i className="fa fa-spin fa-spinner" />
          加载消息流</MenuItem> }
        { (!streamList && this.props.allStreamsLoaded) && <MenuItem header>没有存在的消息流</MenuItem> }
      </DropdownButton>);

    let surroundingSearchButton;
    if (!this.props.disableSurroundingSearch) {
      surroundingSearchButton = (
        <SurroundingSearchButton id={this.props.message.id}
                                 timestamp={this.props.message.timestamp}
                                 searchConfig={this.props.searchConfig}
                                 messageFields={this.props.message.fields} />
      );
    }

    return (<div>

      <Row className="row-sm">
        <Col md={12} className="message-tab">
          <ButtonGroup className="pull-right" bsSize="small">
            <Button href={messageUrl}>固定链接</Button>

            <ClipboardButton title="复制ID" text={this.props.message.id} />
            {surroundingSearchButton}
            {testAgainstStream}
          </ButtonGroup>
          <h3>
            <i className="fa fa-envelope" />
            &nbsp;
            <LinkContainer to={Routes.message_show(this.props.message.index, this.props.message.id)}>
              <a href="#" style={{ color: '#000' }}>{this.props.message.id}</a>
            </LinkContainer>
          </h3>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <dl className="message-details">
            {timestamp}
            {receivedBy}

            <dt>存储在索引</dt>
            <dd>{this.props.message.index}</dd>

            { streamIds.size > 0 && <dt>进入消息流</dt> }
            { streamIds.size > 0 &&
            <dd className="stream-list">
              <ul>
                {streams}
              </ul>
            </dd>
            }
          </dl>
        </Col>
        <Col md={9}>
          <div ref="messageList">
            <MessageFields message={this.props.message} possiblyHighlight={this.props.possiblyHighlight}
                           disableFieldActions={this.props.disableFieldActions}
                           customFieldActions={this.props.customFieldActions} />
          </div>
        </Col>
      </Row>
    </div>);
  },
});

export default MessageDetail;
