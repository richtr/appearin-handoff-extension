opera.isReady(function() {
  var apiVersion = window["apiVersion"] = 5;
  var baseUrl = window["baseUrl"] = 'https://chrometophone.appspot.com';
  var sendUrl = window["sendUrl"] = baseUrl + '/send?ver=' + apiVersion;

  var STATUS_SUCCESS = window["STATUS_SUCCESS"] = 'success';
  var STATUS_LOGIN_REQUIRED = window["STATUS_LOGIN_REQUIRED"] = 'login_required';
  var STATUS_DEVICE_NOT_REGISTERED = window["STATUS_DEVICE_NOT_REGISTERED"] = 'device_not_registered';
  var STATUS_NO_TAB_ACCESS = window["STATUS_NO_TAB_ACCESS"] = 'no_tab_access';
  var STATUS_GENERAL_ERROR = window["STATUS_GENERAL_ERROR"] = 'general_error';

  var channel = window["channel"];
  var socket = window["socket"];
  var req = window["req"] = new XMLHttpRequest();

  function sendToPhone(data, listener) {
    req.open('POST', sendUrl, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('X-Same-Domain', 'true');
    req.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (req.status == 200) {
          var body = req.responseText;
          if (body.indexOf('OK') == 0) {
            listener(STATUS_SUCCESS);
          } else if (body.indexOf('LOGIN_REQUIRED') == 0) {
            listener(STATUS_LOGIN_REQUIRED);
          } else if (body.indexOf('DEVICE_NOT_REGISTERED') == 0) {
            listener(STATUS_DEVICE_NOT_REGISTERED);
          }
        } else {
          listener(STATUS_GENERAL_ERROR);
        }
      }
    };
    var postData = '';
    for (var key in data) {
      if (postData.length > 1) postData += '&';
      if (data[key] !== null) postData += key + '=' + encodeURIComponent(data[key]);
    }
    req.send(postData);
  }
  var sendToPhone = window["sendToPhone"] = sendToPhone;
});
