import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {Button, DropdownButton, MenuItem, Input} from 'react-bootstrap';

import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';

import StoreProvider from 'injection/StoreProvider';
const SavedSearchesStore = StoreProvider.getStore('SavedSearches');

import ActionsProvider from 'injection/ActionsProvider';
const SavedSearchesActions = ActionsProvider.getActions('SavedSearches');

const SavedSearchControls = React.createClass({
  propTypes: {
    currentSavedSearch: PropTypes.string,
  },
  mixins: [Reflux.listenTo(SavedSearchesStore, '_updateTitle')],
  getInitialState() {
    return {
      title: '',
      error: false,
    };
  },
  componentDidMount() {
    this._updateTitle();
  },
  _isSearchSaved() {
    return this.props.currentSavedSearch !== undefined;
  },
  _updateTitle() {
    if (!this._isSearchSaved()) {
      return;
    }

    const currentSavedSearch = SavedSearchesStore.getSavedSearch(this.props.currentSavedSearch);
    if (currentSavedSearch !== undefined) {
      this.setState({title: currentSavedSearch.title});
    }
  },
  _openModal() {
    this.refs.saveSearchModal.open();
  },
  _hide() {
    this.refs.saveSearchModal.close();
  },
  _save() {
    if (this.state.error) {
      return;
    }

    let promise;
    if (this._isSearchSaved()) {
      promise = SavedSearchesActions.update.triggerPromise(this.props.currentSavedSearch, this.refs.title.getValue());
    } else {
      promise = SavedSearchesActions.create.triggerPromise(this.refs.title.getValue());
    }
    promise.then(() => this._hide());
  },
  _deleteSavedSearch(event) {
    event.preventDefault();
    if (window.confirm('你真的要删除这个已保存的搜索?')) {
      SavedSearchesActions.delete.triggerPromise(this.props.currentSavedSearch);
    }
  },
  _titleChanged() {
    this.setState({error: !SavedSearchesStore.isValidTitle(this.props.currentSavedSearch, this.refs.title.getValue())});
  },
  _getNewSavedSearchButtons() {
    return <Button bsStyle="success" bsSize="small" onClick={this._openModal}>保存搜索条件</Button>;
  },
  _getEditSavedSearchControls() {
    return (
      <DropdownButton bsSize="small" title="已保存的搜索" id="saved-search-actions-dropdown">
        <MenuItem onSelect={this._openModal}>更新搜索条件</MenuItem>
        <MenuItem divider/>
        <MenuItem onSelect={this._deleteSavedSearch}>删除已保存的搜索</MenuItem>
      </DropdownButton>
    );
  },
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {this._isSearchSaved() ? this._getEditSavedSearchControls() : this._getNewSavedSearchButtons()}
        <BootstrapModalForm ref="saveSearchModal"
                            title={this._isSearchSaved() ? '更新已保存的搜索' : '保存搜索条件'}
                            onSubmitForm={this._save}
                            submitButtonText="保存">
          <Input type="text"
                 label="标题"
                 ref="title"
                 required
                 defaultValue={this.state.title}
                 onChange={this._titleChanged}
                 bsStyle={this.state.error ? 'error' : null}
                 help={this.state.error ? '标题已采取.' : '输入当前搜索的名称.'}
                 autoFocus/>
        </BootstrapModalForm>
      </div>
    );
  },
});

export default SavedSearchControls;
