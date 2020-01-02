var port = chrome.runtime.connect({ name: "dashboard" });
port.postMessage({msg: "page opened"});
port.onMessage.addListener(function (msg) 
{
    console.log(msg);
    if(msg == "setup")
    {
        document.body.innerText = "ready";
        titlesFromStorage();
    }
    else if(msg == "titles updated")
    {
        titlesFromStorage();
    }
    else if(msg == "make active")
    {
        chrome.tabs.getCurrent(function(t) {
            chrome.tabs.update(t.id, {'highlighted': true});
        });
        chrome.windows.getCurrent(function(w){
            chrome.windows.update(w.id, {'focused': true});
        });
    }
});

function titlesFromStorage()
{
    chrome.storage.local.get({'titles': []}, (result) => {
        if(result.titles.length > 0) renderTitles(result.titles);
    });
}

function renderTitles(titles)
{
    clearTitles();
    for(let i = 0; i < titles.length; i++)
    {
        console.log(titles[i]);
        let item = document.createElement('p');
        item.textContent = titles[i];
        document.body.appendChild(item);
    }
}

function clearTitles()
{
    while(document.body.firstChild)
    {
        document.body.removeChild(document.body.firstChild);
    }
}