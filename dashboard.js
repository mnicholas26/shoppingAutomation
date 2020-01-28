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
        if(result.titles.length > 0)
        {
            //use commas in query selector all to grab all appropriate widgets
            let widgets = document.querySelectorAll('.titletest');
            for(let i = 0; i < widgets.length; i++)
            {
                widgets[i].update(result.titles)
            }
        }
    });
}


//page constuction and link up
window.onload = importTemplates;
var tabs = [];
var tabbtns = [];
var currenttabindex = 0;
var templates = [];
var templateindex = 0;
var template = {};
/*dev mode*/
var dev = true;

function importTemplates()
{
    chrome.storage.local.get({'templates': []}, (result) => {
        if(result.templates.length > 0)
        {
            templates = result.templates;
            chrome.storage.local.get({'templateindex': 0}, (result) => {
                templateindex = result.templateindex;
                //error checking
                //if(templateindex > templates.length) templateindex = 0;
                template = templates[templateindex];
                setupApp()
            } )
        }
        else
        {
            //do default
            fetch('template.json')
            .then((response) => {
                return response.json();
            })
            .then((jsontemplate) => {
                template = jsontemplate;
                templates.push(template);
                setupApp();
            });
        }
    });
}

function setupApp()
{
    let tabbtnselem = document.getElementById('tabbtns');
    let tabselem = document.getElementById('tabs');
    //setup tabs
    for(let i = 0; i < template.tabs.length; i++)
    {
        let tab = template.tabs[i];
        let tabelem = document.createElement('div');
        tabelem.classList.add('tab');
        let tabbutton = document.createElement('button');
        tabbutton.innerText = tab.title;
        let sidebarelem = document.createElement('div');
        sidebarelem.classList.add('sidebar');
        let pageselem = document.createElement('div');
        pageselem.classList.add('pages');
        if(template.defaulttab == i)
        {
            tabelem.classList.add('tabvisible');
            tabbutton.classList.add('activetabbtn');
            currenttabindex = i;
        }
        tabelem.pages = []
        tabelem.btns = [];
        tabs.push(tabelem);
        tabbtns.push(tabbutton);
        //make pages
        for(let j = 0; j < tab.pages.length; j++)
        {
            let page = tab.pages[j];
            let pageelem = document.createElement('div');
            pageelem.classList.add('page');
            let pagebutton = document.createElement('button');
            pagebutton.innerText = page.title;
            if(tab.defaultpage == j)
            {
                pageelem.classList.add('pagevisible');
                pagebutton.classList.add('activepagebtn');
                tabelem.currentpageindex = j;
            }
            tabelem.pages.push(pageelem);
            tabelem.btns.push(pagebutton);
            pagebutton.addEventListener('click', () => {
                if(tabelem.currentpageindex == j) return;
                tabelem.pages[tabelem.currentpageindex].classList.remove("pagevisible");
                pageelem.classList.add("pagevisible");
                tabelem.btns[tabelem.currentpageindex].classList.remove("activepagebtn");
                pagebutton.classList.add("activepagebtn");
                tabelem.currentpageindex = j;
            });
            for(let k = 0; k < page.widgets.length; k++)
            {
                widgetFactory(window[page.widgets[k]], pageelem);
            }
            sidebarelem.appendChild(pagebutton);
            pageselem.appendChild(pageelem);
        }
        tabbutton.addEventListener('click', () => {
            if(i == currenttabindex) return;
            tabs[currenttabindex].classList.remove("tabvisible");
            tabelem.classList.add("tabvisible");
            tabbtns[currenttabindex].classList.remove("activetabbtn");
            tabbutton.classList.add("activetabbtn");
            currenttabindex = i;
        });
        tabelem.appendChild(sidebarelem);
        tabelem.appendChild(pageselem);
        tabbtnselem.appendChild(tabbutton);
        tabselem.appendChild(tabelem);
    }
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