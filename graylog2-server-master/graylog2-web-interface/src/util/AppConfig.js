const AppConfig = {
  gl2ServerUrl() {
    // return '';//打包时用   window.appConfig.gl2ServerUrl
    return 'http://demo.deeplog.com';//220.168.30.10:12900, 220.168.30.12:10083, 192.168.9.163:8080, sv.deeplog.com， demo.deeplog.com, 192.168.7.20:8080
  },

  gl2AppPathPrefix() {
    return '';//window.appConfig.gl2AppPathPrefix
  },

  rootTimeZone() {
    return 'Europe/Berlin';//window.appConfig.rootTimeZone
  },
};

export default AppConfig;
