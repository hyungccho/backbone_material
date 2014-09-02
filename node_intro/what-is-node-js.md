![node.js logo][logo]

# What is Node.js?

  Node.js is a command line tool that can be used to set up a web server and run JavaScript programs.
  
  You may have heard that node.js is "javascript for the server-side".
  It uses JavaScript, but 'under the hood' is written in C.  For example,
   [check out the node.js source code][node-src]; You will see that 
  *Node.js is not actually written in JavaScript!  (The mind is blown!)*
  
  Saying that node.js is "javascript for the server-side" really means that
   the application logic for the server-side can be written in javascript, 
   and that the server itself can be set up with javascript.
  
  Node.js is built on top of the V8 javascript engine, which comes from Google Chrome. This is awesome because **it makes things really fast**.
([The Benchmarks Game][benchmarks-game] is a cute way to look at this.)

[benchmarks-game]: http://benchmarksgame.alioth.debian.org/u32/benchmark.php?test=all&lang=v8&lang2=go&data=u32
[node-src]: https://github.com/joyent/node/tree/master/src

## Basic Example

Design Pattern for creating a server:

```javascript
var http = require('http');

var server = http.createServer(function (request, response) {
  // callback functionality here...
  response.end();  
});

var port = 8080;
server.listen(port);

console.log("Listening on http://localhost:"+port);
```
Explanation of the code above, line by line:

1. The first line uses `require` to include the `http` module, which has helper functions for dealing with http requests.
2. `http.createServer` does two things:
  * It creates a server object (self explanatory)
  * It takes a callback and attaches it to the `request` event.

3. The callback handed to the server should take `request` and 
 `response` objects as parameters, and handle responding to the 
 HTTP requests by parsing the request and writing to the response.
4. The `.listen` method tells the server to start handling requests on a specific port.
5. The `console.log` statement at the end is just a conventional way to
 signal that things are working as expected when the script runs.

  
## Defining Terms

  There are some key terms that get thrown around when talking about Node.js:
 * It uses **non-blocking I/O**
 * and a **single-threaded event loop**
 * so that it can be **event-driven**
 
Let's define these terms in order to fully understand Node.js.
 
### I/O
  We know that I/O stands for "Input" and "Output".  It has a more specific meaning in the context of Node.js: Input and Output operations include any interaction between the Node.js server and an outside entity.  Usually this means that either a user is interacting with the Node server (via HTTP requests or a CLI), or the Node server is querying a database.
  
### Non-Blocking I/O
>"Asynchronous I/O, or non-blocking I/O is a form of input/output processing that permits other processing to continue before the transmission has finished"

(from [Non-Blocking I/O on wikipedia](http://en.wikipedia.org/wiki/Non-blocking_I/O))

  I/O operations tend to be the most costly type of operations, and when your code runs synchronously these operations will block the flow of code until they are completed.  *Non-Blocking I/O* means that the main process will set the I/O operation in motion, and then continue to other tasks while the I/O operation finishes.
  
### Single-Threaded Event Loop

>" ...in the execution model of PHP... the web server starts its own PHP process for every HTTP request it receives. If one of these requests results in the execution of a slow piece of code, it results in a slow page load for this particular user, but other users requesting other pages would not be affected.
>The execution model of Node.js is different - **there is only one single process**. If there is a slow database query somewhere in this process, this affects the whole process - everything comes to a halt until the slow query has finished.
>To avoid this, JavaScript, and therefore Node.js, introduces the concept of event-driven, asynchronous callbacks, by utilizing an **event loop**."

([from the nodebeginner tutorial, "Analyzing our HTTP Server"](http://www.nodebeginner.org/#analyzing-our-http-server))

Node.js has a single process and sets callbacks for I/O processes which run in the background of the main loop.  It is asynchronous rather than synchronous.

The use of JavaScript for this approach is a good fit, because JavaScript was
designed for another context that uses a single-threaded event loop:
*the browser*.

### Event-Driven

>"In computer programming, event-driven programming (EDP) or event-based programming is a programming paradigm in which the flow of the program is determined by events—e.g., sensor outputs or user actions (mouse clicks, key presses) or messages from other programs or threads."

(from [Event-Driven programming on wikipedia](http://en.wikipedia.org/wiki/Event-driven_programming))

**Big Event, Medium Event, and Little Event**

In the early days of the web, data was sent to the server in one big event - a form submission.  Later, with Ajax, web applications could send smaller chunks of data in response to smaller events, but an Ajax request still requires significant resources.  With ajax, web applications can include quick validations and submit forms without refreshing the page, but they still rarely respond dynamically to small frequent events triggered by the user.

An event-driven web application would respond to frequent, small events.  For example, think of a chat room; the application responds to every sentence entered by each user in the room, rapidly updating based on small inputs.

**Doctor's Office and Fast-Food Restaurant**

[This article](http://code.danyork.com/2011/01/25/node-js-doctors-offices-and-fast-food-restaurants-understanding-event-driven-programming/) has another nice metaphor to explain event driven programming:
In a fast food restaurant, a *thread-based* model would have each customer place their order and then wait in line until their order was ready.  They would be **blocking** the cashier from taking more orders.  In an *event driven* model, each customer places their order and then steps aside, waiting for their order to be finished.  Think of the orders placed and the waiting customers as callbacks, waiting for the order (an I/O operation) to be completed.

Similarly, in a doctor's office patients often have to fill out forms before being seen.  In a *thread-based* model, each patient would stand at the counter and fill out forms until they were done, **blocking** the receptionist from checking other patients in.  Most doctor's offices instead use an *event-based* model, where patients get their forms and then step aside until they have completed the forms.  When they complete the forms, they get back in line to submit the forms, which could be thought of as the callback in this case.

[logo]: https://raw.github.com/paradasia/node-js-playground/master/nodejs-green.png
[src-screenshot]: https://raw.github.com/paradasia/node-js-playground/master/node-src-files.png
