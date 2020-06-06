var components=[];
var wires=[];
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");

   var styles = 'border: 2px solid black; '
        + 'width: ' + length + 'px; '
        + 'height: 0px; '
        + '-moz-transform: rotate(' + angle + 'rad); '
        + '-webkit-transform: rotate(' + angle + 'rad); '
        + '-o-transform: rotate(' + angle + 'rad); '
        + '-ms-transform: rotate(' + angle + 'rad); '
        + 'position: absolute; '
        + 'top: ' + y + 'px; '
        + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);
    line.setAttribute("class","line");
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}

function drawLines() {
    var lines=document.getElementsByClassName("line");
    for (var i=0;i<lines.length;i++){
        document.getElementById("simDesk").replaceChild(wires[i].wireLine(),lines[i]);
    }

}
setInterval(drawLines,10);

class Wire {

    constructor(from,to) {
        var list=document.getElementById("list");
        this.from=from;
        this.to=to;
        var li=document.createElement("LI");
        var text = document.createTextNode(this.info());

        li.appendChild(text);
        list.appendChild(li);
        document.getElementById("simDesk").appendChild(this.wireLine());

    }

    info(){

        return components[this.from].info()+" → "+components[this.to].info();
    }

    wireLine(){
        var x1, y1,x2,y2;
        var comp1=document.getElementById(components[this.from].id).getBoundingClientRect();
        var comp2=document.getElementById(components[this.to].id).getBoundingClientRect()
        if(comp1.width>comp1.height){
            x1=comp1.x+(comp1.width-1);
            y1=comp1.y+(comp1.height/2);

        }else {
            x1 = comp1.x + (comp1.width / 2);
            y1 = comp1.y;
        }
        if (components[this.to].type==="source"){
            x2=comp2.x+(comp2.width/2);
            y2=comp2.y+(comp2.height);
        }else
            if (comp2.width>comp2.height){
                x2=comp2.x;
                y2=comp2.y+(comp2.height/2);
            }else {
                x2=comp2.x+(comp2.width/2);
                y2=comp2.y;
            }

        return createLine(x1,y1,x2,y2);
    }

}

class Component {
    constructor(type,value,id) {
        var select1=document.getElementById("from");
        var select2=document.getElementById("to");
        this.type=type;
        this.value=value;
        this.id=id;

        var opt = this.info();

        var el1= document.createElement("option"),el2 = document.createElement("option");

        el1.textContent = opt;
        el2.textContent = opt;
        el1.value = id;
        el2.value = id;

        select1.appendChild(el1);
        select2.appendChild(el2);
    }

    info(){
        switch (this.type) {
            case "resistor": return "R"+this.id;
            case "source": return "S"+this.id;
            case "ground":return "G"+this.id;
            default:return this.id;
        }
    }
    
}
function addWire() {
    var first = document.getElementById("from").value;
    var second = document.getElementById("to").value;
    wires.push(new Wire(first, second));

}

function openDialog() {
    var dialog=document.getElementById("wireDialog");
    var span = document.getElementsByClassName("close")[0];
    dialog.style.display="block";
    span.onclick = function() {
        dialog.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == dialog) {
            dialog.style.display = "none";
        }
    }


    for(var i = 0; i < components.length; i++) {

    }
   //setInterval(showWires,100);
}

function addComponent(componentType,value) {
    var img="img/" +componentType+ value +".svg";
    var componentId=components.length;


    $("#simDesk").append($('<img>',{id:componentId, class:componentType, src:img,draggable:true }));

    components.push(new Component(componentType,value,componentId));


}


function openTab(evt, componentName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(componentName).style.display = "block";
    evt.currentTarget.className += " active";
}