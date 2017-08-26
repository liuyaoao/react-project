import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const GrokPatternsStore = StoreProvider.getStore('GrokPatterns');

import PageHeader from 'components/common/PageHeader';
import EditPatternModal from 'components/grok-patterns/EditPatternModal';
import BulkLoadPatternModal from 'components/grok-patterns/BulkLoadPatternModal';
import DataTable from 'components/common/DataTable';

const GrokPatterns = React.createClass({
  getInitialState() {
    return {
      patterns: [],
    };
  },
  componentDidMount() {
    this.loadData();
  },
  loadData() {
    GrokPatternsStore.loadPatterns((patterns) => {
      if (this.isMounted()) {
        this.setState({
          patterns: patterns,
        });
      }
    });
  },
  validPatternName(name) {
    // Check if patterns already contain a pattern with the given name.
    return !this.state.patterns.some((pattern) => pattern.name === name);
  },
  savePattern(pattern, callback) {
    GrokPatternsStore.savePattern(pattern, () => {
      callback();
      this.loadData();
    });
  },
  confirmedRemove(pattern) {
    if (window.confirm('确定删除grok表达式 ' + pattern.name + '？\n它将从系统中删除并且不能被任何提取器使用，仍在使用该表达式的提取器将无法工作。')) {
      GrokPatternsStore.deletePattern(pattern, this.loadData);
    }
  },
  _headerCellFormatter(header) {
    let formattedHeaderCell;

    switch (header.toLocaleLowerCase()) {
    case '名称':
      formattedHeaderCell = <th className="name">{header}</th>;
      break;
    case '动作':
      formattedHeaderCell = <th className="actions">{header}</th>;
      break;
    default:
      formattedHeaderCell = <th>{header}</th>;
    }

    return formattedHeaderCell;
  },
  _patternFormatter(pattern) {
    return (
      <tr key={pattern.id}>
        <td>{pattern.name}</td>
        <td>{pattern.pattern}</td>
        <td>
          <Button className="btn-del" style={{marginRight: 5}} bsStyle="primary" bsSize="xs"
                  onClick={this.confirmedRemove.bind(this, pattern)}>
            删除
          </Button>
          <EditPatternModal id={pattern.id} name={pattern.name} pattern={pattern.pattern} create={false}
                            reload={this.loadData} savePattern={this.savePattern}
                            validPatternName={this.validPatternName}/>
        </td>
      </tr>
    );
  },
  render() {
    const headers = ['名称', '表达式', '动作'];
    const filterKeys = ['name'];
    return (
      <div>
        <PageHeader title="Grok匹配表达式">
          <span>
            Grok是通过匹配模式(pattern)提取消息中的有价值的信息。你可以在DeepLOG的Grok信息提取器中使用的Grok表达式的列表,也可以手动添加一个表达式或者从表达式文件中导入一个完整的表达式列表。参考<a href="https://www.elastic.co/guide/en/logstash/current/plugins-filters-grok.html">Grok匹配表达式文档</a>。
          </span>
          {null}
          <span>
            <BulkLoadPatternModal onSuccess={this.loadData}/>
            <EditPatternModal id={""} name={""} pattern={""} create
                              reload={this.loadData}
                              savePattern={this.savePattern}
                              validPatternName={this.validPatternName}/>
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <DataTable id="grok-pattern-list"
                       className="table-striped table-hover"
                       headers={headers}
                       headerCellFormatter={this._headerCellFormatter}
                       sortByKey={"name"}
                       rows={this.state.patterns}
                       dataRowFormatter={this._patternFormatter}
                       filterLabel="过滤表达式"
                       filterKeys={filterKeys}/>
          </Col>
        </Row>
      </div>
    );
  },
});

export default GrokPatterns;
