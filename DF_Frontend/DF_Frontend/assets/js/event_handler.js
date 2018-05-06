

var MarkedObjectList = ''


//Closes the hamburger menu
function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
    //$("#pagination").hide();

    collapse($("#showAlllabels"));
    collapse($("#classlabels"));
    collapse($("#draw_tools"));
    
   
}

//Opens the hamburger menu
function closeRightMenu() {
  
  collapse($("#showAlllabels"));
  collapse($("#classlabels"));
  collapse($("#draw_tools"));

  document.getElementById("rightMenu").style.display = "none";
  
}

//called on when 'Tools' is clicked on the Menu
function expand_tools_accord() {
 
  if (draw_mode && (selected_classlayer_id != '' && selected_classlayer_id != undefined))
  {
    var x = $("#draw_tools");

    if (x.attr('class').indexOf("w3-show") == -1) {
        x.addClass(" w3-show");
        $("#draw_tools").addClass("header-bar") ;
    } else { 
         collapse(x);
    }
  }
}


function force_expand_tools()
{
  var x = $("#draw_tools");

    if (x.attr('class').indexOf("w3-show") == -1) {
        x.addClass(" w3-show");
        $("#draw_tools").addClass("header-bar") ;
    } 
}

//Function is called to close the tools and class label divs in the expanded menu
function collapse(elem)
{
  if(elem != undefined)
  {
    elem.removeClass("w3-show");
    elem.prev().removeClass("header-bar");
  }
        
}

//TODO: club with function expand_tools_accord
function expand_tools_classes() {
  
  //class label list div
  var x = $("#classlabels");
  //showAlllabels checkbox div
  var y = $("#showAlllabels");
  if (x.attr('class').indexOf("w3-show") == -1) {
        x.addClass("w3-show");
        y.addClass("w3-show");
        y.prev().addClass("header-bar") ;
    } else { 
        collapse(x);
        collapse(y);
    }
  
    
}

//Function called on click of 'Home' button under the hamburger menu
function goHome()
{

  hide_map_page_divs();
  clear_current_variables();
  closeRightMenu();

  $("#containerDivId").show();
  $("div#workspace-select").show();

}

var deleteFeature = function(evt){
  switch (evt.keyCode) {
    case 46:

     delete_objects();
     break;
    case 39:
      //right arrow click
      next_frame();
      break;

    case 37:
      //left arrow click
      prev_frame();
      break;

    case 27:
      //escape
      console.log("draw_mode::: "+draw_mode);
      if(draw != null && draw != undefined)
        {
            console.log("removing draw")
            map.removeInteraction(draw);
        }
      if(draw_mode)
      {
        draw_icon_click()
         console.log("rdraw:: "+ draw);
        
      }
      break;


  }
  
};



function delete_objects()
{
  var features_deleted = select.getFeatures();
  
  var markedObjectRequest='';
  var markedObjectRequestList = [];
  var success_msg='';
  $.each(features_deleted.getArray(), function(index, feature)
   {
            console.log(feature);
            var properties = feature.getProperties();
            //For request object list from the properties
            markedObjectRequest = new Object();
            markedObjectRequest.type = properties.type;
            markedObjectRequest.classLayerID = properties.classLayerID;
            markedObjectRequest.annotationID = properties.annotationID;
            markedObjectRequest.frameNumber= properties.frameNumber;
            markedObjectRequest.markedObjectID = properties.markedObjectID;
            markedObjectRequestList.push(markedObjectRequest);
            update_object_counts_on_remote_delete(properties.type, -1)
          //  success_msg
            success_msg = success_msg + properties.type +"["+ properties.frameObjectID + "," +properties.markedObjectID+"],"
            vector_source_list[properties.classLayerID].removeFeature(feature);
            
  });

  delete_markedObject_fromDB(markedObjectRequestList,success_msg); 
}

