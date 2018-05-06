
function register_db_update_event()
{
	socket.on('db_update_event', function(data){
      console.log("db_update_event received");
       add_to_broadcast_to_layer(data);
	});


	socket.on('deleted_features_event', function(data){
      console.log("deleted_features_event received");
       handle_deleted_features_event(data);
	});
}
