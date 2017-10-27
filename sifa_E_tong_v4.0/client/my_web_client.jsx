import $ from 'jquery';
import request from 'superagent';
import nocache from 'superagent-no-cache';

const HEADER_X_VERSION_ID = 'x-version-id';
const HEADER_X_CLUSTER_ID = 'x-cluster-id';
const HEADER_TOKEN = 'token';
const HEADER_BEARER = 'BEARER';
const HEADER_AUTH = 'Authorization';

class MyWebClient {
    constructor() {
        this.serverVersion = '';
        this.clusterId = '';
        this.logToConsole = false;
        this.useToken = false;
        this.token = '';
        this.tokenName = window.localStoreTokenName;
        this.url = window.serverUrl;
        // this.url = 'http://192.168.9.39:10080'; //192.168.9.81:10080 , 220.168.30.10:10080
        // this.url = 'http://matt.siteview.com'; //192.168.9.81:10080 , 220.168.30.10:10080
        // this.url = 'http://220.168.30.10:10080'; //192.168.9.81:10080 , 220.168.30.10:10080
        // this.urlVersion = '';
        this.urlVersion = '/api/v3';
        this.urlVersion4 = '/api/v4';
        this.urlVersionV4 = '/api/v4';
        this.defaultHeaders = {
            'X-Requested-With': 'XMLHttpRequest'
            // 'Access-Control-Allow-Origin':'*'
        };

        this.translations = {
            connectionError: 'There appears to be a problem with your internet connection.',
            unknownError: 'We received an unexpected status code from the server.'
        };
    }

    setUrl(url) {
        this.url = url;
    }
    setLocalStorageToken(value) { //设置存储在localStorage里的token值。
      localStorage.setItem(this.tokenName,value);
    }
    getLocalStorageToken() {
      return localStorage.getItem(this.tokenName);
    }
    removeLocalStorageToken(){
      localStorage.removeItem(this.tokenName);
    }
    getToken() {
      return localStorage.getItem(this.tokenName);
    }

    removeToken(){
      localStorage.removeItem(this.tokenName);
    }

    setAcceptLanguage(locale) {
        this.defaultHeaders['Accept-Language'] = locale;
    }

    getServerVersion() {
        return this.serverVersion;
    }

    getBaseRoute() {
        return `${this.url}${this.urlVersion}`;
    }

    getAdminRoute() {
        return `${this.url}${this.urlVersion}/admin`;
    }
    //
    getUsersRoute() {
        return `${this.url}${this.urlVersion}/users`;
    }
    getUserRoute() {
        return `${this.url}${this.urlVersion}/users`;
    }
    getUserRouteV4(){
      return `${this.url}${this.urlVersion4}/users`;
    }
    getUsersRouteV4(){
      return `${this.url}${this.urlVersionV4}/users`;
    }
    getContactsImportUrl(){
      return `${this.url}${this.urlVersion}/import/contacts`;
    }

    getfileInformationUrl(){
      return `${this.url}/fileInformation`;
    }
    getfileInfoImportPrefix(){
      return `${this.url}${this.urlVersion}/import/fileInformation`;
    }
    getfileInfoImportUrl(fileSubTypeName,departmentName){
      if(fileSubTypeName == "局属二级机构"){
        return `${this.url}${this.urlVersion}/import/fileInformation?fileInfoSubType=${fileSubTypeName}&department=${departmentName}`;
      }
      return `${this.url}${this.urlVersion}/import/fileInformation?fileInfoSubType=${fileSubTypeName}`;
    }
    getDefaultHeadersWithToken(){
      return Object.assign({},this.defaultHeaders,{ token:this.getLocalStorageToken() });
    }

    getlawfirmfileInfoImportUrl(){ //律所 导入地址。
      return `${this.getfileInfoImportPrefix()}/lawfirm`;
    }

    getjudicialexamInfoImportUrl(){ //司法考试处 导入地址。
      return `${this.getfileInfoImportPrefix()}/judicialExamination`;
    }
    getLegalWorkerImportUrl(){ //法律工作者 导入地址。
      return `${this.getfileInfoImportPrefix()}/grassrootsLegalWerviceWorkers`;
    }
    getSifa_DirectorImportUrl(){ //司法所长 导入地址。
      return `${this.getfileInfoImportPrefix()}/superintendent`;
    }
    getLawyerfileInfoImportUrl(){
      return `${this.getfileInfoImportPrefix()}/lawyer`;
    }