//This function makes a service request to delete the given marked object from the database
function delete_markedObject_fromDB(properties,success_msg)
{
 var start = new Date();
$.ajax({
        type: "POST",
        url: url.deleteMarkedObject,
        data: JSON.stringify(properties),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          console.log(success_msg);
           var end = new Date();
          append_to_log_success("Deleted "+success_msg+ " from database. Time elapsed: "+(end.getTime() - start.getTime())+"ms");
          populate_object_count();
          //emit info to other palyers about the deletion
          socket.emit('deleted_features', properties);
          select.getFeatures().clear();
        },
        failure: function(errMsg) {
            show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to delete annotation(s) " +success_msg + " from database.");
            append_to_log_error("Failed to delete annotation(s) " +success_msg + " from database.")
        },
        complete: function(xhr, textStatus) {
            console.log(xhr.status);
            if(xhr.status != 200)
            {
              show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to delete annotation(s) " +success_msg + " from database.");
              append_to_log_error("Failed to delete annotation(s) " +success_msg + " from database.");
            }
          } 
  });
}


//this function shows the alert message. this has to be called in case of failures
function show_failure_alert(message)
{
  $("#error_alert").append(message);
  $("#error_alert").show();
}


//clears global variables on events that navigate away from current frame - like next/prev button, breadcrumbz, logout.
function clear_current_variables()
{
   selected_annotation='';
   current_frame_number='';
   clear_variables_on_frame_nav();
   clear_draw_mode();
   
}


function clear_draw_mode()
{
  clear_selected_classlayerID();
  draw_mode=false;
  $("#is_draw_mode").removeClass('enabled_draw_mode');
   $("#is_draw_mode").empty();
    $("#is_draw_mode").append('<img src="assets/images/pencil_disabled1.png"/>');
    draw = null;
}


function clear_variables_on_frame_nav()
{
   max_frame_object_count = 0;
   //clear_selected_classlayerID();

    $('#cursor_pos_div').empty();
  
   
   clear_objects_counts();
   $("#dialog").dialog('close');
}

function clear_objects_counts()
{
  count_by_objects.point = 0;
  count_by_objects.polygon = 0;
  count_by_objects.line = 0;
  count_by_objects.circle = 0;
  count_by_objects.box = 0;
  count_by_objects.freeformPoly = 0;
  count_by_objects.freeform = 0;
  count_by_objects.curve = 0;
}


function populate_object_count()
{
  $("#object_count").empty();
  $("#object_count").append("Total Objects#: "+count_by_objects.total()+" (Points:"+count_by_objects.point+", Lines:" +count_by_objects.line +", Circles:"+count_by_objects.circle +", Polylines: "+count_by_objects.freeformPoly+", Polygons:"+(count_by_objects.box + count_by_objects.freeform) + ")");//", Curve:"+count_by_objects.curve);
}
/**
* Function called on 'draw end' of every annotation. This function calles the 
*/
function save_markedObject_to_db(data_input, service_url,event)
{


    if(selected_classlayer_id == '' || selected_classlayer_id == undefined)
    {
        show_failure_alert("<br> Type or class layer not selected correctly for drawing.");
    }
    else
    {


          console.log(data_input);
           markedObjectID_of_saved_feature = -1;
           var start = new Date();
            $.ajax({
                  type: "POST",
                  url: service_url,
                  data: JSON.stringify(data_input),
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  xhrFields: {
                      withCredentials: true
                  },
                  crossDomain: true,
                  success: function(data){
                    
                    markedObjectID_of_saved_feature = data;
                    var properties = form_properties(data_input.type);
                    var end = new Date();
                    append_to_log_success("Saved "+ data_input.type+" to database : ["+ data_input.frameObjectID+','+markedObjectID_of_saved_feature+"]. Time elapsed: "+(end.getTime() - start.getTime())+"ms");
                    
                    console.log("Before emit::"+markedObjectID_of_saved_feature)
                    if(markedObjectID_of_saved_feature != -1)
                    {
                        update_object_counts_on_remote_delete(properties.type, +1);
                        populate_object_count();
                        event.feature.setProperties(properties);
                        console.log("Before emit::")
                        data_input.markedObjectID = markedObjectID_of_saved_feature;
                        emit_saved_object(data_input);
                        //count_by_objects.point =  count_by_objects.point + 1;
                        markedObjectID_of_saved_feature = -1;
                    }

                  },
                  
                  failure: function(errMsg) {
                      show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to save the added. " + data_input.type  + "["+ data_input.frameObjectID+"] to database.");
                  },
                  complete: function(xhr, textStatus) {
                      console.log(xhr.status);
                      if(xhr.status != 200)
                      {
                        show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to save the added " + data_input.type + "["+ data_input.frameObjectID+"] to database.");
                      }
                    } 

            });
    }
  
}


