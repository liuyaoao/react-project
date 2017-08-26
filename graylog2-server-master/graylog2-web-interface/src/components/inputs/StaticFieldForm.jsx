import React, {PropTypes} from 'react';
import {Input} from 'react-bootstrap';

import {BootstrapModalForm} from 'components/bootstrap';

import StoreProvider from 'injection/StoreProvider';
const InputStaticFieldsStore = StoreProvider.getStore('InputStaticFields');

const StaticFieldForm = React.createClass({
  propTypes: {
    input: PropTypes.object.isRequired,
  },
  open() {
    this.refs.modal.open();
  },
  _addStaticField() {
    const fieldName = this.refs.fieldName.getValue();
    const fieldValue = this.refs.fieldValue.getValue();

    InputStaticFieldsStore.create(this.props.input, fieldName, fieldValue).then(() => this.refs.modal.close());
  },
  render() {
    return (
      <BootstrapModalForm ref="modal" title="添加静态字段" submitButtonText="添加字段"
                          onSubmitForm={this._addStaticField}>
        <p>为所有通过此输入值接收的消息定义一个静态字段。如果原消息中已经包含新定义的字段，则此字段将不会被覆盖。字段名只能由字母、数字或下划线组成，并且不能是保留字段。</p>
        <Input ref="fieldName" type="text" id="field-name" label="字段名" className="validatable"
               data-validate="alphanum_underscore" required autoFocus/>
        <Input ref="fieldValue" type="text" id="field-value" label="字段值" required/>
      </BootstrapModalForm>
    );
  },
});

export default StaticFieldForm;
