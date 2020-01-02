chrome.runtime.onInstalled.addListener(function (){
    chrome.browserAction.onClicked.addListener(function() { 
        chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
    });
});

chrome.runtime.onMessage.addListener(function(message){
    //console.log(message);
    /*if(message == "etsy-start")
    {
        chrome.runtime.sendMessage("setup");
    }
    else
    {
        document.body.innerHTML = message;
    }*/
});