/**
* Function called on 'draw end' of every annotation. This function calles the 
*/
function update_markedObject_to_db(data_input, service_url)
{
    console.log(data_input);
     markedObjectID_of_saved_feature = -1;
     var start = new Date();
      $.ajax({
            type: "POST",
            url: service_url,
            data: JSON.stringify(data_input),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data){
              
              markedObjectID_of_saved_feature = data;
              var end = new Date();
              append_to_log_success("Updated "+ data_input.type+" to database : ["+ data_input.frameObjectID+','+markedObjectID_of_saved_feature+"]. Time elapsed: "+(end.getTime() - start.getTime())+"ms");
              
              console.log("Before emit::"+markedObjectID_of_saved_feature)
              if(markedObjectID_of_saved_feature != -1)
              {
                  
                  console.log("Before emit::")
                  emit_saved_object(data_input);
                  //TODO: update on emit
                  markedObjectID_of_saved_feature = -1;
              }

            },
            
            failure: function(errMsg) {
                show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to save the added. " + data_input.type  + "["+ data_input.frameObjectID+"] to database.");
            },
            complete: function(xhr, textStatus) {
                console.log(xhr.status);
                if(xhr.status != 200)
                {
                  show_failure_alert("<br> Frame#: "+ current_frame_number +". Failed to save the added " + data_input.type + "["+ data_input.frameObjectID+"] to database.");
                }
              } 

      });
  
}



//Function forms the markedObject request to be sent to save request
function form_marked_object_to_save(type)
{
   var markedObject = new Object();
   markedObject.annotationID = selected_annotation.annotationID;
   markedObject.classLayerID = selected_classlayer_id;
   markedObject.label=class_layer_details[selected_classlayer_id][2];
   markedObject.createdBy = selected_userid;
   markedObject.type = type;
   markedObject.frameNumber=current_frame_number;
   max_frame_object_count = Number(max_frame_object_count) + 1;
   markedObject.frameObjectID = max_frame_object_count;
   

   //markedObject.date will be set on the server
   return markedObject;
}


//Function forms the markedObject request to be sent to save request
function form_marked_object_to_modify(properties)
{
   var markedObject = new Object();
   markedObject.annotationID = selected_annotation.annotationID;
   markedObject.classLayerID = properties.classLayerID;
   markedObject.label=class_layer_details[properties.classLayerID][2];
   markedObject.createdBy = selected_userid;
   markedObject.type = properties.type;
   markedObject.frameNumber=current_frame_number;
   markedObject.frameObjectID = properties.frameObjectID;
   markedObject.markedObjectID = properties.markedObjectID;
   

   //markedObject.date will be set on the server
   return markedObject;
}

function form_properties(type)
{
  var properties = new Object();
  properties.annotationID = selected_annotation.annotationID;
  properties.createdBy = selected_userid;
  properties.frameNumber = current_frame_number;
  properties.type = type;
  properties.classLayerID = selected_classlayer_id;
  properties.label = class_layer_details[selected_classlayer_id][2];
  if(markedObjectID_of_saved_feature != -1)
  {
      properties.markedObjectID = markedObjectID_of_saved_feature;
      properties.frameObjectID = max_frame_object_count;
      console.log("properties.markedObjectID :: " + properties.markedObjectID);

   }
  return properties;
}

//helper function to form an list before passing data to draw_annotations()
function form_feature_from_markedObject(markedObject)
{
  temp = [];
  temp.push(markedObject);
  draw_annotations(temp);
}

