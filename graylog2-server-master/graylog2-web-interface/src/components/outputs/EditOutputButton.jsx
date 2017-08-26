import React, {PropTypes} from 'react';
import { Button } from 'react-bootstrap';
import { ConfigurationForm } from 'components/configurationforms';

const EditOutputButton = React.createClass({
  propTypes: {
    output: PropTypes.object,
    disabled: PropTypes.bool,
    getTypeDefinition: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
  },
  getInitialState() {
    return {
      typeDefinition: undefined,
      typeName: undefined,
      configurationForm: '',
    };
  },

  handleClick() {
    this.props.getTypeDefinition(this.props.output.type, (definition) => {
      this.setState({typeDefinition: definition.requested_configuration});
      this.refs.configurationForm.open();
    });
  },

  _handleSubmit(data) {
    this.props.onUpdate(this.props.output, data);
  },

  render() {
    const typeDefinition = this.state.typeDefinition;
    const output = this.props.output;
    let configurationForm;

    if (typeDefinition) {
      configurationForm = (
        <ConfigurationForm ref="configurationForm" key={`configuration-form-output-${output.id}`}
                           configFields={this.state.typeDefinition}
                           title={`编辑输出${output.title}`}
                           typeName={output.type}
                           helpBlock={"选择一个可以描述它的新名字。"}
                           submitAction={this._handleSubmit} values={output.configuration} titleValue={output.title}/>
      );
    }

    return (
      <span>
        <Button disabled={this.props.disabled} bsStyle="info" onClick={this.handleClick.bind(null, output)}>
          编辑
        </Button>
        {configurationForm}
      </span>
    );
  },
});

export default EditOutputButton;
