# Web Sockets and Socket.IO

## WebSocket Protocol

With HTTP, clients make requests and servers send responses.  This allows communication between the two, but what about when the server wants to send data to the client?  How can you enable two-way message passing?  

Enter WebSockets.

The WebSocket protocol is a design pattern that allows two way, (a.k.a. full-duplex), communication to happen freely between the client and the server.  To initialize the connection, the client sends a "WebSocket handshake request", and the server sends a "Websocket handshake response", which look like this:

```
GET /mychat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

Server response:

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

The handshake is similar to an HTTP request, so that servers can handle both HTTP connections and WebSocket connections.  This establishes a connection, which is 
also called a "socket".  Once connected, data can be sent 
back and forth.  The data sent is called "messages".

## Socket.IO

### Fallback Support for WebSockets

WebSockets are relatively new, and while it is supported in the most recent browsers, older browsers may have different or non-existent support for WebSockets. CanIUse has a nice [diagram of current support][caniuse-websockets].

Before WebSockets, there were other less efficient ways to simulate duplex communication, including AJAX long-polling.  Long-polling is when the browser 
sends an AJAX style request that keeps an open connection until the server has new information to send, at which point the server sends a response.  
After each response is received by the browser, it initiates another
 long-polling request to get any updates from the server.  
 
Socket.IO adds fallback support for WebSockets in browsers that don't 
support it, using long-polling and other techniques.

[caniuse-websockets]: http://caniuse.com/websockets

### Socket.IO Syntax

Creating a socket.io server with node.js:

NB: You may have to run `npm install socket.io` before running this code.

```javascript
// in socketio-server.js

var socketio = require("socket.io");

var listen = function(server){
  var io = socket.io.listen(server);
  io.sockets.on('connection', function(socket){
    console.log('A socket is connected!');
    // listen for messages sent by the client
    socket.on('event_here', function(data){
      //code to respond to given event and data...
    });
    // send an event to just the newly connected client
    socket.emit('hello', "hello new socket");
    // send an event to all the connected clients
    io.sockets.emit('hello', "hello everyone");
    // log the disconnection of this client
    socket.on('disconnect', function(){
      console.log("A socket disconnected.");
    })
  }); 
}

exports.listen = listen;

```

The `socketIOListen` function takes a node.js `http` server as an 
argument, and piggybacks off of the `http` server functionality.
Example:

```javascript
// in server.js
var fs = require('fs');

var port = 8080;
var callback = function(request, response){
  fs.readFile("index.html", function(err, data){
    if (err) {
      console.log("ERROR: ", err);
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("Error: page not found.");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.end(data);
    }
  });
}

var httpServer = http.createServer(callback);

httpServer.listen(port);

var listen = require('./socketio-server.js').listen;

listen(httpServer);

```

The callback for the `http` server is set up to serve a static `index.html`.  
To actually connect to 
socket.IO when you visit the homepage, one would include the socket.IO library 
in the client-side javascript, (meaning load it in the `<head>` element with a 
  `<script>` tag), and then put the following line in a script tag in 
 `index.html`:
    
```javascript
var socket = io.connect();
```
With the code set up in this way, the server will log messages for connection and 
disconnection when the page is visited or closed.

