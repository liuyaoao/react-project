'use strict';

var React = require('react');
import { Input, Button, ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';

var AssignOutputDropdown = React.createClass({
    PLACEHOLDER: "选择现有的输出",
    getInitialState() {
        return {
            selectedOutput: this.PLACEHOLDER,
            selectedTitle: this.PLACEHOLDER
        };
    },
    _formatOutput(output) {
        return <MenuItem key={output.id} name={output.id} title={output.title}>{output.title}</MenuItem>;
    },
    _handleUpdate(evt) {
        this.setState({selectedOutput: evt.target.name, selectedTitle: evt.target.title});
    },
    _handleClick(evt) {
        this.props.onSubmit(this.state.selectedOutput);
        this.setState({selectedOutput: this.PLACEHOLDER});
    },
    render() {
        var outputs = this.props.outputs;
        var outputList = (outputs.length > 0 ? outputs.map(this._formatOutput) : <MenuItem disabled>无输出</MenuItem>);
        return (
            <div className="output-add">
                <div className="form-inline dropdown-container">
                            <DropdownButton bsStyle="form-control"
                                            title={this.state.selectedTitle}
                                            onSelect={this._handleUpdate}>
                                            {outputList}
                            </DropdownButton>
                    &nbsp;
                    <button ref="submitButton" type="button" disabled={this.state.selectedOutput === this.PLACEHOLDER}
                            id="add-existing-output" className="btn btn-success" onClick={this._handleClick}>
                        指定现有的输出
                    </button>
                </div>
            </div>
        );
    }
});
module.exports = AssignOutputDropdown;
