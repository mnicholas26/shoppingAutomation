var setup = false;
var port = chrome.runtime.connect({ name: "test" });
port.postMessage({page: "reddit/top", msg: "ready"});
port.onMessage.addListener(function (msg) 
{
    console.log(msg);
    if (msg == "setup" && !setup)
    {
        setup = true;
        //document.getElementById()
        let buttonLocation = document.getElementsByClassName("menuarea")[0];
        buttonLocation.appendChild(makeButtons());
        //start building buttons and shit
    }
    else if (msg == "scrape")
    {
        //continue scraping
    }
});

function makeButtons()
{
    let buttons = document.createElement("div");
    let scrapebtn = document.createElement("button");
    scrapebtn.textContent = "SCRAPE";
    scrapebtn.addEventListener('click', () => {
        let titles = basicScrape();
        port.postMessage({page: "reddit/top", msg: "sending titles", content: titles});
    })
    buttons.appendChild(scrapebtn);
    return buttons;
}

function basicScrape()
{
    let titles = document.querySelectorAll('a.title');
    let output = Array.from(titles).map((x) => x.textContent);
    return output;
}