/**
*Emit informtation to the node server that the a marked object was saved. All other active users on this annotation will receive a braodcast of thsi update.
*/
function emit_saved_object(markedObject)
{
  console.log("Calling socket");
  socket.emit('saved_feature', markedObject);
}


/**
*Function called by the multiplayer_client when a db insert has occured
*/
function add_to_broadcast_to_layer(feature_added)
{
  
  var classlayerID = feature_added.classLayerID;
  var frameNumber = feature_added.frameNumber;
  var annotationID= feature_added.annotationID;
  console.log("classlayerID:: "+classlayerID+",frameNumber:: "+frameNumber+",annotationID:::"+annotationID);
  if(annotationID == selected_annotation.annotationID)
  {
    if(frameNumber==current_frame_number)
      form_feature_from_markedObject(feature_added);
    
    show_snackbar("An annotation was added by another user on frame# "+frameNumber);
    append_snackbar_msg_to_acticity_log('[Annotation Id: '+annotationID+', Frame#: '+ frameNumber + '] - '+'An annotation was added by another user');
    populate_object_count();
  }
  
}

//Shows an alert and fades after 5 mins when another user makes changes to the frame.
function show_snackbar(msg)
{
    // Get the snackbar DIV
    $("#snackbar").addClass('show')
    $("#snackbar").append(msg);

  // After 5 seconds, remove hide snack bar and clear its contents
  setTimeout(function(){ 
    $("#snackbar").removeClass('show');
    $("#snackbar").empty();}, 5000);
}

/*
*Function called by multiplayer_client to hadle the delete event received
*/
function handle_deleted_features_event(deleted_features)
{
  var classlayerID ;
  var id;
  var frameNumber = deleted_features[0].frameNumber;
  var annotationID= deleted_features[0].annotationID;
  if(annotationID == selected_annotation.annotationID && frameNumber==current_frame_number)
  {
    if(frameNumber==current_frame_number)
    {
      $.each(deleted_features, function(index, value)
      {
        classlayerID = value.classLayerID;
        id = value.markedObjectID;
        update_object_counts_on_remote_delete(value.type, -1);
        var feature = vector_source_list[classlayerID].getFeatureById(id);
        vector_source_list[classlayerID].removeFeature(feature);
      });
    }
  show_snackbar("Annotation(s) deleted by another user on frame# "+frameNumber);
  append_snackbar_msg_to_acticity_log('[Annotation Id: '+annotationID+', Frame#: '+ frameNumber + '] - '+'Annotation(s) deleted by another user ');
  populate_object_count();
  }
  
}


function update_object_counts_on_remote_delete(type, num)
{
  switch (type) {
                case "freeForm":
                    count_by_objects.freeform = count_by_objects.freeform + num;
                   
                    break;
                case "freeFormPoly":
                    
                    count_by_objects.freeformPoly =  count_by_objects.freeformPoly + num;
                    break; 

                case "point":
                     
                     count_by_objects.point =  count_by_objects.point + num;
                     break; 

                case "line":
                  
                  count_by_objects.line =  count_by_objects.line + num;
                  break;

                case "box":
                  count_by_objects.box =  count_by_objects.box + num;

                  break;
                case "circle":
                      count_by_objects.circle =  count_by_objects.circle + num;
                  break;
                case "bspline":
                  
                  break;
                default: 
                  console.log("unknown type :: "+item.type)

            }
}


function draw_freeform()
{

  //highlight selected tool
  $("#tools_freeform").addClass("tr-selected").siblings().removeClass("tr-selected"); 
  //remove interaction from previously selected drawing tool
  unbind_draw_from_map();

   draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'Polygon',
             //condition: ol.events.condition.singleClick,
             //freehandCondition: ol.events.condition.noModifierKeys,
             freehand: true,
             //style: style_list[selected_classlayer_id].polygon
          });

   

    draw.on('drawend', function (event) {
       polygon_drawend_event(event);
       
     });
     map.addInteraction(draw);
  

}


