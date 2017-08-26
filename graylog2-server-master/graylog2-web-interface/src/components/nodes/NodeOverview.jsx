import React, {PropTypes} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Button } from 'react-bootstrap';

import BufferUsage from './BufferUsage';
import SystemOverviewDetails from './SystemOverviewDetails';
import JvmHeapUsage from './JvmHeapUsage';
import JournalDetails from './JournalDetails';
import SystemInformation from './SystemInformation';
import RestApiOverview from './RestApiOverview';
import PluginsDataTable from './PluginsDataTable';
import InputTypesDataTable from './InputTypesDataTable';

import Routes from 'routing/Routes';

const NodeOverview = React.createClass({
  propTypes: {
    node: PropTypes.object.isRequired,
    systemOverview: PropTypes.object.isRequired,
    jvmInformation: PropTypes.object,
    plugins: PropTypes.array,
    inputDescriptions: PropTypes.object,
    inputStates: PropTypes.array,
  },
  render() {
    const node = this.props.node;
    const systemOverview = this.props.systemOverview;

    let pluginCount;
    if (this.props.plugins) {
      pluginCount = `${this.props.plugins.length} 个插件已安装`;
    }

    let inputCount;
    if (this.props.inputStates) {
      const runningInputs = this.props.inputStates.filter(inputState => inputState.state.toUpperCase() === 'RUNNING');
      inputCount = `${runningInputs.length} 个输入值正在此节点运行`;
    }

    return (
      <div>
        <Row className="content">
          <Col md={12}>
            <SystemOverviewDetails node={node} information={systemOverview}/>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2 style={{marginBottom: 5}}>栈/堆占用量</h2>
            <JvmHeapUsage nodeId={node.node_id}/>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>Buffers</h2>
            <p className="description">
				缓存用来临时（毫秒级时间）存储少量的将被发送至不同处理器的消息。
            </p>
            <Row>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输入值缓存" bufferType="input"/>
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="进程缓存" bufferType="process"/>
              </Col>
              <Col md={4}>
                <BufferUsage nodeId={node.node_id} title="输出值缓存" bufferType="output"/>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>硬盘日志</h2>
            <p className="description">
				从外部进来的消息会被写入硬盘日志已确保他们在服务器出错的情况下也能被完整保存。日志同时也在输出速度过慢或输入消息速度达到峰值时帮助DeepLOG进行保证消息正常传输的工作。它确保了DeepLOG不会把所有的消息都缓存入主内存，并避免了过长的垃圾堆积处理的卡顿。
            </p>
            <JournalDetails nodeId={node.node_id}/>
          </Col>
        </Row>

        <Row className="content">
          <Col md={6}>
            <h2>系统</h2>
            <SystemInformation node={node} systemInformation={systemOverview} jvmInformation={this.props.jvmInformation}/>
          </Col>
          <Col md={6}>
            <h2>REST API</h2>
            <RestApiOverview node={node}/>
          </Col>
        </Row>


        <Row className="content">
          <Col md={12}>
            <span className="pull-right">
              <LinkContainer to={Routes.node_inputs(node.node_id)}>
                <Button bsStyle="success" bsSize="small">管理输入值</Button>
              </LinkContainer>
            </span>
            <h2 style={{marginBottom: 15}}>有效的输入值类型 <small>{inputCount}</small></h2>
            <InputTypesDataTable inputDescriptions={this.props.inputDescriptions}/>
          </Col>
        </Row>
      </div>
    );
  },
});

export default NodeOverview;
