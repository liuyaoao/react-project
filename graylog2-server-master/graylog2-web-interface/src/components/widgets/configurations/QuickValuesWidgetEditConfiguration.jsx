import React, {PropTypes} from 'react';
import { Input } from 'react-bootstrap';

import { QueryConfiguration } from 'components/widgets/configurations';

const QuickValuesWidgetEditConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  render() {
    return (
      <fieldset>
        <QueryConfiguration {...this.props}/>
        <Input key="showPieChart"
               type="checkbox"
               id="quickvalues-show-pie-chart"
               name="show_pie_chart"
               label="显示饼状图"
               defaultChecked={this.props.config.show_pie_chart}
               onChange={this.props.onChange}
               help="在饼图中表示数据"/>

        <Input key="showDataTable"
               type="checkbox"
               id="quickvalues-show-data-table"
               name="show_data_table"
               label="显示数据表格"
               defaultChecked={this.props.config.show_data_table}
               onChange={this.props.onChange}
               help="包含一个数量信息的表格."/>
      </fieldset>
    );
  },
});

export default QuickValuesWidgetEditConfiguration;
