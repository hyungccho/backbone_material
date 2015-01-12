# Node.js

Install Node [here][node-installation].  You'll probably want 
the Mac OS X instructions.

[node-installation]: https://github.com/joyent/node/wiki/Installation

## Hello World

Let's get node up and running.  Most node apps are set up with one
main file (usually named index.js) that requires other files.

I strongly suggest that you type this code in a sample window as you go along.

Start by making a server file in your root directory called *server.js*.  

Write the following code:

```javascript
var http = require("http");

var server = http.createServer(function(request, response){
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
});

server.listen(8888);
console.log("Server Started");
```

Look familiar?  We did something similar with WEBrick in Rails Lite.  
Our anonymous function runs code in the same way that .mount_proc 
runs code when a request comes in.

Run `node server.js` and go to localhost:8888 in your browser.

What's going on? Node is asynchronous, i.e., it says 
"make a server, and when a request comes in, we'll run 
this *callback*". We can prove that node is running 
asynchronously because "Server Started" gets logged 
before any requests come in.


## The Index File

Time to start building our main file, *index.js*.

```javascript
//index.js

var server = require("./server");

server.start();
```

Try visiting localhost:8888 again--it should still work.  By 
using `require("./server")`, we're pulling in the server file's 
exports and setting them to a variable called `server`.  

Fool around by setting global variables in the the server file 
and accessing them in the index file.

## Routing

Remember Rails lite?  In the same way that we made a router object
that takes in a path and runs the matching controller action, we're 
going to eventually make a function that takes in the path and keeps
track of request handlers to route a request to the appropriate "action".

First, let's write some request handlers (our "actions").

```javascript
//request_handlers.js

var exec = require("child_process").exec;

function start(response) {
	console.log("Request handler 'start' was called.");
	var content = "empty";
	

	exec("ls -lah", // this could be any "blocking operation"
			// that is, an operation that takes a while
			// to return that would ordinarily stop the // server

	 	function(err, stdout, stderr){
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(stdout);
			response.end();
		});
}

function upload(response) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("in upload");
	response.end();
}

exports.start = start;
exports.upload = upload;
```

What's this [`exec`][exec] thing we're using?  Speaking literally, 
it's a node function that lets you run terminal commands.  
But we could easily run a different function that also takes a 
long time to return (e.g. running a really long sql query or reading
a huge file from the hard drive).

Just like in jQuery (e.g. with `.on("click", function(){})`), we
want to pass exec a *callback* that will run once the
information that we want is returned.  Without this callback, node 
would wait for the information to come back before *any* other 
method runs.  Instead, we put the callback in the event loop and 
node can continue running and serving other requests.


We'll match paths to these request handler functions (start and upload) our index file.

```javascript
//index.js
//...
var requestHandlers = require("./request_handlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
```

Notice that we're not passing the entire router into the 
server.Just the route function and the handle object.  
It may also make sense to have written the handle object 
directly in the route function, but it's easier to test 
this way.

Now, in the server, we pass the handle hash and the response to our route 
function (look familiar?).

```javascript
//server.js
//...
	function onReq(request, response) {
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response, request);
	}

//...
```


```javascript
//router.js

function route(handleMatcher, pathname, response) {
	console.log("About to route a request for " + pathname);

	if (typeof handleMatcher[pathname] === 'function') {
		handleMatcher[pathname](response);
	} else {
		console.log("404 not found");
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("Content not found");
		response.end();
	}
}

exports.route = route;
```

## Post Requests

Time to handle different types of requests.  Let's change our start 
function to show a form where a user can type in text:

```javascript
//request_handlers.js
function start(response) {
	var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" content="text/html; '+ 'charset=UTF-8" />'+ '</head>'+ '<body>'+ '<form action="/upload" method="post">'+ '<textarea name="text" rows="20" cols="60"></textarea>'+ '<input type="submit" value="Submit text" />'+ '</form>'+ '</body>'+ '</html>'; //normally we'll render this with a template
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
```

This form will submit a POST request to /upload.  POST data is uploaded in chunks to avoid blocking the server.  Imagine a huge file that takes forever for the server to process--we'd rather have it come piece-by-piece so that we can continue to serve requests.


