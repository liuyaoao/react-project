// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';

export function importComponentSuccess(callback) {
    return (comp) => callback(null, comp.default);
}

export function createGetChildComponentsFunction(arrayOfComponents) {
    return (locaiton, callback) => callback(null, arrayOfComponents);
}

export const notFoundParams = {
    title: '页面没有找到',
    message: '你访问的页面不存在',
    link: '/',
    linkmessage: '返回到主页面'
};

const mfaPaths = [
    '/mfa/setup',
    '/mfa/confirm'
];

const mfaAuthServices = [
    '',
    'email',
    'ldap'
];

export function checkIfMFARequired(state) {
    if (window.mm_license.MFA === 'true' &&
            window.mm_config.EnableMultifactorAuthentication === 'true' &&
            window.mm_config.EnforceMultifactorAuthentication === 'true' &&
            mfaPaths.indexOf(state.location.pathname) === -1) {
        const user = UserStore.getCurrentUser();
        if (user && !user.mfa_active &&
                mfaAuthServices.indexOf(user.auth_service) !== -1) {
            return true;
        }
    }

    return false;
}
