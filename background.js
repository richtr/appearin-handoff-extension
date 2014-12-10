opera.isReady(function() {

  function onMessage(message) {
    var currentTab = opera.extension.tabs.getFocused();
    switch (message.data.action) {
    case 'send_to_phone':
      var pageData = message.data.data || {};
      if (currentTab) {
        var data = {
          title: pageData.title || currentTab.title,
          url: pageData.link || currentTab.url,
          sel: null
        };
        sendToPhone(data, function(statusMsg) {
          opera.extension.broadcastMessage({
            action: statusMsg
          });
        });
      } else {
        opera.extension.broadcastMessage({
          action: 'no_tab_access'
        });
      }
      break;
    case 'open_tab':
      if (message.data.data && message.data.data.url) {
        var tabData = {
          url: message.data.data.url,
          focused: true
        };
        opera.extension.tabs.create(tabData);
      }
      break;
    case 'close_tab':
      if (currentTab) currentTab.close();
      break;
    }
  }
  var onMessage = window["onMessage"] = onMessage;
  opera.extension.addEventListener('message', onMessage, false);

});
