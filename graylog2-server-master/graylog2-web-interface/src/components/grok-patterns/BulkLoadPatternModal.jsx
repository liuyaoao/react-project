import React from 'react';
import { Input, Button } from 'react-bootstrap';

import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const GrokPatternsStore = StoreProvider.getStore('GrokPatterns');

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';

const BulkLoadPatternModal = React.createClass({
  propTypes: {
    onSuccess: React.PropTypes.func.isRequired,
  },
  _onSubmit(evt) {
    evt.preventDefault();

    const reader = new FileReader();
    const replaceAll = this.refs['replace-patterns'].checked;

    reader.onload = (loaded) => {
      const request = loaded.target.result.split('\n').map((line) => {
        if (!line.startsWith('#')) {
          const splitted = line.split(/\s+/, 2);
          if (splitted.length > 1) {
            return {name: splitted[0], pattern: splitted[1]};
          }
        }
      }).filter((elem) => elem !== undefined);
      GrokPatternsStore.bulkImport(request, replaceAll).then(() => {
        UserNotification.success('Grok表达式导入成功', '成功！');
        this.refs.modal.close();
        this.props.onSuccess();
      });
    };

    reader.readAsText(this.refs['pattern-file'].getInputDOMNode().files[0]);
  },
  render() {
    return (
      <span>
        <Button bsStyle="info" style={{marginRight: 5}} onClick={() => this.refs.modal.open()}>导入表达式文件</Button>

          <BootstrapModalForm ref="modal"
                              title="从文件中导入Grok表达式"
                              submitButtonText="上传"
                              formProps={{onSubmit: this._onSubmit}}>
            <Input type="file"
                   ref="pattern-file"
                   name="patterns"
                   label="表达式文件"
                   help="包含Grok表达式的文件（每行一个表达式），名称和表达式之间应该用空格隔开。"
                   required />
            <Input type="checkbox"
                   ref="replace-patterns"
                   name="replace"
                   label="替换所有已存在的表达式？" />
          </BootstrapModalForm>
      </span>
    );
  },
});

export default BulkLoadPatternModal;
