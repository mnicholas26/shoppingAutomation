var port = chrome.runtime.connect({ name: "dashboard" });
port.postMessage({msg: "page opened"});
port.onMessage.addListener(function (msg) 
{
    console.log(msg);
    if(msg == "setup")
    {
        //document.body.innerText = "ready";
        //titlesFromStorage();
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



//page constuction and link up
window.onload = setupApp;
var tabs = [];
var currenttabindex = 0;
var pages = [];
var currentpageindex = 0;
/*dev mode*/
var dev = true;

function setupApp()
{
    //stuff
    setupTabs();
}

function setupTabs(){
    tabs = document.querySelectorAll('.tab');
    setupTabBtns();
    for(let i = 0; i < tabs.length; i++)
    {
        setupPages(i);
    }
}

function setupTabBtns()
{
    let tabbtns = document.querySelectorAll('#tabbtns button');
    if(dev && (tabbtns.length != tabs.length)) 
    {
        alert('number of tabs mismatch with number of tab buttons');
        return;
    }
    for(let i = 0; i < tabs.length; i++)
    {
        tabbtns[i].addEventListener('click', () => {switchTab(i)});
        tabbtns[i].index = i;
    }
}

function switchTab(index)
{
    if(index == currenttabindex) return;
    tabs[currenttabindex].classList.remove("tabvisible");
    tabs[index].classList.add("tabvisible");
    currenttabindex = index;
}

/*function setupPages(index)
{
    let sidebarbtns = tabs[index].querySelectorAll('#sidebars button');
    tabs[index].pages = tabs[index].querySelectorAll('.page');
    tabs[index].currentpageindex = 0;
    //at least for time being (doesnt take into account settings page or in general any page not linked to tab)
    for(let i = 0; i < sidebarbtns.length; i++)
    {
        sidebarbtns[i].addEventListener('click', () => {
            if(currentpageindex == i) return;
            pages[currentpageindex].classList.remove("pagevisible");
            pages[i].classList.add("pagevisible");
            currentpageindex = i;
        });
    }
}*/

function setupPages(index)
{
    let sidebarbtns = tabs[index].querySelectorAll('.sidebar button');
    tabs[index].pages = tabs[index].querySelectorAll('.page');
    tabs[index].currentpageindex = 0;
    for(let i = 0; i < sidebarbtns.length; i++)
    {
        sidebarbtns[i].addEventListener('click', () => {
            if(tabs[index].currentpageindex == i) return;
            tabs[index].pages[tabs[index].currentpageindex].classList.remove("pagevisible");
            tabs[index].pages[i].classList.add("pagevisible");
            tabs[index].currentpageindex = i;
        });
    }
}

/*function setupPages()
{
    let sidebarbtns = document.querySelectorAll('#sidebars button');
    let pages = document.querySelectorAll('.page');
    let pageswrapper = document.getElementById('pages');
    pageswrapper.pages = pages;
    pageswrapper.currentpage = 0;
    pages[0].classList.add("pagevisible");
    //at least for time being (doesnt take into account settings page or in general any page not linked to tab)
    for(let i = 0; i < sidebarbtns.length; i++)
    {
        sidebarbtns[i].addEventListener('click', () => {
            if(pageswrapper.currentpage == i) return;
            else 
            {
                pageswrapper.pages[pageswrapper.currentpage].classList.remove("pagevisible");
                pages[i].classList.add("pagevisible");
                pageswrapper.currentpage = i;
            }
        });
    }
}*/