/*
*Function called with Polygon is clicked on Tools menu
*
*/
function draw_polyline()
{
     $("#tools_polyline").addClass("tr-selected").siblings().removeClass("tr-selected"); 

    //remove interaction from previously selected drawing tool
    unbind_draw_from_map();

    //create new Draw object
     draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'LineString',
            //style: style_list[selected_classlayer_id].line
          });

     

    //Once the draw is completed get all the points drawn and save into the datbase
    draw.on('drawend', function (event) {

        //vector_source_list[selected_classlayer_id].addFeature(event.feature);
        event.feature.setStyle(style_list[selected_classlayer_id].line);

        var geoJsonGeom = new ol.format.GeoJSON();    
        var pp = geoJsonGeom.writeGeometry(event.feature.getGeometry());
        event.feature.setStyle(style_list[selected_classlayer_id].line);
              
        var markedObject = form_marked_object_to_save("freeFormPoly");

        var  ff_array = [];
        var freeFormPoly = '';
         
        var points = $.parseJSON(pp).coordinates;
        console.log($.parseJSON(pp).coordinates)
        
         var polygonKey1;
         $.each(points, function(index, value)
         {
            freeFormPoly = new Object;
            polygonKey1 = new Object();
            polygonKey1.order = index;
            freeFormPoly.x = value[0];
            freeFormPoly.y = Number(value[1])*-1;
            freeFormPoly.polygonKey = polygonKey1; 
            ff_array.push(freeFormPoly);

         });

            
          markedObject.freeFormPoly = ff_array;
          save_markedObject_to_db(markedObject, url.saveFreeFormPoly,event);
        
         
      });

   map.addInteraction(draw);
}


function polygon_drawend_event(event)
{
  //vector_source_list[selected_classlayer_id].addFeature(event.feature);
       event.feature.setStyle(style_list[selected_classlayer_id].polygon);

        var geoJsonGeom = new ol.format.GeoJSON();    
        var pp = geoJsonGeom.writeGeometry(event.feature.getGeometry());
        var markedObject = form_marked_object_to_save("freeForm");
        var ff_array = [];
        var freeFormPoint = '';
         
        var points = $.parseJSON(pp).coordinates[0];
        var polygonKey1;
         $.each(points, function(index, value)
         {
            freeFormPoint = new Object;
            polygonKey1 = new Object();
            polygonKey1.order = index;
            freeFormPoint.x = value[0];
            freeFormPoint.y = Number(value[1])*-1;
            freeFormPoint.polygonKey = polygonKey1;
            ff_array.push(freeFormPoint);

         });


      markedObject.freeFormPoint = ff_array;
      save_markedObject_to_db(markedObject, url.saveFreeFormPoint,event);
      
}

function draw_polygon()
{

  //highlight selected tool
  $("#tools_polygon").addClass("tr-selected").siblings().removeClass("tr-selected"); 
  //remove interaction from previously selected drawing tool
  unbind_draw_from_map();

  draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'Polygon'
            //style: style_list[selected_classlayer_id].polygon
          });

   

    draw.on('drawend', function (event) {
       polygon_drawend_event(event);

       
     });
     map.addInteraction(draw);

}




function draw_square()
{

  //highlight selected tool
  $("#tools_square").addClass("tr-selected").siblings().removeClass("tr-selected"); 
  var geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    //remove interaction from previously selected drawing tool
      map.removeInteraction(draw);

   draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'Circle',
            geometryFunction: geometryFunction,
            //style: style_list[selected_classlayer_id].polygon
          });

   

    draw.on('drawend', function (event) {
       
       //vector_source_list[selected_classlayer_id].addFeature(event.feature);
       event.feature.setStyle(style_list[selected_classlayer_id].polygon);

        var geoJsonGeom = new ol.format.GeoJSON();    
        var pp = geoJsonGeom.writeGeometry(event.feature.getGeometry());
        //var points = $.parseJSON(pp).coordinates[0];
        console.log("square:::");   
        console.log(pp);
        markedObject = form_marked_object_to_save("box");
        var  ff_array = [];
        var freeFormPoint = '';
         
        var points = $.parseJSON(pp).coordinates[0];
        var polygonKey1;
         $.each(points, function(index, value)
         {
            freeFormPoint = new Object;
            polygonKey1 = new Object();
            polygonKey1.order = index;
            freeFormPoint.x = value[0];
            freeFormPoint.y = Number(value[1])*-1;
            freeFormPoint.polygonKey = polygonKey1;
            ff_array.push(freeFormPoint);

         });


      markedObject.freeFormPoint = ff_array;
      save_markedObject_to_db(markedObject, url.saveFreeFormPoint,event);
      
     });
     map.addInteraction(draw);
}


