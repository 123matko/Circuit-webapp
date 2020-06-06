var components=[];
var wire=[];

class Component {
    constructor(type,value,id) {
        this.type=type;
        this.value=value;
        this.id=id;
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
    var select1=document.getElementById("from");
    var select2=document.getElementById("to");

    for(var i = 0; i < components.length; i++) {
        var opt = components[i].info();
        var id=components[i].id;
        var el1= document.createElement("option"),el2 = document.createElement("option");

        el1.textContent = opt;
        el2.textContent = opt;
        el1.value = id;
        el2.value = id;

        select1.appendChild(el1);
        select2.appendChild(el2);

    }

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