var port = chrome.runtime.connect({name: "test"});
port.postMessage("ready");
port.onMessage.addListener(function(msg) {
    console.log(msg);
    if(msg == "test")
    {
        console.log("can start executing code");
    }
});