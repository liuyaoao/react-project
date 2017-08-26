import React from 'react';
import { Input, Button, Row, Col } from 'react-bootstrap';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { IfPermitted, ISODurationInput } from 'components/common';
import ObjectUtils from 'util/ObjectUtils';

import moment from 'moment';
import {} from 'moment-duration-format';

import TimeRangeOptionsForm from './TimeRangeOptionsForm';
import TimeRangeOptionsSummary from './TimeRangeOptionsSummary';

const SearchesConfig = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    updateConfig: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    const queryTimeRangeLimit = this._getPropConfigValue('query_time_range_limit');
    const relativeTimerangeOptions = this._getPropConfigValue('relative_timerange_options');
    const surroundingTimerangeOptions = this._getPropConfigValue('surrounding_timerange_options');
    const surroundingFilterFields = this._getPropConfigValue('surrounding_filter_fields');

    return {
      config: {
        query_time_range_limit: queryTimeRangeLimit,
        relative_timerange_options: relativeTimerangeOptions,
        surrounding_timerange_options: surroundingTimerangeOptions,
        surrounding_filter_fields: surroundingFilterFields,
      },
      limitEnabled: moment.duration(queryTimeRangeLimit).asMilliseconds() > 0,
      relativeTimeRangeOptionsUpdate: undefined,
      surroundingTimeRangeOptionsUpdate: undefined,
    };
  },

  _getPropConfigValue(field) {
    return this.props.config ? this.props.config[field] : undefined;
  },

  _onUpdate(field) {
    return (newOptions) => {
      const update = ObjectUtils.clone(this.state.config);

      update[field] = newOptions;

      this.setState({ config: update });
    };
  },

  _onRelativeTimeRangeOptionsUpdate(data) {
    this.setState({ relativeTimeRangeOptionsUpdate: data });
  },

  _onSurroundingTimeRangeOptionsUpdate(data) {
    this.setState({ surroundingTimeRangeOptionsUpdate: data });
  },

  _buildTimeRangeOptions(options) {
    return Object.keys(options).map((key) => {
      return { period: key, description: options[key] };
    });
  },

  _onFilterFieldsUpdate(e) {
    this.setState({ surroundingFilterFields: e.target.value });
  },

  _onChecked() {
    const config = ObjectUtils.clone(this.state.config);

    if (this.state.limitEnabled) {
      // If currently enabled, disable by setting the limit to 0 seconds.
      config.query_time_range_limit = 'PT0S';
    } else {
      // If currently not enabled, set a default of 30 days.
      config.query_time_range_limit = 'P30D';
    }

    this.setState({ config: config, limitEnabled: !this.state.limitEnabled });
  },

  _isEnabled() {
    return this.state.limitEnabled;
  },

  _saveConfig() {
    const update = ObjectUtils.clone(this.state.config);

    if (this.state.relativeTimeRangeOptionsUpdate) {
      update.relative_timerange_options = {};

      this.state.relativeTimeRangeOptionsUpdate.forEach((entry) => {
        update.relative_timerange_options[entry.period] = entry.description;
      });

      this.setState({ relativeTimeRangeOptionsUpdate: undefined });
    }

    if (this.state.surroundingTimeRangeOptionsUpdate) {
      update.surrounding_timerange_options = {};

      this.state.surroundingTimeRangeOptionsUpdate.forEach((entry) => {
        update.surrounding_timerange_options[entry.period] = entry.description;
      });

      this.setState({ surroundingTimeRangeOptionsUpdate: undefined });
    }

    // Make sure to update filter fields
    if (this.state.surroundingFilterFields) {
      update.surrounding_filter_fields = this.state.surroundingFilterFields
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      this.setState({ surroundingFilterFields: undefined });
    }

    this.props.updateConfig(update).then(() => {
      this._closeModal();
    });
  },

  _resetConfig() {
    // Reset to initial state when the modal is closed without saving.
    this.setState(this.getInitialState());
  },

  _openModal() {
    this.refs.searchesConfigModal.open();
  },

  _closeModal() {
    this.refs.searchesConfigModal.close();
  },

  queryTimeRangeLimitValidator(milliseconds) {
    return milliseconds >= 1;
  },

  relativeTimeRangeValidator(milliseconds, duration) {
    return milliseconds >= 1 || duration === 'PT0S';
  },

  surroundingTimeRangeValidator(milliseconds) {
    return milliseconds >= 1;
  },

  render() {
    const config = this.state.config;
    const duration = moment.duration(config.query_time_range_limit);
    const limit = this._isEnabled() ? `${config.query_time_range_limit} (${duration.format()})` : '禁用的';

    let filterFields;
    let filterFieldsString;
    if (this.state.config.surrounding_filter_fields) {
      filterFields = this.state.config.surrounding_filter_fields.map((f, idx) => <li key={idx}>{f}</li>);
      filterFieldsString = this.state.config.surrounding_filter_fields.join(', ');
    }

    return (
      <div>
        <h2>搜索配置</h2>

        <dl className="deflist">
          <dt>请求时间范围的限制</dt>
          <dd>{limit}</dd>
          <dd>
			用户获取数据所用的最大的时间。这个避免了突然发起请求大量数据并消耗大量时间来完成请求的用户。</dd>
        </dl>

        <Row>
          <Col md={6}>
            <strong>相关的时间范围选项</strong>
            <TimeRangeOptionsSummary options={this.state.config.relative_timerange_options} />
          </Col>
          <Col md={6}>
            <strong>近似的时间范围选项</strong>
            <TimeRangeOptionsSummary options={this.state.config.surrounding_timerange_options} />

            <strong>近似搜索的过滤字段</strong>
            <ul>
              {filterFields}
            </ul>
          </Col>
        </Row>
        <IfPermitted permissions="clusterconfigentry:edit">
          <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>编辑</Button>
        </IfPermitted>

        <BootstrapModalForm ref="searchesConfigModal"
                            title="更新搜索配置"
                            onSubmitForm={this._saveConfig}
                            onModalClose={this._resetConfig}
                            submitButtonText="保存">
          <fieldset>
            <Input type="checkbox" label="启用查询限制"
                   name="enabled"
                   checked={this._isEnabled()}
                   onChange={this._onChecked}/>
            {this._isEnabled() &&
            <ISODurationInput duration={config.query_time_range_limit}
                              update={this._onUpdate('query_time_range_limit')}
                              label="请求时间范围的限制（ISO8601 区段）"
                              help={'最大的搜索时间范围。（比如，"P30D"指30天，"PT24H"值24小时）'}
                              validator={this.queryTimeRangeLimitValidator}
                              required />
            }

            <TimeRangeOptionsForm options={this.state.relativeTimeRangeOptionsUpdate || this._buildTimeRangeOptions(this.state.config.relative_timerange_options)}
                                  update={this._onRelativeTimeRangeOptionsUpdate}
                                  validator={this.relativeTimeRangeValidator}
                                  title="相关的时间范围选项"
                                  help={<span>为<strong>相关</strong>的时间范围器选择配置可选的选项</span>} />

            <TimeRangeOptionsForm options={ this.state.surroundingTimeRangeOptionsUpdate || this._buildTimeRangeOptions(this.state.config.surrounding_timerange_options)}
                                  update={this._onSurroundingTimeRangeOptionsUpdate}
                                  validator={this.surroundingTimeRangeValidator}
                                  title="近似的时间范围选项"
                                  help={<span>为<strong>近似</strong>的时间选择器配置可选的选项</span>} />

            <Input type="text"
                   label="近似搜索的过滤字段"
                   onChange={this._onFilterFieldsUpdate}
                   value={this.state.surroundingFilterFields || filterFieldsString}
                   help="一个用 ',' 分隔的消息字段列表，可以用做查询近似消息的过滤器。"
                   required />
          </fieldset>
        </BootstrapModalForm>
      </div>
    );
  },
});

export default SearchesConfig;
