import React from 'react';
import ReactDOM from 'react-dom';
import { Button, DropdownButton, Input, MenuItem, Modal } from 'react-bootstrap';
import {AutoAffix} from 'react-overlays';
import numeral from 'numeral';
import URI from 'urijs';

import StoreProvider from 'injection/StoreProvider';
const SessionStore = StoreProvider.getStore('Session');
const SearchStore = StoreProvider.getStore('Search');

import { AddSearchCountToDashboard, SavedSearchControls, ShowQueryModal } from 'components/search/filter';
import BootstrapModalWrapper from 'components/bootstrap/BootstrapModalWrapper';
import SidebarMessageField from './SidebarMessageField';

import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';

import EventHandlersThrottler from 'util/EventHandlersThrottler';

const SearchSidebar = React.createClass({
  propTypes: {
    builtQuery: React.PropTypes.any,
    currentSavedSearch: React.PropTypes.string,
    fields: React.PropTypes.array,
    fieldAnalyzers: React.PropTypes.array,
    onFieldAnalyzer: React.PropTypes.func,
    onFieldToggled: React.PropTypes.func,
    permissions: React.PropTypes.array,
    predefinedFieldSelection: React.PropTypes.func,
    result: React.PropTypes.object,
    searchInStream: React.PropTypes.object,
    selectedFields: React.PropTypes.object,
    shouldHighlight: React.PropTypes.bool,
    showAllFields: React.PropTypes.bool,
    showHighlightToggle: React.PropTypes.bool,
    togglePageFields: React.PropTypes.func,
    toggleShouldHighlight: React.PropTypes.func,
  },
  getInitialState() {
    return {
      fieldFilter: '',
      maxFieldsHeight: 1000,
    };
  },

  componentDidMount() {
    this._updateHeight();
    window.addEventListener('resize', this._resizeCallback);
    window.addEventListener('scroll', this._updateHeight);
  },
  componentWillReceiveProps(newProps) {
    // update max-height of fields when we toggle per page/all fields
    if (this.props.showAllFields !== newProps.showAllFields) {
      this._updateHeight();
    }
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeCallback);
    window.removeEventListener('scroll', this._updateHeight);
  },

  eventsThrottler: new EventHandlersThrottler(),

  _resizeCallback() {
    this.eventsThrottler.throttle(() => this._updateHeight());
  },

  _updateHeight() {
    const header = ReactDOM.findDOMNode(this.refs.header);

    const footer = ReactDOM.findDOMNode(this.refs.footer);

    const sidebar = ReactDOM.findDOMNode(this.refs.sidebar);
    const sidebarTop = sidebar.getBoundingClientRect().top;
    const sidebarCss = window.getComputedStyle(ReactDOM.findDOMNode(this.refs.sidebar));
    const sidebarPaddingTop = parseFloat(sidebarCss.getPropertyValue('padding-top'));
    const sidebarPaddingBottom = parseFloat(sidebarCss.getPropertyValue('padding-bottom'));

    const viewPortHeight = window.innerHeight;
    const maxHeight =
      viewPortHeight -
      header.clientHeight - footer.clientHeight -
      sidebarTop - sidebarPaddingTop - sidebarPaddingBottom -
      35; // for good measure™

    this.setState({maxFieldsHeight: maxHeight});
  },

  _updateFieldSelection(setName) {
    this.props.predefinedFieldSelection(setName);
  },
  _showAllFields(event) {
    event.preventDefault();
    if (!this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },
  _showPageFields(event) {
    event.preventDefault();
    if (this.props.showAllFields) {
      this.props.togglePageFields();
    }
  },
  _showIndicesModal(event) {
    event.preventDefault();
    this.refs.indicesModal.open();
  },
  _getURLForExportAsCSV() {
    const searchParams = SearchStore.getOriginalSearchURLParams();
    const streamId = this.props.searchInStream ? this.props.searchInStream.id : undefined;
    const query = searchParams.get('q') === '' ? '*' : searchParams.get('q');
    const fields = this.props.selectedFields;
    const timeRange = SearchStore.rangeType === 'relative' ? {range: SearchStore.rangeParams.get('relative')} : SearchStore.rangeParams.toJS();

    const url = new URI(URLUtils.qualifyUrl(
      ApiRoutes.UniversalSearchApiController.export(SearchStore.rangeType, query, timeRange, streamId, 0, 0, fields.toJS()).url
    ))
      .username(SessionStore.getSessionId())
      .password('session');

    return url.toString();
  },
  render() {
    const indicesModal = (
      <BootstrapModalWrapper ref="indicesModal">
        <Modal.Header closeButton>
          <Modal.Title>使用的索引</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>DeepLOG是智能选择索引需要基于你选择的时间帧搜索.
            此列表的索引主要用于调试目的.</p>
          <h4>用于此搜索的索引:</h4>

          <ul className="index-list">
            {this.props.result.used_indices.map((index) => <li key={index.index_name}> {index.index_name}</li>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.refs.indicesModal.close()}>关闭</Button>
        </Modal.Footer>
      </BootstrapModalWrapper>
    );

    const messageFields = this.props.fields
      .filter((field) => field.name.indexOf(this.state.fieldFilter) !== -1)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((field) => {
        return (
          <SidebarMessageField key={field.name}
                               field={field}
                               fieldAnalyzers={this.props.fieldAnalyzers}
                               onToggled={this.props.onFieldToggled}
                               onFieldAnalyzer={this.props.onFieldAnalyzer}
                               selected={this.props.selectedFields.contains(field.name)}/>
        );
      });
    let searchTitle = null;
    const moreActions = [
      <MenuItem key="export" href={this._getURLForExportAsCSV()}>导出为CSV</MenuItem>,
    ];
    if (this.props.searchInStream) {
      searchTitle = <span>{this.props.searchInStream.title}</span>;
      // TODO: add stream actions to dropdown
    } else {
      searchTitle = <span>搜索结果</span>;
    }

    // always add the debug query link as last elem
    moreActions.push(<MenuItem divider key="div2"/>);
    moreActions.push(<MenuItem key="showQuery" onSelect={() => this.refs.showQueryModal.open()}>显示查询语句</MenuItem>);

    return (
      <AutoAffix affixClassName="affix">
        <div className="content-col" ref="sidebar" style={{ top: undefined, position: undefined }}>
          <div ref="header">
            <h2>
              {searchTitle}
            </h2>

            <p style={{marginTop: 3}}>
              用时 {numeral(this.props.result.time).format('0,0')} 毫秒完成搜索 &nbsp;
              <a href="#" onClick={this._showIndicesModal}>
                {this.props.result.used_indices.length}&nbsp;个{this.props.result.used_indices.length === 1 ? '索引' : '索引'}
              </a>, 找到 <strong>{numeral(this.props.result.total_results).format('0,0')} 条信息</strong>&nbsp;.
              {indicesModal}
            </p>

            <div className="actions">
              <AddSearchCountToDashboard searchInStream={this.props.searchInStream} permissions={this.props.permissions}/>

              <SavedSearchControls currentSavedSearch={this.props.currentSavedSearch}/>

              <div style={{display: 'inline-block'}}>
                <DropdownButton bsSize="small" title="更多操作" id="search-more-actions-dropdown">
                  {moreActions}
                </DropdownButton>
                <ShowQueryModal key="debugQuery" ref="showQueryModal" builtQuery={this.props.builtQuery}/>
              </div>
            </div>

            <hr />

            <h3>字段</h3>

            <div className="input-group input-group-sm" style={{marginTop: 5, marginBottom: 5}}>
              <span className="input-group-btn">
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('default')}>默认
                  </button>
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('all')}>所有
                  </button>
                  <button type="button" className="btn btn-default"
                          onClick={() => this._updateFieldSelection('none')}>无
                  </button>
              </span>
              <input type="text" className="form-control" placeholder="过滤字段"
                     onChange={(event) => this.setState({fieldFilter: event.target.value})}
                     value={this.state.fieldFilter}/>
            </div>
          </div>
          <div ref="fields" style={{maxHeight: this.state.maxFieldsHeight, overflowY: 'scroll'}}>
            <ul className="search-result-fields">
              {messageFields}
            </ul>
          </div>
          <div ref="footer">
            <div style={{marginTop: 13, marginBottom: 0}}>
              列出 <span className="message-result-fields-range">
              <a href="#" style={{fontWeight: this.props.showAllFields ? 'normal' : 'bold'}}
                 onClick={this._showPageFields}>当前页面</a> 的字段或 <a href="#"
                                                                       style={{fontWeight: this.props.showAllFields ? 'bold' : 'normal'}}
                                                                       onClick={this._showAllFields}>所有字段
                </a>.
                    </span>
              <br/>
              { this.props.showHighlightToggle &&
              <Input type="checkbox" bsSize="small" checked={this.props.shouldHighlight}
                     onChange={this.props.toggleShouldHighlight} label="Highlight results"
                     groupClassName="result-highlight-control"/>
                }
            </div>
          </div>
        </div>
      </AutoAffix>
    );
  },
});

export default SearchSidebar;
