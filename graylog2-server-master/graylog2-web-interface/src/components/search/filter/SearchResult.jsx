import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Row } from 'react-bootstrap';

import { AddSearchCountToDashboard, LegacyHistogram, ResultTable, SearchSidebar, ShowQueryModal } from 'components/search/filter';

import DocumentationLink from 'components/support/DocumentationLink';

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');

import DocsHelper from 'util/DocsHelper';

import { PluginStore } from 'graylog-web-plugin/plugin';
import {} from 'components/field-analyzers'; // Make sure to load all field analyzer plugins!

const SearchResult = React.createClass({
  propTypes: {
    query: PropTypes.string,
    builtQuery: PropTypes.string,
    result: PropTypes.object.isRequired,
    histogram: PropTypes.object.isRequired,
    formattedHistogram: PropTypes.array,
    searchInStream: PropTypes.object,
    streams: PropTypes.instanceOf(Immutable.Map),
    inputs: PropTypes.instanceOf(Immutable.Map),
    nodes: PropTypes.instanceOf(Immutable.Map),
    permissions: PropTypes.array.isRequired,
    // searchConfig: PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      query: '*',
      builtQuery: '',
      formattedHistogram: [],
      searchInStream: null,
      streams: Immutable.Map({}),
      inputs: Immutable.Map({}),
      nodes: Immutable.Map({}),
    };
  },

  getInitialState() {
    const initialFields = SearchStore.fields;
    return {
      selectedFields: this.sortFields(initialFields),
      sortField: SearchStore.sortField,
      sortOrder: SearchStore.sortOrder,
      showAllFields: false,
      shouldHighlight: true,
    };
  },

  onFieldToggled(fieldName) {
    const currentFields = this.state.selectedFields;
    let newFieldSet;
    if (currentFields.contains(fieldName)) {
      newFieldSet = currentFields.delete(fieldName);
    } else {
      newFieldSet = currentFields.add(fieldName);
    }

    //点击选项 用于缓存默认字段
    try{
      var clickSet = newFieldSet._map._map._root.entries;
      var newArray = [];
      for(var i=0;i < clickSet.length;i++){
        newArray.push(clickSet[i][0]);
      }
      localStorage.setItem('onSelectField',newArray);
    }catch(e){

    }

    this.updateSelectedFields(newFieldSet);
  },

  togglePageFields() {
    this.setState({showAllFields: !this.state.showAllFields});
  },

  predefinedFieldSelection(setName) {
    if (setName === 'none') {
      this.updateSelectedFields(Immutable.Set());

      localStorage.setItem('onSelectField','');
    } else if (setName === 'all') {
      this.updateSelectedFields(Immutable.Set(this._fields().map(field => field.name)));

      var allArray = this._fields();
      var nArray = [];
      for(var i=0;i < allArray.length;i++){
          nArray.push(allArray[i].name);
      }
      localStorage.setItem('onSelectField',nArray);
    } else if (setName === 'default') {
      this.updateSelectedFields(Immutable.Set(['message', 'source']));

      localStorage.setItem('onSelectField',['message', 'source']);
    }
  },

  updateSelectedFields(fieldSelection) {
    const selectedFields = this.sortFields(fieldSelection);
    SearchStore.fields = selectedFields;
    this.setState({selectedFields: selectedFields});
  },
  _fields() {
    return this.props.result[this.state.showAllFields ? 'all_fields' : 'fields'];
  },

  sortFields(fieldSet) {
    let newFieldSet = fieldSet;
    let sortedFields = Immutable.OrderedSet();

    if (newFieldSet.contains('source')) {
      sortedFields = sortedFields.add('source');
    }
    newFieldSet = newFieldSet.delete('source');
    const remainingFieldsSorted = newFieldSet.sort((field1, field2) => field1.toLowerCase().localeCompare(field2.toLowerCase()));
    return sortedFields.concat(remainingFieldsSorted);
  },

  addFieldAnalyzer(ref, field) {
    this.refs[ref].addField(field);
  },
  _showQueryModal(event) {
    event.preventDefault();
    this.refs.showQueryModal.open();
  },

  _fieldAnalyzers(filter) {
    return PluginStore.exports('fieldAnalyzers')
      .filter(analyzer => filter !== undefined ? filter(analyzer) : true);
  },

  _fieldAnalyzerComponents(filter) {
    return this._fieldAnalyzers(filter)
      .map((analyzer, idx) => {
        return React.createElement(analyzer.component, {
          key: idx,
          ref: analyzer.refId,
          permissions: this.props.permissions,
          query: SearchStore.query,
          page: SearchStore.page,
          rangeType: SearchStore.rangeType,
          rangeParams: SearchStore.rangeParams.toJS(),
          stream: this.props.searchInStream,
          resolution: this.props.histogram.interval,
          from: this.props.histogram.histogram_boundaries.from,
          to: this.props.histogram.histogram_boundaries.to,
        });
      });
  },

  _shouldRenderAboveHistogram(analyzer) {
    return analyzer.displayPriority > 0;
  },
  _shouldRenderBelowHistogram(analyzer) {
    return analyzer.displayPriority <= 0;
  },

  render() {
    const anyHighlightRanges = Immutable.fromJS(this.props.result.messages).some(message => message.get('highlight_ranges') !== null);

    // short circuit if the result turned up empty
    if (this.props.result.total_results === 0) {
      let streamDescription = null;
      if (this.props.searchInStream) {
        streamDescription = <span>in stream <em>{this.props.searchInStream.title}</em></span>;
      }
      return (
        <div>
          <Row className="content content-head" style={{"border":"0px solid #D1D1D1"}}>
            <Col ref="opa" md={3} sm={12} id="sidebar" style={{"marginTop":"-15px"}}>
              <SearchSidebar result={this.props.result}
                             builtQuery={this.props.builtQuery}
                             selectedFields={this.state.selectedFields}
                             fields={this._fields()}
                             fieldAnalyzers={this._fieldAnalyzers()}
                             showAllFields={this.state.showAllFields}
                             togglePageFields={this.togglePageFields}
                             onFieldToggled={this.onFieldToggled}
                             onFieldAnalyzer={this.addFieldAnalyzer}
                             predefinedFieldSelection={this.predefinedFieldSelection}
                             showHighlightToggle={anyHighlightRanges}
                             shouldHighlight={this.state.shouldHighlight}
                             toggleShouldHighlight={() => this.setState({shouldHighlight: !this.state.shouldHighlight})}
                             currentSavedSearch={SearchStore.savedSearch}
                             searchInStream={this.props.searchInStream}
                             permissions={this.props.permissions}
              />
            </Col>
            <Col md={9} sm={12} style={{"border":"1px solid #D1D1D1","padding":"15px"}}>
              <h1>
                <span className="pull-right">
                  <AddSearchCountToDashboard searchInStream={this.props.searchInStream} permissions={this.props.permissions} pullRight/>
                </span>
                <span>什么都没找到 {streamDescription}</span>
              </h1>

              <p className="description">
                您的搜索没有返回结果.&nbsp;
                <a href="#" onClick={this._showQueryModal}>显示Elasticsearch查询.</a>
                <ShowQueryModal key="debugQuery" ref="showQueryModal" builtQuery={this.props.builtQuery}/>
              </p>
            </Col>
          </Row>

        </div>);
    }
    return (
      <Row id="main-content-search">
        <Col ref="opa" md={3} sm={12} id="sidebar">
          <SearchSidebar result={this.props.result}
                         builtQuery={this.props.builtQuery}
                         selectedFields={this.state.selectedFields}
                         fields={this._fields()}
                         fieldAnalyzers={this._fieldAnalyzers()}
                         showAllFields={this.state.showAllFields}
                         togglePageFields={this.togglePageFields}
                         onFieldToggled={this.onFieldToggled}
                         onFieldAnalyzer={this.addFieldAnalyzer}
                         predefinedFieldSelection={this.predefinedFieldSelection}
                         showHighlightToggle={anyHighlightRanges}
                         shouldHighlight={this.state.shouldHighlight}
                         toggleShouldHighlight={() => this.setState({shouldHighlight: !this.state.shouldHighlight})}
                         currentSavedSearch={SearchStore.savedSearch}
                         searchInStream={this.props.searchInStream}
                         permissions={this.props.permissions}
          />
        </Col>
        <Col md={9} sm={12} id="main-content-sidebar">
          {this._fieldAnalyzerComponents((analyzer) => this._shouldRenderAboveHistogram(analyzer))}

        {/**
          <LegacyHistogram formattedHistogram={this.props.formattedHistogram}
                           histogram={this.props.histogram}
                           permissions={this.props.permissions}
                           stream={this.props.searchInStream}/>*/}

          {this._fieldAnalyzerComponents((analyzer) => this._shouldRenderBelowHistogram(analyzer))}

          <ResultTable messages={this.props.result.messages}
                       page={SearchStore.page}
                       selectedFields={this.state.selectedFields}
                       sortField={this.state.sortField}
                       sortOrder={this.state.sortOrder}
                       resultCount={this.props.result.total_results}
                       inputs={this.props.inputs}
                       streams={this.props.streams}
                       nodes={this.props.nodes}
                       highlight={this.state.shouldHighlight}
                       searchConfig={this.props.searchConfig}
          />

        </Col>
      </Row>);
  },
});

export default SearchResult;
