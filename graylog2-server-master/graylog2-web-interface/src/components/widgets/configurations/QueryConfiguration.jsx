import React, {PropTypes} from 'react';
import { Input } from 'react-bootstrap';

const QueryConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  render() {
    return (
      <Input type="text"
             key="query"
             id="query"
             name="query"
             label="搜索查询"
             defaultValue={this.props.config.query}
             onChange={this.props.onChange}
             help="搜索查询,执行将获取部件的值."/>
    );
  },
});

export default QueryConfiguration;
