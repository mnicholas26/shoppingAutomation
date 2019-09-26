function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

function getButtons()
{
    let allbtns = document.querySelectorAll('button.unstyled-button');
    let btns = [];
    for(let i = 0; i < allbtns.length; i++)
    {
        let child = allbtns[i].children[0];
        if(child.textContent == 'Ship to')
        {
            btns.push(allbtns[i]);
        }
    }
    return btns;
}

function grabAdresses(btns)
{
    for(let i = 0; i < btns.length; i++)
    {
        simulate(btns[i], 'click');
        let addressblob = btns[i].nextElementSibling.children[0].children[0].children[0].children;
        for(let j = 0; j < addressblob.length; j++)
        {
            if(addressblob[j].nodeName == "SPAN") 
            {
                /*let format1 = "\n";
                if(addressblob[j].classList.contains('city')
                    && addressblob[j+1].classList.contains('state')) format1 = ", ";
                textarea.value += addressblob[j].textContent + format1;*/
                if(addressblob[j].classList.contains('state'))
                {
                    if(addressblob[j].textContent.toLowerCase() == "n/a") continue;
                    if(addressblob[j].textContent.toLowerCase() == 
                        addressblob[j-1].textContent.toLowerCase()) continue;
                }
                outputstring += addressblob[j].textContent + "\n";
            }
        }
        outputstring += "\n";
    }
    nextPage();
}

function nextPage()
{
    let btns = document.querySelectorAll('div.btn-group');
    let pages = btns[1];
    let pagebutton = pages.children[pages.children.length-1];
    if(pagebutton.disabled) ;//createUI();
    else
    {
        simulate(pagebutton, 'click');
        timer = setInterval(() => {
            if(document.querySelector("div[data-test-id='order-group']") != null)
            {
                clearInterval(timer);
                grabAdresses(getButtons());
            }
        }, 1000);
    }
}

function createUI()
{
    var modal = document.createElement('div');
    modal.style.display = "flex";
    modal.style.position = 'fixed';
    modal.style.height = '100%';
    modal.style.width = '100%';
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.top = '0px';
    modal.style.left = '0px';
    modal.style.flexDirection = "row";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    var textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', '');
    textarea.style.height = '400px';
    textarea.style.width = '400px';
    textarea.value = outputstring;
    modal.appendChild(textarea);

    var button = document.createElement('button');
    button.style.height = '50px';
    button.style.width = '100px';
    button.textContent = "COPY";
    button.addEventListener('click', () => {
        textarea.select();
        document.execCommand('copy');
    });
    modal.appendChild(button);

    var closebtn = document.createElement('button');
    closebtn.style.height = '60px';
    closebtn.style.width = '60px';
    closebtn.style.position = 'fixed';
    closebtn.style.top = '20px';
    closebtn.style.right = '20px';
    closebtn.textContent = "X";
    closebtn.addEventListener('click', () => {
        modal.style.display = "none";
    });
    modal.appendChild(closebtn);
    document.body.appendChild(modal);
}

var timer;
var outputstring = "";
//grabAdresses(getButtons());