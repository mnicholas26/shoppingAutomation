chrome.runtime.onInstalled.addListener(function (){
    chrome.browserAction.onClicked.addListener(function() { 
        chrome.tabs.create({ url: chrome.runtime.getURL("dashboard.html") });
    });
});

var dashboardport = {};

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "etsy" || port.name == "test" || port.name == "dashboard")
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
                        chrome.storage.local.set({'titles': titles}, () => {
                            console.log("saved titles");
                        });
                        dashboardport.postMessage("titles updated");
                        /*for(let i = 0; i < titles.length; i++)
                        {
                            let item = document.createElement('p');
                            item.textContent = titles[i];
                            document.body.appendChild(item);
                        }*/
                    }
                }
            });
        }
        else if(port.name == "dashboard")
        {
            dashboardport = port;
            port.onMessage.addListener(function(msg)
            {
                console.log(msg);
                if(msg.msg == "page opened"){
                    port.postMessage("setup");
                }
            });
        }
    }
  });