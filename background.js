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
                if(msg.page == "reddit/top")
                {
                    if(msg.msg == "ready")
                    {
                        port.postMessage("setup");
                    }
                    else if (msg.msg == "sending titles")
                    {
                        let titles = msg.content;
                        for(let i = 0; i < titles.length; i++)
                        {
                            let item = document.createElement('p');
                            item.textContent = titles[i];
                            document.body.appendChild(item);
                        }
                    }
                }
            });
        }   
    }
  });