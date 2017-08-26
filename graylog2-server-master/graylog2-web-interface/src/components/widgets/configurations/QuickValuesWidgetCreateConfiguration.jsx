import React, {PropTypes} from 'react';
import { Input } from 'react-bootstrap';

const QuickValuesWidgetCreateConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getInitialConfiguration() {
    return {
      show_pie_chart: true,
      show_data_table: true,
    };
  },

  render() {
    return (
      <fieldset>
        <Input key="showPieChart"
               type="checkbox"
               id="quickvalues-show-pie-chart"
               name="show_pie_chart"
               label="显示饼状图"
               checked={this.props.config.show_pie_chart}
               onChange={this.props.onChange}
               help="包括一个数据表示的饼图."/>

        <Input key="showDataTable"
               type="checkbox"
               id="quickvalues-show-data-table"
               name="show_data_table"
               label="显示数据表格"
               checked={this.props.config.show_data_table}
               onChange={this.props.onChange}
               help="包含一个数量信息的表格."/>
      </fieldset>
    );
  },
});

export default QuickValuesWidgetCreateConfiguration;
