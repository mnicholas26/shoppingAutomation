chrome.runtime.sendMessage("etsy-start").then(testy);
/*chrome.runtime.onMessage.addListener(function(message){
    if(message == "setup")
    {
        chrome.runtime.sendMessage(document.title);
    }
});*/

function testy(setup)
{
    if(setup)
    {
        chrome.runtime.sendMessage(document.title);
    }
}