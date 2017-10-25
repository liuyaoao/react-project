export const SET_WINDOW_SIZE_CHANGE = 'SET_WINDOW_SIZE_CHANGE';
export const SET_DESKTOP_TYPE = 'SET_DESKTOP_TYPE';
export const SET_USER_LOGIN = 'SET_USER_LOGIN';
export const SET_ERROR_MSG = 'SET_ERROR_MSG';
export const SET_DIALOG_MSG = 'SET_DIALOG_MSG';
export const SET_CYSIZE = 'SET_CYSIZE';
export const SET_VPNTOPOLOGYDATA = 'SET_VPNTOPOLOGYDATA';
export const SET_VPNTOPOLOGYSTATUS = 'SET_VPNTOPOLOGYSTATUS';
export const SET_MANAGER_SERVER_IP = 'SET_MANAGER_SERVER_IP';
export const SET_MANAGER_SERVER_PORT = 'SET_MANAGER_SERVER_PORT';
export const SET_PROXY_SERVER_LIST = 'SET_PROXY_SERVER_LIST';
export const SET_MANAGER_SERVER_SESSIONID = 'SET_MANAGER_SERVER_SESSIONID';
export const SET_MY_PHONE_IP = 'SET_MY_PHONE_IP';
export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE';


export function setWindowSizeChange(windowSizeChange) {
    return {
        type: SET_WINDOW_SIZE_CHANGE,
        windowSizeChange
    }
}

export function setDesktopType(desktopType) {
    return {
        type: SET_DESKTOP_TYPE,
        desktopType
    }
}

export function setUserLogin(userLogin) {
    return {
        type: SET_USER_LOGIN,
        userLogin
    }
}

export function setErrorMsg(errorMsg) {
    return {
        type: SET_ERROR_MSG,
        errorMsg
    }
}

export function setDialogMsg(dialogMsg) {
    return {
        type: SET_DIALOG_MSG,
        dialogMsg
    }
}

export function setCySize(cySize) {
    return {
        type: SET_CYSIZE,
        cySize
    }
}

export function setVpnTopologyData(vpntopologyData) {
    return {
        type: SET_VPNTOPOLOGYDATA,
        vpntopologyData
    }
}

export function setVpnTopologyStatus(vpntopologyStatus) {
    return {
        type: SET_VPNTOPOLOGYSTATUS,
        vpntopologyStatus
    }
}

export function setManagerServerIP(managerServerIP) {
    return {
        type: SET_MANAGER_SERVER_IP,
        managerServerIP
    }
}

export function setManagerServerPort(managerServerPort) {
    return {
        type: SET_MANAGER_SERVER_PORT,
        managerServerPort
    }
}

export function setProxyServerList(proxyServerList) {
    return {
        type: SET_PROXY_SERVER_LIST,
        proxyServerList
    }
}

export function setManagerServerSessionId(managerServerSessionId) {
    return {
        type: SET_MANAGER_SERVER_SESSIONID,
        managerServerSessionId
    }
}

export function setMyPhoneIP(myPhoneIP) {
    return {
        type: SET_MY_PHONE_IP,
        myPhoneIP
    }
}

export function setWindowSize(windowSize) {
    return {
        type: SET_WINDOW_SIZE,
        windowSize
    }
}
