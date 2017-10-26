var Utils = {};

Object.defineProperty(Utils, 'getChannelMenu', {
	value: function(band) {
    var channelArr = [];
    if (!band) {
      return;
    }
    if (band == 2) {
      for (var i = 0; i < 14; i++) {
        channelArr.push(i + 1);
      }
    }else if (band == 5) {
      for (var i = 17; i < 32; i++) {
        channelArr.push((i + 1) * 2);
      }
      for (var i = 0; i < 30; i++) {
        if (i < 23) {
          channelArr.push(100 + i * 2);
        }else {
          channelArr.push(149 + (i - 23) * 2);
        }
      }
      var arr = [165, 183, 184, 185, 187, 188, 189, 192, 196];
      for (var i = 0; i < arr.length; i++) {
        channelArr.push(arr[i]);
      }
    }
    return channelArr;
	}
});

Object.defineProperty(Utils, 'generateUuid', {
	value: function(len) {
    // var len = 32; //32长度
    var radix = 16; //16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
	}
});

Object.defineProperty(Utils, 'verifyIpAddress', {
	value: function(ip, key) {
		var re = null;
		if (!key) {
			re=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		} else {
			switch (key) {
				case 1:
					re = /^(10.100.10.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[2-9]))$/;
					break;
				case 2:
					re = /^(10.100.11.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[2-9]))$/;
					break;
				case 3:
					re = /^(10.100.12.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[2-9]))$/;
					break;
				case 4:
					re = /^(10.100.13.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[2-9]))$/;
					break;
				case 5:
					re = /^(10.100.14.(25[0-4]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[2-9]))$/;
					break;
				default:

			}
		}
		// console.log(re.test(ip));
    return re.test(ip);
	}
});

Object.defineProperty(Utils, 'formatDateTimeString', {
	value: function(date) {
    if (date) {
      date = new Date(date);
    }else {
      date = new Date();
    }
    date = date.toDateString() + ' ' + date.toTimeString().split(' ')[0];
		return date;
	}
});

Object.defineProperty(Utils, 'getFileIcon', {
	value: function(type) {
		var icon = 'file-text';
    switch (type) {
      case 'HTML':
        icon = 'file-code'
        break;
      default:
        break;
    }
    return icon;
	}
});

export default Utils;
