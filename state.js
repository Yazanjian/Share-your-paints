var socket;
var usersNamesList = new Array();
var name;
socketInit = (userName,canvas) => {
    // Create WebSocket connection.
    socket = new WebSocket('ws://t2k.azurewebsites.net/painter.ashx?appid=Exalt');
    // Connection opened
    let initObj = { 
        isNew:true,
        name:userName
    };
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify(initObj));
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        var object = JSON.parse(event.data);
        console.log(object);

        if(object.isNew){ //for testing new sockets
            usersNamesList.push(object.name);
            var ul = document.getElementById("usersList");
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(object.name));
            ul.appendChild(li);
            socket.send(JSON.stringify({user:name}));
        }
        if(!object.isNew){ //for testing old objects and draw lines
            drawFromOtherCanvas(object.prevx, object.prevy, object.x, object.y, object.lineColor);
        }
        if(object.user){   //for sending the names list for any old object
            if(!usersNamesList.includes(object.user)){
                usersNamesList.push(object.user);
                var ul = document.getElementById("usersList");
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(object.user));
                ul.appendChild(li);
            }
        }
        if(object.close){
            let index = usersNamesList.indexOf(object.name);
            usersNamesList[index] = object.name + " is Disconnected!";
            var ul = document.getElementById("usersList");
            ul.innerHTML="";
            usersNamesList.map((user) => {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(user));
                ul.appendChild(li);
            })
        }
    });

    // socket.addEventListener('close', function (event) {
    //     console.log('The connection has been closed successfully.');
    // });
}

//for closing
window.addEventListener('beforeunload', function(event) {
    console.log('I am the 1st one.');
    socket.send(JSON.stringify({close:true, name:name}))
});


const PageState = function (){
    let currentState = new loginPage();

    this.init = function() {
        this.change( new loginPage());
    }

    this.change = function (state) {
        currentState = state; 
    }
} 

//login page
const loginPage = function(){
    document.querySelector("#loginContainer").innerHTML = `
    <form class="loginForm" onSubmit="goToTheSecondPage()">
        <div class="login">
            <label for="name">Enter your name</label>
            <input type="text" id="name" placeholder="Enter your name">
        </div>
        <button id="loginBtn" type="submit" value="Submit" >Go</button>
    </form>`
}; 



//to get the value of input element and use it in the home page
// var name = document.getElementById("#name"); 
// addEventListener('change', (e) => {
//     name = e.target.value;
// });

// home page
const homePage = function(){
    document.querySelector("#loginContainer").innerHTML = ``;
    document.getElementById("loginContainer").style.display="none";
    document.querySelector("#canvasContainer").innerHTML =
    `<div class="titleBar">
        <h1> hello ${name} from home page</h1>
    </div>
    <div class="canvasAndUsers">
        <canvas id="myCanvas" class="myCanvas" height="300px" width="350px"></canvas>
        <div class="colorpicker">
            <div class="color" style="background: rgb(255, 0, 0);" id='c1' onClick="selectColor(this.id)"></div>
            <div class="color" style="background: rgb(255, 64, 0);" id='c2' onClick="selectColor(this.id)"></div>
            <div class="color" style="background: rgb(255, 128, 0);" id='c20' onClick='selectColor(this.id)'"></div>
            <div class="color" style="background: rgb(255, 192, 0);" id='c3' onClick='selectColor(this.id)'"></div>
            <div class="color" style="background: rgb(255, 255, 0);" id='c4' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 255, 0);" id='c5' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(64, 255, 0);" id='c6' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(128, 255, 0);" id='c7' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(192, 255, 0);" id='c8' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 0, 255);" id='c9' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 64, 255);" id='c10' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 128, 255);" id='c11' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 192, 255);" id='c12' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 255, 255);" id='c13' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(128, 0, 255);" id='c14' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(192, 0, 255);" id='c15' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(255, 0, 255);" id='c16' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(192, 192, 192);" id='c17' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(128, 128, 128);" id='c18' onClick='selectColor(this.id)'></div>
            <div class="color" style="background: rgb(0, 0, 0); " id='c19' onClick='selectColor(this.id)'></div>
        </div>
        <div class="users">
            <h4> Online Users: </h4>
            <ul id="usersList">
            </ul>
        </div>
    </div>`;

    canvasInit();
}



let page = new PageState();
page.init();


// const loginBtn = document.getElementById("loginBtn");
// loginBtn.addEventListener('click' , (e) => {
//     page.change(new homePage());
//     e.preventDefault; 
//     // to call the socket:
//     socketInit(name);
// });


//canvas functions:

//function to select the color needed for the drawing:
var lineColor;
var selectedBox=null;
selectColor = (e) => {
    console.log(selectedBox);
    if(selectedBox){
        document.getElementById(selectedBox).style.border = "0px solid"
    }
    selectedBox =  document.getElementById(`${e}`).id;
    document.getElementById(`${e}`).style.border = "1px solid #000000"
    lineColor = document.getElementById(`${e}`).style.backgroundColor;
}

//global variables for canvas:
var canvas;
var context;
var flag =false;
var prevx, prevy,x,y;

//init function to handle the movement of the cursor
canvasInit = () => {
    canvas = document.getElementById('myCanvas');
    //to draw on the canvas:
    context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function(evt) {
        flag=true;
        var mousePos = getMousePos(canvas, evt);
        x=mousePos.x;
        y=mousePos.y;
    });
    canvas.addEventListener("mouseup", function (e) {
        flag=false;
        prevx=prevy=x=y=0;
    });
    canvas.addEventListener("mousemove", function (evt) {
       if(flag){
            prevx=x;
            prevy=y;
            var mousePos = getMousePos(canvas, evt);
            x=mousePos.x;
            y=mousePos.y;
            draw(canvas,prevx,prevy,x,y);
       }
    });
}



draw = (canvas,prevx,prevy, x ,y) => {
    //to draw the same point in different pages using sockets:
    let initObj = { 
        isNew:false,
        prevx: prevx, 
        prevy: prevy,
        x:x,
        y,y,
        lineColor:lineColor
    };
    socket.send(JSON.stringify(initObj));

    //to draw the line in the same page :
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(prevx,prevy);
    ctx.lineTo(x,y);
    ctx.stroke();
}

drawFromOtherCanvas = (prevx,prevy, x ,y,lineColor) => {
    canvas = document.getElementById('myCanvas');
    //to draw on the canvas:
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(prevx,prevy);
    ctx.lineTo(x,y);
    ctx.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


//to get the value of input element and use it in the home page
// put it here to send the canvas after the init
function goToTheSecondPage(){
    //name is defined at the top of the file because we need it to compare the name with users names
    name = document.getElementById("name").value;
    if(name){
        page.change(new homePage());
        // to call the socket:
        socketInit(name, canvas);
    }
}
