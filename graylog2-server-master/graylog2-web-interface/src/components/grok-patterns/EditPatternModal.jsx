import React from 'react';
import { Input } from 'react-bootstrap';

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';

const EditPatternModal = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    pattern: React.PropTypes.string,
    create: React.PropTypes.bool,
    savePattern: React.PropTypes.func.isRequired,
    validPatternName: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      id: this.props.id,
      name: this.props.name,
      pattern: this.props.pattern,
      error: false,
      error_message: '',
    };
  },
  openModal() {
    this.refs.modal.open();
  },
  _onPatternChange(event) {
    this.setState({pattern: event.target.value});
  },
  _onNameChange(event) {
    const name = event.target.value;

    if (!this.props.validPatternName(name)) {
      this.setState({name: name, error: true, error_message: '表达式名称已存在！'});
    } else {
      this.setState({name: name, error: false, error_message: ''});
    }
  },
  _getId(prefixIdName) {
    return this.state.name !== undefined ? prefixIdName + this.state.name : prefixIdName;
  },
  _closeModal() {
    this.refs.modal.close();
  },
  _saved() {
    this._closeModal();
    if (this.props.create) {
      this.setState({name: '', pattern: ''});
    }
  },
  _save() {
    const pattern = this.state;

    if (!pattern.error) {
      this.props.savePattern(pattern, this._saved);
    }
  },
  render() {
    let triggerButtonContent;
    if (this.props.create) {
      triggerButtonContent = '创建表达式';
    } else {
      triggerButtonContent = <span>编辑</span>;
    }
    return (
      <span>
                <button onClick={this.openModal} className={this.props.create ? 'btn btn-success' : 'btn btn-info btn-xs'}>
                  {triggerButtonContent}
                </button>
                <BootstrapModalForm ref="modal"
                                    title={`${this.props.create ? '创建' : '编辑'} Grok表达式 ${this.state.name}`}
                                    onSubmitForm={this._save}
                                    submitButtonText="保存">
                  <fieldset>
                    <Input type="text"
                           id={this._getId('pattern-name')}
                           label="名称"
                           onChange={this._onNameChange}
                           value={this.state.name}
                           bsStyle={this.state.error ? 'error' : null}
                           help={this.state.error ? this.state.error_message : null}
                           autoFocus
                           required />
                    <Input type="textarea"
                           id={this._getId('pattern')}
                           label="表达式"
                           onChange={this._onPatternChange}
                           value={this.state.pattern}
                           required />
                  </fieldset>
                </BootstrapModalForm>
            </span>
    );
  },
});

export default EditPatternModal;
