import React from 'react';
import FieldHelpers from 'components/configurationforms/FieldHelpers';

const TextField = React.createClass({
  propTypes: {
    autoFocus: React.PropTypes.bool,
    field: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    typeName: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
  },
  getInitialState() {
    return {
      typeName: this.props.typeName,
      field: this.props.field,
      title: this.props.title,
      value: this.props.value,
    };
  },
  componentWillReceiveProps(props) {
    this.setState(props);
  },
  handleChange(evt) {
    this.props.onChange(this.state.title, evt.target.value);
    this.setState({value: evt.target.value});
  },
  render() {
    const field = this.state.field;
    const title = this.state.title;
    const typeName = this.state.typeName;

    let inputField;
    const isRequired = !field.is_optional;
    const fieldType = (!FieldHelpers.hasAttribute(field.attributes, 'textarea') && FieldHelpers.hasAttribute(field.attributes, 'is_password') ? 'password' : 'text');

    if (FieldHelpers.hasAttribute(field.attributes, 'textarea')) {
      inputField = (
        <textarea id={title} className="form-control" rows={10}
                  name={'configuration[' + title + ']'} required={isRequired} value={this.state.value}
                  onChange={this.handleChange} autoFocus={this.props.autoFocus}>
                    </textarea>
      );
    } else {
      inputField = (
        <input id={title} type={fieldType} className="form-control" name={'configuration[' + title + ']'} value={this.state.value}
               onChange={this.handleChange} required={isRequired} autoFocus={this.props.autoFocus} />
      );
    }

    // TODO: replace with bootstrap input component
    if(field.human_name == "URI of JSON resource"){
      field.human_name = "JSON资源的URI";
      field.description = "HTTP资源返回JSON";
    }else if(field.human_name =="JSON path of data to extract"){
      field.human_name = "数据提取的JSON路径";
      field.description ="路径要在JSON响应中提取值。看看一个更详细的说明文档。";
    }else if(field.human_name =="Message source"){
      field.human_name = "消息来源";
      field.description ="所使用的源字段生成的消息";
    }else if(field.human_name =="Additional HTTP headers"){
      field.human_name = "其他HTTP标头";
      field.description ="添加一个逗号分隔的额外的HTTP标头列表。例如: Accept: application/json, X-Requester: DeepLog";
    }
    return (
      <div className="form-group">
        <label htmlFor={typeName + '-' + title + ')'}>
          {field.human_name}
          {FieldHelpers.optionalMarker(field)}
        </label>
        {inputField}
        <p className="help-block">{field.description}</p>
      </div>
    );
  },
});

export default TextField;
