var cache_instance = cachemap();

function cachemap() {
    this.data = null;

		this.unload = function(frame_num)
		{
			//remove frame_num from cachemap
		}


		this.load = function(frame_num)
		{
			//make service call and update the cache with frame_num
		}

		this.querymap = function(frame_num)
		{
			//return marked objects for queries frame num
			//if doesnt exists call call reset cache
		}

		

		this.updateObjects = function(frame_num, data, flag)
		{
			// update the cache with  user action
		}

		this.clearall = function()
		{
			//clear cache
		}
}


function reset_cache (frame_num)
		{
			//clear the cache map and fetch new data for frame_num and reset.
			this.data = new Object();
			getCacheabledata(frame_num);

		}


function getCacheabledata(frame_num)
{

  console.log(" :::: getCacheabledata:::: ");

   var markedObjectRequest = new Object();
   markedObjectRequest.annotationID = selected_annotation.annotationID;
   markedObjectRequest.frameNumber= frame_num;
   markedObjectRequest.iscacheablereq = true;
   markedObjectRequest.maxFrameNum = (Number(selected_imageset.numberOfFrames) - 1);
   
   $.ajax({
        type: "POST",
        url: url.getMarkedObjectsCache,
        data: JSON.stringify(markedObjectRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
        	console.log(data);
        	var markedObjectlist;
        	Object.keys(data).forEach(function(key) {
			  markedObjectlist = data[key];
			  
     		});
          },
        failure: function(errMsg) {
          
        }
  });

}


 
