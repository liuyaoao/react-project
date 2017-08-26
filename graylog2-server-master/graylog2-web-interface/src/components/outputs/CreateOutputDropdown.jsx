import React from 'react';
import $ from 'jquery';

import { ConfigurationForm } from 'components/configurationforms';
import { Input, Button, ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';

const CreateOutputDropdown = React.createClass({
    PLACEHOLDER: "placeholder",
    getInitialState() {
        return {
            typeDefinition: [],
            typeName: this.PLACEHOLDER,
            typeTitle: this.PLACEHOLDER
        };
    },
    PLACEHOLDER:'选择输出类型',
    componentDidMount() {
        this.loadData();
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
    loadData() {
    },
    render() {
        var outputTypes = $.map(this.props.types, this._formatOutputType);
        return (
            <div>
                <div className="form-inline dropdown-container">
                        <DropdownButton bsStyle="form-control"
                                        title={this.state.typeTitle}
                                        onSelect={this._onTypeChange}>
                                        {outputTypes}
                        </DropdownButton>
                    &nbsp;
                    <button className="btn btn-success" disabled={this.state.typeName === this.PLACEHOLDER} onClick={this._openModal}>创建新的输出</button>
                </div>

                <ConfigurationForm ref="configurationForm" key="configuration-form-output" configFields={this.state.typeDefinition} title="创建新的输出"
                                   helpBlock={"选择一个可以描述它的新的输出名称"}
                                   typeName={this.state.typeName}
                                   submitAction={this.props.onSubmit} />
            </div>
        );
    },
    _openModal(evt) {
        if (this.state.typeName !== this.PLACEHOLDER && this.state.typeName !== "") {
            this.refs.configurationForm.open();
        }
    },
    _formatOutputType(type, typeName) {
        return (<MenuItem key={typeName} name={typeName} title={type.name}>{type.name}</MenuItem>);
    },
    _onTypeChange(evt) {
        var outputType = evt.target.name;
        this.setState({typeName: evt.target.name, typeTitle:evt.target.title});
        this.props.getTypeDefinition(outputType, (definition) => {
            this.setState({typeDefinition: definition.requested_configuration});
        });
    },
});

export default CreateOutputDropdown;