function handle_box_modify(event)
{

   var geoJsonGeom = new ol.format.GeoJSON();    
 var pp = geoJsonGeom.writeGeometry(event.target.getGeometry());
  var points = $.parseJSON(pp).coordinates[0];
 console.log(points);
 
}

function draw_rectangle()
{


  //highlight selected tool
   $("#tools_rectangle").addClass("tr-selected").siblings().removeClass("tr-selected"); 
  var geometryFunction = function(coordinates, geometry) {
              if (!geometry) {
                geometry = new ol.geom.Polygon(null);
              }
              var start = coordinates[0];
              var end = coordinates[1];
              geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
              ]);
              return geometry;
            };
    //remove interaction from previously selected drawing tool
      map.removeInteraction(draw);

   draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'Circle',
            geometryFunction: geometryFunction,
            //style: style_list[selected_classlayer_id].polygon
          });

   

    draw.on('drawend', function (event) {
       
       //vector_source_list[selected_classlayer_id].addFeature(event.feature);
       event.feature.setStyle(style_list[selected_classlayer_id].polygon);

        var geoJsonGeom = new ol.format.GeoJSON();    
        var pp = geoJsonGeom.writeGeometry(event.feature.getGeometry());
        //var points = $.parseJSON(pp).coordinates[0];
        console.log("square:::");   
        console.log(pp);
        markedObject = form_marked_object_to_save("box");
        var  ff_array = [];
        var freeFormPoint = '';
         
        var points = $.parseJSON(pp).coordinates[0];
        var polygonKey1;
        /* $.each(points, function(index, value)
         {
            freeFormPoint = new Object;
            polygonKey1 = new Object();
            polygonKey1.order = index;
            freeFormPoint.x = value[0];
            freeFormPoint.y = Number(value[1])*-1;
            freeFormPoint.polygonKey = polygonKey1;
            ff_array.push(freeFormPoint);

         });*/

      var point1 = points[0];
      var point2 = points[1];
      var point3 = points[2];

      var width = calculate_distance_between_2_points(point1[0],point1[1],point2[0],point2[1]);
      var height = calculate_distance_between_2_points(point2[0],point2[1],point3[0],point3[1]);
      boxObject = new Object();
      boxObject.x = point1[0];
      boxObject.y = Number(point1[1])*-1;
      boxObject.width = width;
      boxObject.height = height;


      markedObject.boxObject = boxObject;
      save_markedObject_to_db(markedObject, url.saveBoxObject,event);
       
     });
     map.addInteraction(draw);
}



//function gets callled when 'Line' is clicked on Tools menu
function draw_line()
{
    //highlight selected tool
    $("#tools_line").addClass("tr-selected").siblings().removeClass("tr-selected"); 

     //remove interaction from previously selected drawing tool
     map.removeInteraction(draw);
     draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'LineString',
            maxPoints: 2,
            //style: style_list[selected_classlayer_id].line
     });
    
      draw.on('drawend', function (event) {
          event.feature.setStyle(style_list[selected_classlayer_id].line);
          var geoJsonGeom = new ol.format.GeoJSON();    
          var clicked_point = geoJsonGeom.writeGeometry(event.feature.getGeometry());
          var points = $.parseJSON(clicked_point).coordinates;
           
          var lineObject = new Object();

           lineObject.x1 = Number(points[0][0]);
           lineObject.y1 = Number(points[0][1])*-1;

           lineObject.x2 = Number(points[1][0]);
           lineObject.y2 = Number(points[1][1])*-1;

          var markedObject = form_marked_object_to_save("line");
          
          markedObject.lineObject = lineObject;
          
          save_markedObject_to_db(markedObject,url.saveLineObject,event);
          
      });

    map.addInteraction(draw);
}


