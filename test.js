var count;
  var sender;
var http = require('http'),
	fs = require('fs');

	
var app = http.createServer(function (request, response) {
	fs.readFile("test.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(801);
var io = require('socket.io').listen(app);
count=0;
// open the socket connection
io.sockets.on('connection', function (socket) {
   count++;
   // listen for the chat even. and will recieve
   // data from the sender.
   socket.on('chat', function (data) {
   
      // default value of the name of the sender.
       sender = 'unregistered';
      
      // get the name of the sender
      socket.get('nickname', function (err, name) {
         console.log('Chat message by ', name);
         console.log('error ', err);
         sender = name;
      });   

      // broadcast data recieved from the sender
      // to others who are connected, but not 
      // from the original sender.
	 	
      socket.broadcast.emit('chat', {
         msg : data, 
         msgr : sender,
		 
      });
   });
   
   // listen for user registrations
   // then set the socket nickname to 
   socket.on('register', function (name) {
   
      // make a nickname paramater for this socket
      // and then set its value to the name recieved
      // from the register even above. and then run
      // the function that follows inside it.
      socket.set('nickname', name, function () {
      
         // this kind of emit will send to all! :D
         io.sockets.emit('chat', {
            msg :  name , 
            msgr : "User",
		});
      });
   });
   socket.on('disconnect', function (data) {
	   socket.get('nickname', function (err, name) {
         console.log('Chat message by ', name);
         console.log('error ', err);
         sender = name;
      });
	   
        console.log('DISCONNESSO!!! ');
        count--;
        socket.broadcast.emit('chatdis', {
			 msg: "Offline",
			 msgr : sender	
        });
    });

});