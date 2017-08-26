import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { Input, Button, ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { ChosenSelectInput, DatePicker } from 'components/common';
import { RefreshControls, QueryInput } from 'components/search/filter';
import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');
const ToolsStore = StoreProvider.getStore('Tools');

import ActionsProvider from 'injection/ActionsProvider';
const SavedSearchesActions = ActionsProvider.getActions('SavedSearches');

import UIUtils from 'util/UIUtils';

import DateTime from 'logic/datetimes/DateTime';
import moment from 'moment';

import ConditionSearch from './ConditionSearch';
import AppConfig from 'util/AppConfig';
const SearchBar = React.createClass({
  propTypes: {
    userPreferences: React.PropTypes.object,
    savedSearches: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    config: React.PropTypes.object,
    displayRefreshControls: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      displayRefreshControls: true,
    };
  },

  getInitialState() {
    this.initialSearchParams = SearchStore.getParams();
    return {
      rangeType: this.initialSearchParams.rangeType,
      rangeParams: this.initialSearchParams.rangeParams,
      query: this.initialSearchParams.query,
      savedSearch: SearchStore.savedSearch,
      keywordPreview: Immutable.Map(),
    };
  },
  componentDidMount() {
    SearchStore.onParamsChanged = (newParams) => this.setState(newParams);
    SearchStore.onSubmitSearch = () => {
      this._prepareSearch();
      ReactDOM.findDOMNode(this.refs.searchForm).submit();
    };
    SearchStore.onAddQueryTerm = this._animateQueryChange;
    this._initializeSearchQueryInput();
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
    //hover时 chosen-container显示
    var hoverTimeout;
    $('.chosen-container').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('chosen-container-active chosen-with-drop');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('chosen-container-active chosen-with-drop');
        }, 50);
    });
    this._initSearchTableData();
  },
  componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this._updateSearchQueryInput(this.state.query);
    }
  },
  componentWillUnmount() {
    this._removeSearchQueryInput();
  },
  reload() {
    this.setState(this.getInitialState());
  },
  _initializeSearchQueryInput() {
    if (this.props.userPreferences.enableSmartSearch) {
      this.queryInput = new QueryInput(this.refs.query.getInputDOMNode());
      this.queryInput.display();
      // We need to update on changes made on typeahead
      const queryDOMElement = ReactDOM.findDOMNode(this.refs.query);
      $(queryDOMElement).on('typeahead:change', (event) => {
        SearchStore.query = event.target.value;
      });
    }
  },
  _updateSearchQueryInput(value) {
    if (this.props.userPreferences.enableSmartSearch) {
      this.queryInput.update(value);
    }
  },
  _removeSearchQueryInput() {
    if (this.props.userPreferences.enableSmartSearch) {
      const queryDOMElement = ReactDOM.findDOMNode(this.refs.query);
      $(queryDOMElement).off('typeahead:change');
    }
  },
  _animateQueryChange() {
    UIUtils.scrollToHint(ReactDOM.findDOMNode(this.refs.universalSearch));
    $(ReactDOM.findDOMNode(this.refs.query)).effect('bounce');
  },
  _queryChanged() {
    SearchStore.query = this.refs.query.getValue();
  },
  _rangeTypeChanged(event, newRangeType) {
    SearchStore.rangeType = newRangeType;
  },
  _rangeParamsChanged(key) {
    return () => {
      let refInput;

      /* eslint-disable no-case-declarations */
      switch (key) {
        case 'from':
        case 'to':
          const ref = `${key}Formatted`;
          refInput = this.refs[ref];
          if (!this._isValidDateString(refInput.getValue())) {
            refInput.getInputDOMNode().setCustomValidity('Invalid date time provided');
          } else {
            refInput.getInputDOMNode().setCustomValidity('');
          }
          break;
        default:
          refInput = this.refs[key];
      }
      /* eslint-enable no-case-declarations */
      SearchStore.rangeParams = this.state.rangeParams.set(key, refInput.getValue());
    };
  },
  _keywordSearchChanged() {
    this._rangeParamsChanged('keyword')();
    const value = this.refs.keyword.getValue();

    if (value === '') {
      this._resetKeywordPreview();
    } else {
      ToolsStore.testNaturalDate(value)
        .then((data) => this._onKeywordPreviewLoaded(data))
        .catch(() => this._resetKeywordPreview());
    }
  },
  _resetKeywordPreview() {
    this.setState({ keywordPreview: Immutable.Map() });
  },
  _onKeywordPreviewLoaded(data) {
    const from = DateTime.fromUTCDateTime(data.from).toString();
    const to = DateTime.fromUTCDateTime(data.to).toString();
    this.setState({ keywordPreview: Immutable.Map({ from: from, to: to }) });
  },
  _formattedDateStringInUserTZ(field) {
    const dateString = this.state.rangeParams.get(field);

    if (dateString === null || dateString === undefined || dateString === '') {
      return dateString;
    }

    // We only format the original dateTime, as datepicker will format the date in another way, and we
    // don't want to annoy users trying to guess what they are typing.
    if (this.initialSearchParams.rangeParams.get(field) === dateString) {
      return DateTime.parseFromString(dateString).toString();
    }

    return dateString;
  },
  _setDateTimeToNow(field) {
    return () => {
      const inputNode = this.refs[`${field}Formatted`].getInputDOMNode();
      inputNode.value = new DateTime().toString(DateTime.Formats.DATETIME);
      this._rangeParamsChanged(field)();
    };
  },
  _isValidDateField(field) {
    return this._isValidDateString(this._formattedDateStringInUserTZ(field));
  },
  _isValidDateString(dateString) {
    try {
      if (dateString !== undefined) {
        DateTime.parseFromString(dateString);
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  _prepareSearch() {
    // Convert from and to values to UTC
    if (this.state.rangeType === 'absolute') {
      const fromInput = this.refs.fromFormatted.getValue();
      const toInput = this.refs.toFormatted.getValue();

      this.refs.from.getInputDOMNode().value = DateTime.parseFromString(fromInput).toISOString();
      this.refs.to.getInputDOMNode().value = DateTime.parseFromString(toInput).toISOString();
    }

    this.refs.fields.getInputDOMNode().value = SearchStore.fields.join(',');
    this.refs.width.getInputDOMNode().value = SearchStore.width;
    this.refs.highlightMessage.getInputDOMNode().value = SearchStore.highlightMessage;
  },
  _savedSearchSelected() {
    window.isFilterSearch = true;
    const selectedSavedSearch = this.refs.savedSearchesSelector.getValue();
    const streamId = SearchStore.searchInStream ? SearchStore.searchInStream.id : undefined;
    SavedSearchesActions.execute.triggerPromise(selectedSavedSearch, streamId, $(window).width());
  },

  _onDateSelected(field) {
    return (event, date) => {
      const inputField = this.refs[`${field}Formatted`].getInputDOMNode();
      const midnightDate = date.setHours(0);
      inputField.value = DateTime.ignoreTZ(midnightDate).toString(DateTime.Formats.DATETIME);
      this._rangeParamsChanged(field)();
    };
  },

  _getRangeTypeSelector() {
    let selector;

    switch (this.state.rangeType) {
      case 'relative': {
        const availableOptions = this.props.config ? this.props.config.relative_timerange_options : null;
        const timeRangeLimit = this.props.config ? moment.duration(this.props.config.query_time_range_limit) : null;
        let options;

        if (availableOptions) {
          let all = null;
          options = Object.keys(availableOptions).map((key) => {
            const seconds = moment.duration(key).asSeconds();

            if (timeRangeLimit > 0 && (seconds > timeRangeLimit.asSeconds() || seconds === 0)) {
              return null;
            }

            const option = (<option key={`relative-option-${key}`} value={seconds}>{availableOptions[key]}</option>);

            // The "search in all messages" option should be the last one.
            if (key === 'PT0S') {
              all = option;
              return null;
            } else {
              return option;
            }
          });

          if (all) {
            options.push(all);
          }
        } else {
          options = (<option value="300">加载...</option>);
        }

        selector = (
          <div className="timerange-selector relative"
               style={{ width: 270, marginLeft: 50 }}>
            <Input id="relative-timerange-selector"
                   ref="relative"
                   type="select"
                   value={this.state.rangeParams.get('relative')}
                   name="relative"
                   onChange={this._rangeParamsChanged('relative')}
                   className="input-sm">
              {options}
            </Input>

          </div>
        );
        break;
      }
      case 'absolute': {
        selector = (
          <div className="timerange-selector absolute" style={{ width: 600 }}>
            <div className="row no-bm" style={{ marginLeft: 50 }}>
              <div className="col-md-5" style={{ padding: 0 }}>
                <Input type="hidden" name="from" ref="from" />
                <DatePicker id="searchFromDatePicker"
                            title="Search start date"
                            date={this.state.rangeParams.get('from')}
                            onChange={this._onDateSelected('from')}>
                  <Input type="text" id="searchFromDatePicker1"
                         ref="fromFormatted"
                         value={this._formattedDateStringInUserTZ('from')}
                         onChange={this._rangeParamsChanged('from')}
                         placeholder={DateTime.Formats.DATETIME}
                         buttonAfter={<Button bsSize="small" onClick={this._setDateTimeToNow('from')}><i className="fa fa-magic"></i></Button>}
                         bsStyle={this._isValidDateField('from') ? null : 'error'}
                         bsSize="small"
                         required />
                </DatePicker>

              </div>
              <div className="col-md-1">
                <p className="text-center" style={{ margin: 0, lineHeight: '30px' }}>到</p>
              </div>
              <div className="col-md-5" style={{ padding: 0 }}>
                <Input type="hidden" name="to" ref="to" />
                <DatePicker id="searchToDatePicker"
                            title="Search end date"
                            date={this.state.rangeParams.get('to')}
                            onChange={this._onDateSelected('to')}>
                  <Input type="text"
                         ref="toFormatted"
                         value={this._formattedDateStringInUserTZ('to')}
                         onChange={this._rangeParamsChanged('to')}
                         placeholder={DateTime.Formats.DATETIME}
                         buttonAfter={<Button bsSize="small" onClick={this._setDateTimeToNow('to')}><i className="fa fa-magic"></i></Button>}
                         bsStyle={this._isValidDateField('to') ? null : 'error'}
                         bsSize="small"
                         required />
                </DatePicker>
              </div>
            </div>
          </div>
        );
        break;
      }
      case 'keyword': {
        selector = (
          <div className="timerange-selector keyword" style={{ width: 650 }}>
            <div className="row no-bm" style={{ marginLeft: 50 }}>
              <div className="col-md-5" style={{ padding: 0 }}>
                <Input type="text"
                       ref="keyword"
                       name="keyword"
                       value={this.state.rangeParams.get('keyword')}
                       onChange={this._keywordSearchChanged}
                       placeholder="上周"
                       className="input-sm"
                       required />
              </div>
              <div className="col-md-7" style={{ paddingRight: 0 }}>
                {this.state.keywordPreview.size > 0 &&
                <Alert bsStyle="info" style={{ height: 30, paddingTop: 5, paddingBottom: 5, marginTop: 0 }}>
                  <strong style={{ marginRight: 8 }}>预览：</strong>
                  {this.state.keywordPreview.get('from')} 到 {this.state.keywordPreview.get('to')}
                </Alert>
                }
              </div>
            </div>
          </div>
        );
        break;
      }
      default:
        throw new Error(`Unsupported range type ${this.state.rangeType}`);
    }

    return selector;
  },

  _getSavedSearchesSelector() {
    const sortedSavedSearches = this.props.savedSearches.sort((searchA, searchB) => {
      return searchA.title.toLowerCase().localeCompare(searchB.title.toLowerCase());
    });

    return (
      <ChosenSelectInput ref="savedSearchesSelector"
                         className="input-sm"
                         value={this.state.savedSearch}
                         dataPlaceholder="保存的搜索"
                         onChange={this._savedSearchSelected}>
        {sortedSavedSearches.map((savedSearch) => {
          return <option key={savedSearch.id} value={savedSearch.id}>{savedSearch.title}</option>;
        })}
      </ChosenSelectInput>
    );
  },
  openModal(){
    // this.refs.myConditionModal.open();
    this.refs.searchModal.show();
  },
  _save(){
    // this.refs.myConditionModal.close();
    var xx = this.refs.searchModal.getTableData();
    $('#searchId').val(xx);
    // this.setState({query:xx});
  },
  _initSearchTableData() {
    var searchStr = $('#searchId').val();
    // console.log(searchStr);
    if (searchStr) {
      var isOr = false;
      if (searchStr.indexOf(" OR ") > -1) {
        isOr = true;
      } else {
        isOr = false;
      }
      var searchArr = [];
      if (isOr) {
        if (searchStr.indexOf(" AND ") > -1) {
          searchStr = searchStr.replace(/ AND /g, " OR ");
        }
        searchArr = searchStr.split(" OR ");
      } else {
        searchArr = searchStr.split(" AND ");
      }
      // console.log(searchArr);
      var searchConditions = [];
      for (var i = 0; i < searchArr.length; i++) {
        var seSplit = searchArr[i].split(':');
        // console.log(seSplit);
        var condition = '==';
        if (seSplit[1].indexOf(">=") > -1) {
          condition = '>=';
        } else if (seSplit[1].indexOf("<=") > -1) {
          condition = '<=';
        } else if (seSplit[1].indexOf(">") > -1) {
          condition = '>';
        } else if (seSplit[1].indexOf("<") > -1) {
          condition = '<';
        }
        var value = seSplit[1].replace(condition, '');

        var obj = {
          id: this.refs.searchModal.uuid(),
          searchCondition: condition,
          searchName: seSplit[0],
          state: true,
          value: value
        }
        searchConditions.push(obj);
      }
      // console.log(searchConditions);
      if (searchConditions.length) {
        this.refs.searchModal._setConditionData(searchConditions, isOr);
      }
    }
  },
  serchBtn(){
    this._prepareSearch();

    // ReactDOM.findDOMNode(this.refs.searchForm).submit();
    var SERVERADDRESS = AppConfig.gl2ServerUrl()+"/";
    var address = SERVERADDRESS+"search?rangetype=relative&fields=message%2Csource&width=1920&highlightMessage=&relative=300&q=";
    $.ajax({
        type: "get",
        async: false,
        url: address,
        dataType: "json",
        cache:false,
        success: function (data) {
          alert('请求成功');
        },
        timeout: 30000,
        error: function (data) {
          alert('失败');
        }
      });

  },
  render() {
    return (
      <div className="row no-bm" id="hello">

        <ConditionSearch ref="searchModal" onAddCondition={this._save}/>


        <div className="col-md-12" id="universalsearch-container">
          <div className="row no-bm">
            <div ref="universalSearch" className="col-md-12" id="universalsearch">
              <div>
              <form >
                <Input type="hidden" name="rangetype" value={this.state.rangeType} />
                <Input type="hidden" ref="fields" name="fields" value="" />
                <Input type="hidden" ref="width" name="width" value="" />
                <Input type="hidden" ref="highlightMessage" name="highlightMessage" value="" />

                <div className="timerange-selector-container">
                  <div className="row no-bm">
                    <div className="col-md-6">
                      <ButtonToolbar className="timerange-chooser pull-left">
                        <DropdownButton bsStyle="info"
                                        title={<i className="fa fa-clock-o"/>}
                                        onSelect={this._rangeTypeChanged}
                                        id="dropdown-timerange-selector">
                          <MenuItem eventKey="relative"
                                    className={this.state.rangeType === 'relative' ? 'selected' : null}>
                            相对
                          </MenuItem>
                          <MenuItem eventKey="absolute"
                                    className={this.state.rangeType === 'absolute' ? 'selected' : null}>
                            绝对
                          </MenuItem>
                          <MenuItem eventKey="keyword"
                                    className={this.state.rangeType === 'keyword' ? 'selected' : null}>
                            关键词
                          </MenuItem>
                        </DropdownButton>
                      </ButtonToolbar>

                      {this._getRangeTypeSelector()}
                    </div>
                    <div className="col-md-6">
                      <div className="saved-searches-selector-container pull-right"
                           style={{ display: 'inline-flex', marginRight: 5 }}>
                        {this.props.displayRefreshControls &&
                        <div style={{ marginRight: 5 }}>
                          <RefreshControls />
                        </div>
                        }
                        <div style={{ width: 270 }}>
                          {this._getSavedSearchesSelector()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="search-container">

                  <Button type="submit" bsStyle="success" className="pull-left" >
                    查
                  </Button>
                  <Button type="button" bsStyle="success" className="pull-left" style={{marginLeft:"5px"}} onClick={this.openModal}>
                    条件
                  </Button>
                  <div className="query" style={{marginLeft:"110px"}}>
                    <Input id="searchId"
                           type="text"
                           ref="query"
                           name="q"
                           value={this.state.query}
                           onChange={this._queryChanged}
                           placeholder="在此处输入您的搜索查询，然后按Enter. (&quot;not found&quot; AND http) OR http_response_code:[400 TO 404]" />
                  </div>
                </div>
              </form>
            </div>

            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default SearchBar;
