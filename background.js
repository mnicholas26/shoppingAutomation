chrome.runtime.onInstalled.addListener(function (){
    chrome.browserAction.onClicked.addListener(function() { 
        chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
    });
});

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "etsy" || port.name == "test")
    {
        if(port.name == "test")
        {
            port.onMessage.addListener(function(msg)
            {
                console.log(msg);
                if(msg == "ready")
                {
                    port.postMessage("test");
                }
            });
        }   
    }
  });

/*chrome.runtime.onMessage.addListener(function(message){
    //console.log(message);
    //document.body.innerHTML = message;
    chrome.runtime.sendMessage("go");
    if(message == "etsy-start")
    {
        chrome.runtime.sendMessage("setup");
    }
    else
    {
        document.body.innerHTML = message;
    }
});*/