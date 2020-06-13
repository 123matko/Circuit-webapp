var components=[];
var wires=[];
function createLineElement(x, y, length, angle,id) {
    var line = document.createElement("div");
    line.setAttribute("id",id);
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
    var listElement=document.getElementsByClassName("listElement");
    if(lines.length<=0){
        return;
    }
    for (var i=0;i<lines.length;i++){
        document.getElementById("simDesk").replaceChild(wires[i].wireLine(),lines[i]);
        document.getElementById("list").replaceChild(wires[i].listElement(),listElement[i]);
    }

}
setInterval(drawLines,10);

class Wire {

    constructor(id,from,to) {
        let wiress=document.getElementById("wires");
        var list=document.getElementById("list");
        this.from=from;
        this.to=to;


        this.id=id;
        let el=document.createElement("option");
        el.textContent=this.info();
        el.value=this.id;
        el.setAttribute("class","optionElement");
        list.appendChild(this.listElement());
        document.getElementById("simDesk").appendChild(this.wireLine());
        wiress.appendChild(el);
    }

    listElement(){
        var text = document.createTextNode(this.info());
        var li=document.createElement("LI");
        li.appendChild(text);
        li.setAttribute("class","listElement");
        return li;
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
        var select3=document.getElementById("componentList");
        this.type=type;
        this.value=value;
        this.id=id;

        var opt = this.info();

        var el1= document.createElement("option"),el2 = document.createElement("option"),el3 = document.createElement("option");

        el1.textContent = opt;
        el2.textContent = opt;
        el3.textContent = opt;
        el1.value = id;
        el2.value = id;
        el3.value = id;
        el1.setAttribute("class","selE1");
        el2.setAttribute("class","selE2");
        el3.setAttribute("class","selE3");

        select1.appendChild(el1);
        select2.appendChild(el2);
        select3.appendChild(el3)
    }

    info(){
        switch (this.type) {
            case "resistor": return "R"+this.id;
            case "source": return "S"+this.id;
            case "ground":return "G"+this.id;
            default:return this.id;
        }
    }
    getValue(){
        return this.value;
    }
    
}
function addWire() {
    var first = document.getElementById("from").value;
    var second = document.getElementById("to").value;
    wires.push(new Wire(wires.length,first, second));

}

function removeWire() {
    var lines=document.getElementsByClassName("line");
    var listElement=document.getElementsByClassName("listElement");
    var options=document.getElementsByClassName("optionElement");
    var wire = document.getElementById("wires").value;
    wire=Number(wire);
    wires.splice(wire,1);
    document.getElementById("simDesk").removeChild(lines[wire]);
    document.getElementById("list").removeChild(listElement[wire]);
    document.getElementById("wires").removeChild(options[wire]);


}
function removeComponent() {
    var elem1=document.getElementsByClassName("selE1");
    var elem2=document.getElementsByClassName("selE2");
    var elem3=document.getElementsByClassName("selE3");
    var comps=document.getElementsByClassName("compObj");
    var com=document.getElementById("componentList").value;
    com=Number(com);
    components.splice(com,1);
    document.getElementById("simDesk").removeChild(comps[com]);
    document.getElementById("from").removeChild(elem1[com]);
    document.getElementById("to").removeChild(elem2[com]);
   document.getElementById("componentList").removeChild(elem3[com]);


}

function openDialog(id) {
    var dialog=document.getElementById(id);

    dialog.style.display="block";

    window.onclick = function(event) {
        if (event.target == dialog) {
            dialog.style.display = "none";
        }
    }

}

function simulate() {
    var sources=document.getElementsByClassName("source");
    var resistors=document.getElementsByClassName("resistor");
    var r=0;
    var u=0;

    for(var i=0;i<sources.length;i++){
        u+=Number(components[sources[i].id].getValue());
    }
    u=Number(u);
    document.getElementById("U").innerText=u+" V";
    for(var j=0;j<resistors.length;j++){
        r+=Number(components[resistors[j].id].getValue());
    }
    r=Number(r);
    document.getElementById("R").innerText=r+" Ω";
    var I=u/r;
    document.getElementById("I").innerText=parseFloat(I).toFixed(2)+" A";
}

function addComponent(componentType,value) {
    var img="img/" +componentType+ value +".svg";
    var componentId=components.length;
    var classs=" compObj";


    $("#simDesk").append($('<img>',{id:componentId, class:componentType+classs, src:img,draggable:true }));

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