// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import SpinnerButton from 'components/spinner_button.jsx';

import {loadGetNotInBlacklist, loadAddUsersToBlacklist} from 'actions/blacklist_actions.jsx';

import React from 'react';
import {FormattedMessage} from 'react-intl';

const USERS_PER_PAGE = 50;

export default class BlacklistAddButton extends React.Component {
    static get propTypes() {
        return {
            user: React.PropTypes.object.isRequired,
            onInviteError: React.PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            addingUser: false
        };
    }

    handleClick() {
        if (this.state.addingUser) {
            return;
        }

        this.setState({
            addingUser: true
        });

        loadAddUsersToBlacklist(
            this.props.user.id,
            () => {
                this.props.onInviteError(null);
                loadGetNotInBlacklist(0, USERS_PER_PAGE * 2);
            },
            (err) => {
                this.setState({
                    addingUser: false
                });

                this.props.onInviteError(err);
            }
        );
    }

    render() {
        return (
            <SpinnerButton
                id='addBlackMembers'
                className='btn btn-sm btn-primary'
                onClick={this.handleClick}
                spinning={this.state.addingUser}
            >
                <i className='fa fa-plus fa-margin--right'/>
                <FormattedMessage
                    id='channel_invite.add'
                    defaultMessage=' Add'
                />
            </SpinnerButton>
        );
    }
}