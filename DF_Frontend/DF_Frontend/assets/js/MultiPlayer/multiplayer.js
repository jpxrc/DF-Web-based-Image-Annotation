var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {}

app.get('/',function(req,res){
   return true
});

io.on('connection', function(socket){
  
  clients[socket.id] = socket;

  console.log('Client connected , id: '+socket.id);

  socket.on('disconnect', function() {
  	console.log('Client disconnected , id: '+socket.id);
    delete clients[socket.id];
  });


  socket.on('logout', function() {
  	console.log('Client disconnected through logout, id: '+socket.id);
    delete clients[socket.id];
  });

  socket.on('saved_feature', function(data){
    console.log(data);
    socket.broadcast.emit('db_update_event', data);
  });

  socket.on('deleted_features', function(data){
    console.log(data);
    socket.broadcast.emit('deleted_features_event', data);
  });
});




http.listen(2001, function(){
  console.log('listening on *:2001');
});