    getfileInfoDepartmentImportUrl(org){
      return `${this.url}${this.urlVersion}/permission/${org}/resourcePermission`;
    }

    getBlacklistRoute() {
        return `${this.url}${this.urlVersion}/blacklist`;
    }

    setTranslations(messages) {
        this.translations = messages;
    }

    enableLogErrorsToConsole(enabled) {
        this.logToConsole = enabled;
    }

    useHeaderToken() {
        this.useToken = true;
        if (this.token !== '') {
            this.defaultHeaders[HEADER_AUTH] = `${HEADER_BEARER} ${this.token}`;
        }
    }

    trackEvent(category, event, properties) { // eslint-disable-line no-unused-vars
        // NO-OP for inherited classes to override
    }

    handleError(err, res) { // eslint-disable-line no-unused-vars
        // NO-OP for inherited classes to override
    }

    handleSuccess(res) { // eslint-disable-line no-unused-vars
        // NO-OP for inherited classes to override
    }

    handleResponse(methodName, successCallback, errorCallback, err, res) {
        if (res && res.header) {
            if (res.header[HEADER_X_VERSION_ID]) {
                this.serverVersion = res.header[HEADER_X_VERSION_ID];
            }

            if (res.header[HEADER_X_CLUSTER_ID]) {
                this.clusterId = res.header[HEADER_X_CLUSTER_ID];
            }
        }

        if (err && res.status!=200) {
            // test to make sure it looks like a server JSON error response
            var e = null;
            if (res && res.body && res.body.id) {
                e = res.body;
            }
            if (res && res.text) {
              if (res.text == 'token time out') {
                e = {
                  msg: 'token time out'
                }
              } else {
                var text='';
                try{
                   text = JSON.parse(res.text);
                }catch(e){
                  text = res.text;
                }
                if (typeof text=="object" && text.id) {
                  e = text;
                }
              }
            }

            var msg = '';

            if (e) {
                msg = 'method=' + methodName + ' msg=' + e.message + ' detail=' + e.detailed_error + ' rid=' + e.request_id;
            } else {
                msg = 'method=' + methodName + ' status=' + err.status + ' statusCode=' + err.statusCode + ' err=' + err;

                if (err.status === 0 || !err.status) {
                    e = {message: this.translations.connectionError};
                } else {
                    e = {message: this.translations.unknownError + ' (' + err.status + ')'};
                }
            }

            if (this.logToConsole) {
                console.error(msg); // eslint-disable-line no-console
                console.error(e); // eslint-disable-line no-console
            }

            if (res && res.text == 'token time out') { // eslint-disable-line no-undefined
                this.removeToken();
                window.location.href = '/';
            }

            this.handleError(err, res);

            if (errorCallback) {
                errorCallback(e, err, res);
            }
            return;
        }

        if (successCallback) {
            if (res && res.body !== undefined && res.body !== null) { // eslint-disable-line no-undefined
                successCallback(res.body, res);
            }
            else if (res && res.text !== undefined) { // eslint-disable-line no-undefined
              var text='';
              if(res.text){
                try{
                  text = JSON.parse(res.text);
                }catch(e){
                  text = res.text;
                }
              }
              successCallback(res.text ? text : null, res);
            }
            else {
                console.error('Missing response body for ' + methodName); // eslint-disable-line no-console
                successCallback('', res);
            }
            this.handleSuccess(res);
        }
    }
    getInitialLoad(success, error) { //获取初始化的数据
      // $.ajax({
      //     url : `${this.getUsersRoute()}/initial_load`,
      //     type:'GET',
      //     async : true,
      //     contentType:'application/json',
      //     dataType:'json',
      //     cache:false,
      //     success:(res)=>{
      //       console.log("getInitialLoad:",res);
      //       success && success(res);
      //     },
      //     error:(xhr,err)=>{
      //       error && error(err);
      //     }
      //   });
        request.
            get(`${this.getUsersRoute()}/initial_load`).
            set(this.getDefaultHeadersWithToken()).
            type('application/json').
            accept('application/json').
            use(nocache).
            end(this.handleResponse.bind(this, 'getInitialLoad', (data,res)=>{
              success && success(data,res);
            }, error));
    }
    webLogin(loginId, password, mfaToken, success, error) {
        this.doLogin({login_id: loginId, password, token: mfaToken}, success, error);

        this.trackEvent('api', 'api_users_login');
    }
    doLogin(outgoingData, success, error) {
        var outer = this;  // eslint-disable-line consistent-this
        request.
            post(`${this.getUsersRouteV4()}/login`).
            set(this.getDefaultHeadersWithToken()).
            type('application/json').
            accept('application/json').
            send(outgoingData).
            use(nocache).
            end(this.handleResponse.bind(
                this,
                'login',
                (data, res) => {
                    if (res && res.header) {
                      // console.log("登录后---：",data,res);
                        outer.token = res.header[HEADER_TOKEN];
                        localStorage.setItem(outer.tokenName, outer.token+"");
                        if (outer.useToken) {
                            outer.defaultHeaders[HEADER_AUTH] = `${HEADER_BEARER} ${outer.token}`;
                        }
                    }
                    if (success) {
                        success(data, res);
                    }
                },
                error
            ));
    }
    logout(success, error) {
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
        request.
            post(`${this.getUsersRoute()}/logout`).
            set(this.defaultHeaders).
            use(nocache).
            type('application/json').
            accept('application/json').
            end(this.handleResponse.bind(this, 'logout', (data,res)=>{
              localStorage.removeItem(this.tokenName);
              success && success(data,res);
            }, (e,err,res)=>{
              localStorage.removeItem(this.tokenName);
              error(e,err,res);
            }));

        this.trackEvent('api', 'api_users_logout');
    }