function draw_point()
{
    //highlight selected tool
    $("#tools_point").addClass("tr-selected").siblings().removeClass("tr-selected"); 

    //remove interaction from previously selected drawing tool
    map.removeInteraction(draw);

    //Add interaction to the vector source 
     draw = new ol.interaction.Draw({
            source: vector_source_list[selected_classlayer_id],
            type: 'Point',
            freehand: true,
            style: style_list[selected_classlayer_id].point
     });
    
    //function to be called once the point is drawn on the UI  
    draw.on('drawend', function (event) {
     
            var geoJsonGeom = new ol.format.GeoJSON();    
            var pp = geoJsonGeom.writeGeometry(event.feature.getGeometry());

            // Add style to the feature. Global variable selected_classlayer_id was set when the class label was selcted in the UI
           event.feature.setStyle(style_list[selected_classlayer_id].point);
           var properties = event.feature.getProperties();

           //Create new marked object to be sent to the server to save in the database
           var markedObject = form_marked_object_to_save("point");
           
           var point_object = new Object;

            var point = $.parseJSON(pp).coordinates;

            point_object.x = point[0];
            point_object.y = Number(point[1])*-1;


          markedObject.pointObject = point_object;
          save_markedObject_to_db(markedObject,url.savePointObject,event);
          
     }); //draw.on ends

    map.addInteraction(draw);
}





function draw_circle()
{
    //remove interaction from previously selected drawing tool
    map.removeInteraction(draw);

    //highlight selected tool
    $("#tools_circle").addClass("tr-selected").siblings().removeClass("tr-selected"); 

       draw = new ol.interaction.Draw({
            source: vector_source[selected_classlayer_id],
            type: 'Circle',
            //style: style_list[selected_classlayer_id].circle
          });
       draw.on('drawend', function (event) {
       
       vector_source_list[selected_classlayer_id].addFeature(event.feature);
       event.feature.setStyle(style_list[selected_classlayer_id].circle);
       var geoJsonGeom = new ol.format.GeoJSON();  
       
       var first_point = event.feature.getGeometry().getFirstCoordinate();
       var last_point = event.feature.getGeometry().getLastCoordinate();

       var circle = new Object();

       circle.x1 = Number(first_point[0]);
       circle.y1 = Number(first_point[1])*-1;

       circle.x2 = Number(last_point[0]);
       circle.y2 = Number(last_point[1])*-1;


      var markedObject = form_marked_object_to_save("circle");
      
         
      markedObject.circle = circle;
      save_markedObject_to_db(markedObject,url.saveCircle,event);
    });

    map.addInteraction(draw);
}




function clear_selected_classlayerID()
{
  //clear selected class layer id
    $("#classlayer_"+selected_classlayer_id).removeClass("tr-selected");
    $("#classlabels").children().removeClass('tr-selected');
    selected_classlayer_id = '';

    //clear selected style for draw tools
    $("#draw_tools").children().removeClass('tr-selected');
}


function draw_mode_onchange(chng)
{
  if(chng.checked)
  {
    if(draw != undefined && draw != '')
    {
      //map.addInteraction(draw);
    }
    
  }
  else
  {

    clear_selected_classlayerID();

    if(draw != undefined && draw != '')
    {
      map.removeInteraction(draw);
    }
    
  }
}


function toggle_draw_mode()
{
  draw_mode = !draw_mode;
}

function unbind_draw_from_map()
{
  if(draw != undefined && draw != '')
    {
      map.removeInteraction(draw);
    }
}

