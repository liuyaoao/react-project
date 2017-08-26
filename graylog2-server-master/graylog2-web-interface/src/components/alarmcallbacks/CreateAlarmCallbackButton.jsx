import React from 'react';
import { ConfigurationForm } from 'components/configurationforms';
import jQuery from 'jquery';
import { ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';

const CreateAlarmCallbackButton = React.createClass({
  propTypes: {
    onCreate: React.PropTypes.func.isRequired,
    types: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      typeName: this.PLACEHOLDER,
      typeTitle: this.PLACEHOLDER,
      typeDefinition: {},
    };
  },
  PLACEHOLDER: '选择回调类型',

  componentDidMount() {
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
  },
  _openModal() {
    this.refs.configurationForm.open();
  },
  _formatOutputType(typeDefinition, typeName) {
    return (<MenuItem key={typeName} name={typeName} title={typeDefinition.name}>{typeDefinition.name}</MenuItem>);
  },
  _onTypeChange(evt) {
    const alarmCallbackType = evt.currentTarget.name;
    const alarmCallbackTypeTitle = evt.currentTarget.title;
    this.setState({typeName: alarmCallbackType, typeTitle: alarmCallbackTypeTitle});
    $("#callbackButton").removeClass('disabled');
    if (this.props.types[alarmCallbackType]) {
      this.setState({typeDefinition: this.props.types[alarmCallbackType].requested_configuration});
    } else {
      this.setState({typeDefinition: {}});
    }
  },
  _handleSubmit(data) {
    this.props.onCreate(data);
    this.setState({typeName: this.PLACEHOLDER});
  },
  _handleCancel() {
    this.setState({typeName: this.PLACEHOLDER});
  },
  render() {
    const alarmCallbackTypes = jQuery.map(this.props.types, this._formatOutputType);
    const humanTypeName = (this.state.typeName && this.props.types[this.state.typeName] ? this.props.types[this.state.typeName].name : 'Alarm Callback');
    const configurationForm = (this.state.typeName !== this.PLACEHOLDER ? <ConfigurationForm ref="configurationForm"
                                                                                           key="configuration-form-output" configFields={this.state.typeDefinition} title={'创建新的' + humanTypeName}
                                                                                           typeName={this.state.typeName} includeTitleField={false}
                                                                                           submitAction={this._handleSubmit} cancelAction={this._handleCancel} /> : null);


    return (
      <div className="form-inline">
        <div className="form-group">
            <ButtonToolbar className="timerange-chooser nofloat pull-left">
              <DropdownButton id="input-type" title={this.state.typeTitle} className="form-control" onSelect={this._onTypeChange}>
                {alarmCallbackTypes}
              </DropdownButton>
            </ButtonToolbar>
          {' '}
          <button id="callbackButton" className="btn btn-success form-control disabled" disabled={this.state.typeName === this.PLACEHOLDER}
                  onClick={this._openModal}>添加回调</button>


        </div>
        {configurationForm}
      </div>
    );
  },
});

export default CreateAlarmCallbackButton;
