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
        //titlesFromStorage();
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
    /*if(parent == undefined) parent = document.body;
    chrome.storage.local.get({'titles': []}, (result) => {
        if(result.titles.length > 0) renderTitles(result.titles, parent);
    });*/
    chrome.storage.local.get({'titles': []}, (result) => {
        if(result.titles.length > 0)
        {
            let widgets = document.querySelectorAll('.titletest');
            for(let i = 0; i < widgets.length; i++)
            {
                widgets[i].update(result.titles)
            }
        }
    });
}

function renderTitles(titles, parent)
{
    clearTitles(parent);
    for(let i = 0; i < titles.length; i++)
    {
        let item = document.createElement('p');
        item.textContent = titles[i];
        parent.appendChild(item);
    }
}

/*function clearTitles(parent)
{
    while(parent.firstChild)
    {
        parent.removeChild(parent.firstChild);
    }
}*/



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
    let tabbtns = document.querySelectorAll('#toolbar button');
    if(dev && (tabbtns.length != tabs.length)) 
    {
        alert('number of tabs mismatch with number of tab buttons');
        return;
    }
    for(let i = 0; i < tabs.length; i++)
    {
        tabbtns[i].addEventListener('click', () => {
            if(i == currenttabindex) return;
            tabs[currenttabindex].classList.remove("tabvisible");
            tabs[i].classList.add("tabvisible");
            tabbtns[currenttabindex].classList.remove("activetabbtn");
            tabbtns[i].classList.add("activetabbtn");
            currenttabindex = i;
        });
    }
}

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
            sidebarbtns[tabs[index].currentpageindex].classList.remove("activepagebtn");
            sidebarbtns[i].classList.add("activepagebtn");
            tabs[index].currentpageindex = i;
        });
    }
    let elem1 = document.getElementById('currenttest');
    widgetFactory(widgetTitleTest, elem1);
}

function widgetTitleTest(settings)
{
    let wrapper = document.createElement('div');
    wrapper.classList.add('titletest');
    function clearTitles()
    {
        while(wrapper.firstChild){
            wrapper.removeChild(wrapper.firstChild);
        }
    }

    function renderTitles(titles)
    {
        for(let i = 0; i < titles.length; i++)
        {
            let item = document.createElement('p');
            item.textContent = titles[i];
            wrapper.appendChild(item);
        }
    }

    function update(titles)
    {
        clearTitles();
        renderTitles(titles);
    }

    function start()
    {
        titlesFromStorage();
    }

    wrapper.update = update;
    wrapper.start = start;
    return wrapper;
}

function widgetFactory(widget, parent, settings)
{
    let newwidget = widget(settings);
    parent.appendChild(newwidget);
    newwidget.start();
}