//Function called on click of pencil icon.
function draw_icon_click()
{
  toggle_draw_mode();
  if(draw_mode)
  {
    $("#is_draw_mode").addClass('enabled_draw_mode');
    $("#is_draw_mode").empty();
    $("#is_draw_mode").append('<img src="assets/images/pencil_enabled.png"/>');
    openRightMenu();
    expand_tools_classes();
  }
   else
  {
    $("#is_draw_mode").removeClass('enabled_draw_mode');
    $("#is_draw_mode").empty();
    $("#is_draw_mode").append('<img src="assets/images/pencil_disabled1.png"/>');
    clear_selected_classlayerID();
    unbind_draw_from_map();
    closeRightMenu();
    
  }

}



//Following four functions append info/warn/success/error messages in the overlay div. The overlay div is shown on click of the 'note' icon
function append_to_log_info(msg)
{
   var appent_html = '<div class="alert_custom alert-info"><strong> Info! </strong>'+'[Annotation Id: '+selected_annotation.annotationID+', Frame#: '+ current_frame_number + '] - '+msg+'</div>';
   $( "#activity_log" ).append( appent_html);
}

function append_to_log_success(msg)
{
   var appent_html = '<div class="alert_custom alert-success"><strong> Success! </strong>'+'[Annotation Id: '+selected_annotation.annotationID+', Frame#: '+ current_frame_number + '] - '+msg+'</div>';
   $( "#activity_log" ).append( appent_html);
}

function append_to_log_warn(msg)
{
   var appent_html = '<div class="alert_custom alert-warning"><strong> Warn! </strong>'+'[Annotation Id: '+selected_annotation.annotationID+', Frame#: '+ current_frame_number + '] - '+msg+'</div>';
   $( "#activity_log" ).append( appent_html);
}

function append_to_log_error(msg)
{
   var appent_html = '<div class="alert_custom alert-danger"> <strong> Failure! </strong>'+'[Annotation Id: '+selected_annotation.annotationID+', Frame#: '+ current_frame_number + '] - '+msg+'</div>';
   $( "#activity_log" ).append( appent_html);
}

function append_snackbar_msg_to_acticity_log(msg)
{
  var appent_html = '<div class="alert_custom alert-warning"><strong> Alert! </strong>'+msg+'</div>';
   $( "#activity_log" ).append( appent_html);
}



//Functions to show or hide the overlay div that shows the activity log
function show_overlay() {
    $("#overlay").show();
}

function hide_overlay() {
    $("#overlay").hide();
}

//Function that returns total number of features in all layers
function getfeatures_count()
 {
  var number_of_features = 0;
  Object.keys(vector_list).forEach(function(key) {
      number_of_features = number_of_features + Number(vector_source_list[key].getFeatures().length);
     });
  return number_of_features;
 }

// Called on clinck of refresh button in the menu
 function refresh()
 {
      clear_vector_sources();  
      clear_objects_counts();
      //vectorSource.clear();
      getFreeform_markedobjects();

 }


//logout function
function logout()
{

   //make an ajax call for logout
   $.ajax({
        type: "POST",
        url: url.logout,
        //data: JSON.stringify(authenticate_user),
        data: { username: selected_userid },
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          console.log("data from logout :: " + data);
          clear_map_and_vector_sources();
         
          //Clear tables for lab, project,Imageset and annotation
          clearTable('tblImageset');
          clearTable('tblAnnotationId');
          clearTable('tblProjectId');
          clearTable('tblLabsId');
          //clear map contents
          //$("#map").empty();

           mapExtent = [];
           tileExtent =[];

          //hide all divs other than login
          $("#workspace-select").hide();
          $("#pagination").hide();
          $("#map").hide();
          $("#breadcrumbz").hide();
          $("#nav_span").addClass("hide_elem")
          closeRightMenu();
          
          //clear username and password
          $("#username").val('');
          $("#password").val('');

          $( ".login-form" ).show();
           clear_current_variables();
           $('#object_count').empty();
           $('#object_count').hide();
          clearTimeout(idle_time);

          socket.emit('logout');
          //socket.disconnect();
          
        },
        failure: function(errMsg) {
            show_failure_alert("<br> Logout Failed. Please try again");
        },
        complete: function(xhr, textStatus) {
            console.log(xhr.status);
            if(xhr.status != 200)
            {
              show_failure_alert("<br> Logout Failed. Please try again");
            }
          } 
  });
}