There are three parts to this:

1. We set a standard encoding for the request.
2. We use a closure to add each chunk to a postData variable.
3. Once all the data has finished coming in, we send the full
postData into our request handler.

```javascript
//server.js
//...

function onReq(request, response) {
	var postData = ""; //we'll be adding to this later
	var pathname = url.parse(request.url).pathname;
	
	request.setEncoding("utf8"); // 1. Set encoding.

	request.addListener("data", function(postDataChunk) {
		postData += postDataChunk; // 2. Adding to it now
		console.log("received chunk" + postDataChunk);
	});

	request.addListener("end", function(){
		route(handle, pathname, response, postData); // 3. postData complete.  Send it on.
	});
}
//...

//request_handlers.js
var querystring = require("querystring");
//querystring.parse will parse the utf-8 text
//...

function upload(response, postData) {
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(querystring.parse(postData).text); //querystring.parse converts back from
																										//utf-8
	response.end();
}

//...
```

Test it out!  Use this [lorem](http://www.lipsum.com/) generator
to make 500 bytes of text and upload it through the form on your
`/start` page.  Then do the same thing with 78000 bytes of text.
You should see the chunk handler fire at least twice.

## File Uploads

We need a module called 'node-formidable' to parse incoming file data.  Formidable will put the uploaded file in a /tmp folder on our hard drive.  We'll use a module called 'fs' to
read the contents of that file into our node server.

In terminal, run `npm install formidable` --it doesn't come standard with node.

Now we'll add a request handler to show an image.

```javascript
//request_handlers.js
//...
var fs = require("fs");

//...
function show(response) {
	fs.readFile("tmp/test.jpg", "binary", function(error, file){
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"}); 
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	})
}

exports.show = show;
//...

//index.js
//...
handle["/show"] = requestHandlers.show;
```

Let's change our HTML form to accept multipart data (normally 
we'll have an entire separate template file for html, but this
is for demonstration purposes).

```javascript
//request_handlers.js
//...

function start(response, postData) {
	var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" '+ 
		'content="text/html; charset=UTF-8" />'+ '</head>'+ '<body>'+ 
		'<form action="/upload" enctype="multipart/form-data" '+ 'method="post">'+ 
		'<input type="file" name="upload">'+ 
		'<input type="submit" value="Upload file" />'+ '</form>'+ '</body>'+ '</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
```

To handle the file upload in our upload request handler,
we'll have to pass in the request object from the server
(right now we only have the response).  Let's refactor our code:

```javascript
//server.js
//...
function onReq(request, response) {
		var pathname = url.parse(request.url).pathname;
		route(handle, pathname, response, request);
	}

	http.createServer(onReq).listen(8888);
```

```javascript
//router.js
//...

function route(handleMatcher, pathname, response, request) {
	console.log("About to route a request for " + pathname);

	if (typeof handleMatcher[pathname] === 'function') {
		handleMatcher[pathname](response, request);
```

```javascript
//request_handlers.js
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

//querystring.parse will parse the utf-8 text


function start(response) {
	var body = '<html>'+ '<head>'+ '<meta http-equiv="Content-Type" '+ 
		'content="text/html; charset=UTF-8" />'+ '</head>'+ '<body>'+ 
		'<form action="/upload" enctype="multipart/form-data" '+ 'method="post">'+ 
		'<input type="file" name="upload">'+ 
		'<input type="submit" value="Upload file" />'+ '</form>'+ '</body>'+ '</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files){

		fs.rename(files.upload.path, "tmp/test.jpg", function(error){
			console.log(files.upload.path);
			if(error) {
				fs.unlink("/tmp/test.jpg");
				fs.rename(files.upload.path, "tmp/test.jpg");
			}
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("received image:<br/>"); 
			response.write("<img src='/show' />");
			response.end();
		});
	});
}

function show(response) {
	fs.readFile("tmp/test.jpg", "binary", function(error, file){
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"}); 
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	})
}

exports.start = start;
exports.upload = upload;
exports.show = show;
```

Try it out!  You don't have to know the details of fs, but make sure you see how we use callbacks to fill the response asynchronously.

[exec]: https://github.com/bahamas10/node-exec
