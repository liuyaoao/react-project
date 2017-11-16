import IntlMessageFormat from 'intl-messageformat';
import {intl_language_key} from '../reactWM_lib/models/Constants';
import zh from './zh';
import en from './en';
const MESSAGES = { en, zh };
const LOCALE = localStorage.getItem(intl_language_key) || "en"; // -> 这里写上你的决定语言的方法，例如可以从cookie判断语言

const Intl = {

  get:(key, defaultMessage, options={})=>{
    let msg = MESSAGES[LOCALE][key];
    if (msg == null) {
      if (defaultMessage != null) {
        return defaultMessage;
      }
      return key;
    }
    if (options) {
      msg = new IntlMessageFormat(msg, LOCALE);
      return msg.format(options);
    }
    return msg;
  }

}

export default Intl;