    getContactDirectoryData(success,error){ //获取通讯录的目录结构数据
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts/directory`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'contacts_directory', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    getServerAddressBook(param, success, error) {
      let _this = this;
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(param).
          end(this.handleResponse.bind(this, 'contacts', (data,res)=>{
            success && success(data,res);
          }, error));
    }
    getContactsByUserNames(userNames,success,error){ //通过逗号隔开的用户名字符串获取通讯录列表
      let _this = this;
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts/search`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(userNames||'').
          end(this.handleResponse.bind(this, 'contacts', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    addOrEditContacts(actionName,param, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts/${actionName}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(param).
          end(this.handleResponse.bind(this, 'contacts_'+actionName, (data,res)=>{
            success && success(data,res);
          }, error));
    }
    deleteContacts(contactsIds,success,error){ //删除联系人。contactsIds为逗号隔开的字符串。
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts/batchdelete`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(contactsIds).
          end(this.handleResponse.bind(this, 'contactsIds_batchdelete', (data,res)=>{
            success && success(data,res);
          }, error));
    }
    deleteAllContacts(success,error){ //删除联系人。contactsIds为逗号隔开的字符串。
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/contacts/deleteAll`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'deleteAll_Contacts', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    getOrganizationsData(success,error){
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/organizations`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'organizations', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    getUsersData(params,success,error){
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/getAllUser`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          // send(params).
          end(this.handleResponse.bind(this, 'getAllUser', (data,res)=>{
            success && success(data,res);
          }, error));
    }
    getSearchUsersData(params,success,error){
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/getSearch`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'getSearch', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    addOrEditUser(actionName,params,success,error){ //新增或者编辑用户信息。第一个参数可为（'create','update'）
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/${actionName}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'users'+actionName, (data,res)=>{
            success && success(data,res);
          }, error));
    }

    modifyUserPassword(params,success,error){ //新增或者编辑用户信息。第一个参数可为（'create','update'）
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/passwordChange`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'modify_users_password', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    deleteUsers(userIds,success,error){ //删除用户信息。userIds为逗号隔开的字符串。
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/batchdelete`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(userIds).
          end(this.handleResponse.bind(this, 'batchdelete', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    addOrEditOrganization(actionName,params,success,error){ //新增或者编辑组织机构。第一个参数可为（'add','update'）
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/organizations/${actionName}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'organizations '+actionName, (data,res)=>{
            success && success(data,res);
          }, error));
    }

    deleteOrganization(organizationId,success,error){ //删除组织结构
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/organizations/${organizationId}/delete`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'organizations_delete', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    getUserLoginRecordData(params,success,error){ //获取用户自己的登录签到记录
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getUsersRoute()}/punchcard`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'user_punchcard', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    getPermissionsData(success,error){ //获取所有权限数据
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getBaseRoute()}/permission`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'permission_data', (data,res)=>{
            success && success(data,res);
          }, error));
    }
    getPermissionsDataByOrgaId(organizationId,success,error){ //获取某个组织拥有的权限数据
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getBaseRoute()}/permission/${organizationId}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'permission_by_orga', (data,res)=>{
            success && success(data,res);
          }, error));
    }
    updatePermissionsDataByOrgaId(organizationId,params,success,error){
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getBaseRoute()}/permission/${organizationId}/update`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'update_permission_by_orga', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    // FileInformation

    // search file info
    getSearchFileInfo(params, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/searchfileinfo`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'getSearchFileInfo', success, error));
    }
    // 获取单个人员的档案信息
    getDocumentInfoById(docId, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          get(`${this.getfileInformationUrl()}/detail/?id=${docId}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'getUserInfo', success, error));
    }
    // create file info
    createFileInfo(params, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/createfileinfo`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'createFileInfo', success, error));
    }

    // update file info
    updateFileInfo(params, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/updatefileinfo`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'updateFileInfo', success, error));
    }

    // delete selectd file info by id
    deleteFileInfo(id, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/deletefileinfo`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(id).
          end(this.handleResponse.bind(this, 'deleteFileInfo', success, error));
    }
    deleteFileInfoAll(params,success,error){ //删除所有档案，根据模板类型来删。
      this.defaultHeaders[HEADER_TOKEN] = localStorage.getItem(this.tokenName);
      request.
          post(`${this.getfileInformationUrl()}/deleteFileInfoFor`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'deleteFileInfoFor_all', (data,res)=>{
            success && success(data,res);
          }, error));
    }

    // search file info family member
    getSearchFileFamilyMember(params, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/searchfamilymember`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(params).
          end(this.handleResponse.bind(this, 'getSearchFileFamilyMember', success, error));
    }

    // create file info family member
    createFileFamilyMember(id, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/createfamilymember`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(id).
          end(this.handleResponse.bind(this, 'createFileFamilyMember', success, error));
    }

    // update file info family member
    updateFileFamilyMember(id, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/updatefamilymember`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(id).
          end(this.handleResponse.bind(this, 'updateFileFamilyMember', success, error));
    }

    //delete file info  family member by id
    deleteFileFamilyMember(id, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          post(`${this.getfileInformationUrl()}/deletefamilymember`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          send(id).
          end(this.handleResponse.bind(this, 'deleteFileFamilyMember', success, error));
    }

    //get file info department
    getFileDepartment(org, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
      request.
          get(`${this.getfileInfoDepartmentImportUrl(org)}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'getFileDepartment', success, error));
    }

    // blacklist
    getBlacklist(offset, limit, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          post(`${this.getBlacklistRoute()}/${offset}/${limit}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'getBlacklist', success, error));
    }

    // not in blacklist
    getNotInBlacklist(offset, limit, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          post(`${this.getBlacklistRoute()}/not_in/${offset}/${limit}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'getNotInBlacklist', success, error));
    }

    // add blacklist user
    addBlacklistUser(userId, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          get(`${this.getBlacklistRoute()}/${userId}/add`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'addBlacklistUser', success, error));
    }

    // delete blacklist user
    deleteBlacklistUser(userId, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          get(`${this.getBlacklistRoute()}/${userId}/delete`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'deleteBlacklistUser', success, error));
    }

    // get user info
    getUserInfo(userId, success, error) {
      this.defaultHeaders[HEADER_TOKEN] = this.getToken();
        request.
          get(`${this.getUserRouteV4()}/${userId}`).
          set(this.defaultHeaders).
          type('application/json').
          accept('application/json').
          use(nocache).
          end(this.handleResponse.bind(this, 'getUserInfo', success, error));
    }
    getProfilePictureUrl(id, lastPictureUpdate) {
        let url = `${this.getUsersRoute()}/${id}/image`;
        if (lastPictureUpdate) {
            url += `?time=${lastPictureUpdate}`;
        }
        return url;
    }
    sendTelephoneMessage(params, success,error){
      $.ajax({
          url : `${this.url}${this.urlVersion4}/sms/send`,
          type:'POST',
          data : params,
          async : true,
          cache:false,
          xhrFields: {
              withCredentials: true
          },
          crossDomain: true,
          success : (data)=>{
            success && success(data);
          }
        });
    }

}

var myWebClient = new MyWebClient();
export default myWebClient;
