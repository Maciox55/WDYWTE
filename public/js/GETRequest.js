var buttons = document.getElementsByClassName("btn");
for(var i = 0; i<buttons.length;i++)
{
    buttons[i].addEventListener("click",function(e){
        e = e || window.event;
        var target = e.toElement;
        console.log(target.parentElement.parentElement.getElementsByClassName('res')[0].getAttribute("action"));
        //window.location.href = target.parentElement.parentElement.getElementsByClassName('res')[0].getAttribute("action");
        httpGet(target.parentElement.parentElement.getElementsByClassName('res')[0].getAttribute("action"));
    },false);

}





function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST",url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};