// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import Constants from 'utils/constants.jsx';
import AppDispatcher from '../dispatcher/app_dispatcher.jsx';
import React from 'react';

export function isEmail(email) {
    // writing a regex to match all valid email addresses is really, really hard (see http://stackoverflow.com/a/201378)
    // so we just do a simple check and rely on a verification email to tell if it's a real address
    return (/^.+@.+$/).test(email);
}

export function isMac() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
export function isMobile() {
    return window.innerWidth <= Constants.MOBILE_SCREEN_WIDTH;
}
export function createSafeId(prop) {
    if (prop === null) {
        return null;
    }

    var str = '';

    if (prop.props && prop.props.defaultMessage) {
        str = prop.props.defaultMessage;
    } else {
        str = prop.toString();
    }

    return str.replace(new RegExp(' ', 'g'), '_');
}
