
function initialize_map()
{

  //TODO: Add intercations to the map later depending on the r/w permissions to the annottaion for the logged in user
  map = new ol.Map({
  target: 'map'});
  //map.addLayer(image_tile_layer);
} //initialize_map ends
 


function set_map_variables()
{
  
  mapExtent.push(0.00000000);
  mapExtent.push(Number(selected_imageset.resolutionHeight)*-1);
  mapExtent.push(Number(selected_imageset.resolutionWidth));
  mapExtent.push(0.00000000);
  
  
  
  tileExtent.push(0.00000000);
  tileExtent.push(Number(selected_imageset.resolutionHeight)*-1);
  tileExtent.push(Number(selected_imageset.resolutionWidth));
  tileExtent.push(0.00000000); 

  current_frame_number = 0;
  $("#pagination").show();
} 



var error_style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        }),
        stroke: new ol.style.Stroke({
          color: '#d23030',
          width: 1
        }),
        image: new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.6)'
          }),
          stroke: new ol.style.Stroke({
            color: '#d23030',
            width: 1
          })
        })
      });


/**
Function to highlight the vertices of the selected annottaion in white circles.
Returns geometry  object multi point that has cordinates of vertices(polygons/polylines)/endpoints (line)/center(Circle)
**/
function get_all_points_in_given_feature(curr_feature)
{
  var feature_type = (curr_feature.getProperties().type);
   if(typeof(feature_type) != 'undefined')
    {
      feature_type = convert_to_readable_type(curr_feature.getProperties().type);
      var style_geometry; 
      var coordinates = [] ;
      switch (feature_type) {
                case draw_types.LineString:
                     coordinates = curr_feature.getGeometry().getCoordinates();
                 break;

                case draw_types.Circle:
                    coordinates.push(curr_feature.getGeometry().getFirstCoordinate());
                    coordinates.push(curr_feature.getGeometry().getLastCoordinate());
                    break;
                 case draw_types.Polygon:
                      coordinates = curr_feature.getGeometry().getCoordinates()[0];
                    break;

                case draw_types.Point:
                   break;
     } //switch closes
     style_geometry = new ol.geom.MultiPoint(coordinates);
    }
  return style_geometry;
}


/**
* Function to chnage the style of the annottaion when its selected/deselected
*/
function change_select_style(curr_feature, is_sel)
{

      if(curr_feature.length > 0)
      {
            console.log('curr_feature.length::'+curr_feature.length);
           curr_feature.every(function(desel_feature) {
            var feature_type1 = desel_feature.getProperties().type;
            if(typeof(feature_type1) != 'undefined')
            {
               feature_type = convert_to_readable_type(feature_type1)
               console.log("feature_type:::" + feature_type);
                if(is_sel)
                {

                   var styles = [
       
                    selected_style_list[desel_feature.getProperties().classLayerID][feature_type],
                       new ol.style.Style({
                        image: new ol.style.Circle({
                          radius: 8,
                          fill: new ol.style.Fill({
                            color: 'white'
                          })
                        }),
                       geometry: function(feature) {
                         
                          return get_all_points_in_given_feature(desel_feature);
                        }
                      })
                    ];
                    
                    desel_feature.setStyle(styles);
                  /desel_feature.setStyle(selected_style_list[desel_feature.getProperties().classLayerID][feature_type]);*/


                  

                }
                else
                {
                  desel_feature.setStyle(style_list[desel_feature.getProperties().classLayerID][feature_type]);
                }
            }
          });
        
      }
}

//Function called when the dropdown in annotation deatils is changed
function update_selected_annotation_from_details()
{
  var features_selected = select.getFeatures();
  if(features_selected == 'undefined' || features_selected.getArray().length == 0 || features_selected.getArray().length > 1)
   {
      clear_annotation_details();
   }
   else
   {
       
      var new_class_selected = $('#classLayerDropbox').val();
      var feature = features_selected.getArray()[0];
      var properties = feature.getProperties()
      var feature_type = properties.type;
      properties.classLayerID = new_class_selected;
      properties.label=class_layer_details[new_class_selected][2];
      //if(feature_type == "freeForm" || feature_type == "freeFormPoly" )
      //{
        feature_type = convert_to_readable_type(feature_type)
     // }
      feature.setStyle(selected_style_list[new_class_selected][feature_type]);
      feature.properties = properties;
     //handle_modify_feature(feature);
      
      //TODO: Save to DB
   }
}

function update_annotation_details_dialog()
{
    console.log("update_annotation_details_dialog");
     console.log("update_annotation_details_dialog called");
     var add_div = '<div>Object Id: </div>';
     var features_selected = select.getFeatures();
     //$("#dialog").empty();
     console.log(features_selected);
     if(features_selected == 'undefined' || features_selected.getArray().length == 0)
     {
        clear_annotation_details();
     }
     else if(features_selected.getArray().length > 1)
     {
      
        clear_annotation_details();
        add_div = '<div id="multi_feature">More than one feature selected </div>';
        $("#multi_feature").empty();
        $("#deatils_type").empty();
        $("#deatils_frameObjectID").empty();
        $("#dialog").append(add_div);
     }
     else
     {
      var feature = features_selected.getArray()[0];
      var properties = feature.getProperties();
      var feature_type = properties.type;
      $("#deatils_type").empty();
      $("#deatils_frameObjectID").empty();


      $("#classLayerDropbox").val(properties.classLayerID);
      $("#deatils_type").append(properties.type);
      $("#deatils_frameObjectID").append( properties.frameObjectID);
     }

}


//Clear the contents of the annotation details div
function clear_annotation_details()
{
  $("#deatils_type").empty();
  $("#deatils_frameObjectID").empty();
  $("#classLayerDropbox").val('');
}


function initialize_interaction_variables()
{

    select = new ol.interaction.Select({
      condition: ol.events.condition.click,
      toggleCondition: ol.events.condition.shiftKeyOnly,  
    });
     
     select.on('select', function (event) {

      var deselected_feature = event.deselected;
      var selected_feature = event.selected;
      
      change_select_style(deselected_feature, false);
      change_select_style(selected_feature, true);
      update_annotation_details_dialog();



      

     });

     /* modify = new ol.interaction.Modify({
        source: vector_source_list,
        features: select.getFeatures(),
        deleteCondition: ol.events.condition.singleClick,
        /*function(event){
             return (ol.events.condition.singleClick);
                    },
        insertVertex: false,
        
         insertVertexCondition: function() {
          // prevent new vertices to be added to the polygons
         // return !this.features_.getArray().every(function(feature) {
            console.log("Modify called")
            //return feature.getGeometry().getType().match(/Polygon/);
            return true;
         // });
        }
      });


      modify.on('modifyend', function (event) {

         //curr_modified_feature = e.features.getArray()[0];
         // handle_modify_feature(event.target);
          console.log("Modify_end")
         //box_on_change(event.features.getArray()[0]);
         var x_mod;
         var y_mod;

          
     }); //modify.on ends */




      snap = new ol.interaction.Snap({features: select.getFeatures()});


     
     
}


function box_on_change(feature)
{
        var geoJsonGeom = new ol.format.GeoJSON();    
         var pp = geoJsonGeom.writeGeometry(feature.getGeometry());
         var properties = feature.getProperties();
         var type = properties.type;
        console.log("box_on_change1::: "+feature.getGeometry().getFirstCoordinate());
        console.log("box_on_change2::: "+feature.getGeometry().getLastCoordinate());

          var mousePositionControl_temp = new ol.control.MousePosition({
         coordinateFormat: function(coordinate, x_mod, y_mod) {
      y_mod = coordinate[1]*(-1);
      x_mod = coordinate[0];
      return ol.coordinate.format(coordinate, '{x},{y}.', 4);}
      });
}



function handle_modify_feature(feature)
{
         var geoJsonGeom = new ol.format.GeoJSON();    
         var pp = geoJsonGeom.writeGeometry(feature.getGeometry());
         var properties = feature.getProperties();
         var type = properties.type;
         var markedObject = form_marked_object_to_modify(properties);
         switch (type) {
                case "freeForm":
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
                  update_markedObject_to_db(markedObject, url.saveFreeFormPoly);
                    
                    break;
                case "freeFormPoly":
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
                    update_markedObject_to_db(markedObject, url.saveFreeFormPoly);
                    break; 

                case "point":
                     var point = $.parseJSON(pp).coordinates;

                      point_object.x = point[0];
                      point_object.y = Number(point[1])*-1;


                      markedObject.pointObject = point_object;
                      update_markedObject_to_db(markedObject,url.savePointObject);
                     break; 

                case "line":
                  var points = $.parseJSON(pp).coordinates;
           
                  var lineObject = new Object();

                   lineObject.x1 = Number(points[0][0]);
                   lineObject.y1 = Number(points[0][1])*-1;

                   lineObject.x2 = Number(points[1][0]);
                   lineObject.y2 = Number(points[1][1])*-1;

                  markedObject.lineObject = lineObject;
                  
                  update_markedObject_to_db(markedObject,url.saveLineObject);

                  break;

                case "box":
                  
                  
                  break;
                case "circle":

                       var first_point = feature.getGeometry().getFirstCoordinate();
                        var last_point = feature.getGeometry().getLastCoordinate();
                        var circle = new Object();

                       circle.x1 = Number(first_point[0]);
                       circle.y1 = Number(first_point[1])*-1;

                       circle.x2 = Number(last_point[0]);
                       circle.y2 = Number(last_point[1])*-1;
                       markedObject.circle = circle;
                       update_markedObject_to_db(markedObject,url.saveCircle);
                  break;
                case "bspline":
                  
                  break;
                default: 
                  console.log("unknown type :: "+item.type)

            } //switch case ends
}

// Function to fetch image tiles and display on the UI
//creates Map instances and add layers to it.
//Vector layer is obatined my making a service call to MarkedObjectService
function draw_image()
{

  
  var mapResolutions = [];
  var max_dim = selected_imageset.resolutionHeight;
  if( max_dim < selected_imageset.resolutionWidth)
  {
    max_dim = selected_imageset.resolutionWidth;
  }
  for (var z = 0; z <= mapMaxZoom; z++) {
    mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);  
   
  }
  console.log("mapResolutions:: "+ mapResolutions);


  var mapTileGrid = new ol.tilegrid.TileGrid({
    extent: tileExtent,
    minZoom: mapMinZoom,
    resolutions: mapResolutions
  });

 
  //Add image layer to the map
  var image_tile_layer = new ol.layer.Tile({
          source: new ol.source.XYZ({
          projection: 'PIXELS',
          cacheSize: 4096,
          tileGrid: mapTileGrid,
          //url: "/datasets/20170607_155447/{z}/tiled_{y}_{x}.jpg"
          url: url.tile +"?maxresolution="+mapMaxZoom+"&resolution={z}&row={y}&col={x}&path="+path_prefix+selected_imageset.path+"tiled/&image="+fr_number_to_name[current_frame_number]
          //x-> column, y->row
         
    })
  });


  

  initialize_interaction_variables();


  // add this control to map to show the position of the cursor on the UI
  var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: function(coordinate) {
      coordinate[1] = coordinate[1]*(-1);
      return ol.coordinate.format(coordinate, 'X: {x}, Y: {y}.', 2);
    },
  //projection: 'PIXELS',
  className: 'custom-mouse-position',
  target: document.getElementById('cursor_pos_div'),
  undefinedHTML: '&nbsp;'
});

var projection = new ol.proj.Projection({
  units: 'PIXELS',
  extent: [0, Number(selected_imageset.resolutionHeight)*-1, selected_imageset.resolutionWidth, 0]
});


     map = new ol.Map({

        target: 'map',
        layers: [ image_tile_layer],
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }).extend([mousePositionControl]), 
        interactions: ol.interaction.defaults().extend([select]),
        view: new ol.View({
       center:  ol.extent.getCenter(tileExtent),
       //center: ol.proj.transform([37.41, 8.82], this.options.markerEPSG, this.options.mapEPSG),
        zoom: prev_zoom_level,
        //maxZoom: (mapMaxZoom-mapMinZoom),
        extent: tileExtent,
        //minZoom: mapMinZoom,
        //projection: ol.proj.get('PIXELS'),
       // projection: projection,
        maxResolution: mapTileGrid.getResolution(mapMinZoom)
        }) //view ends
    }); //Map ends
  
  // map.getView().fit(mapExtent, map.getSize());
   
   // console.log(map.getView().getCenter());
    //$("button").hide();

retain_draw_mode();
} //draw_image() ends


//retain draw mode from previous frame()
function retain_draw_mode()
{

  if(draw_mode && draw != null && draw != undefined)
  {
    map.addInteraction(draw);
  }
}



//Function to set canvas dimensions
function set_canvas_dimensions()
{
  var cnvs = document.getElementById("map");
  cnvs.height = window.innerHeight - 200;
  console.log("height::: "+ cnvs.height)
  cnvs.width =   window.innerWidth;
}

function getMarkedObjectVectorLayer(annotationID)
{
  var markedObjectRequest = new Object();
   markedObjectRequest.annotationID = 139;
   markedObjectRequest.frameNumber= 0;

  $.ajax({
        type: "POST",
        url: url.getFeatureObjects,
        data: JSON.stringify(markedObjectRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          console.log(data);
         
          vector_source.addFeatures(data.features);

           },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}


function getFreeform_markedobjects1()
{

}

//Make service call to get markedobjects for the selected annotation annotationID
function getFreeform_markedobjects()
{
  
  console.log(" :::: in getFreeform_markedobjects:::: ");
  var markedObjectRequest = new Object();
   markedObjectRequest.annotationID = selected_annotation.annotationID;
   markedObjectRequest.frameNumber= current_frame_number;
   $.blockUI({ message: '<img src="assets/images/loading.gif"/>',
    css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: 'transparent',
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .6,
            height:'70px'
        }  });
  var start = new Date();
  $.ajax({
        type: "POST",
        url: url.getMarkedObjects,
        data: JSON.stringify(markedObjectRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          var end = new Date();
          console.log(data);
          draw_annotations(data);// associate click with each tr
          add_vector_list_to_map();
          append_to_log_info("Navigated to frame# "+current_frame_number + ", # of annotations: "+data.length+", Time taken to retreive: "+(end.getTime() - start.getTime())+"ms");
          $.unblockUI();
          },
        failure: function(errMsg) {
            $.unblockUI();
            alert(errMsg);
        }
  });
}

function draw_image_and_annotations()
{
  clear_map_and_vector_sources();
  initialize_map();
  draw_image();
  getFreeform_markedobjects();
  $( ".ol-viewport" ).each(function( index ) {
      console.log( $( this ) )
      if(index==0)
      {
        $( this ).height( 0 );
      }
      
    });
   //Add interactions
   
}


function calculate_distance_between_2_points(x1,y1,x2,y2)
{
  var a = x1 - x2;
  var b = y1 - y2;
  var distance = Math.sqrt( a*a + b*b );
  return distance;
}

//This functions reads every markedObject returned by the service calls and creates a the corresponding openlayers feature and geometry objects (depending on the markedObject type)
//and sets the features to the vector layer
function draw_annotations(data)
{
    max_frame_object_count = 0;
    data.forEach(function(item) {

        switch (item.type) {
                case "freeForm":
                    var points = [];
                    item.freeFormPoint.forEach(function(elem)
                    {
                      points.push([elem.x,Number(elem.y)*-1]);
                    });
                    var geometry = new ol.geom.Polygon([points]);
                    var feature = new ol.Feature();
                    feature.setStyle(style_list[item.classLayerID].polygon);

                   
                    count_by_objects.freeform = count_by_objects.freeform + 1;
                    /*feature.on("change", function (event) {
                            console.log(feature.getId() + " has been changed!\n");
                            if(points.length == 5)
                             return handle_box_modify(event);

                     });*/
                   
                    break;
                case "freeFormPoly":
                    var points = [];
                    item.freeFormPoly.forEach(function(elem)
                    {
                      points.push([elem.x,Number(elem.y)*-1]);
                     
                    });
                     console.log("points::")
                      console.log(points)
                    var geometry = new ol.geom.LineString(points);
                    var feature = new ol.Feature();
                    feature.setStyle(style_list[item.classLayerID].line);
                    count_by_objects.freeformPoly =  count_by_objects.freeformPoly + 1;
                    break; 

                case "point":
                     var x = Number(item.pointObject.x); 
                     var y = Number(item.pointObject.y)*-1; 
                     var geometry = new ol.geom.Point([x,y]);
                     var feature = new ol.Feature();
                     feature.setStyle(style_list[item.classLayerID].point);
                     count_by_objects.point =  count_by_objects.point + 1;
                     break; 

                case "line":
                  var points = [[Number(item.lineObject.x1),Number(item.lineObject.y1)*-1], [Number(item.lineObject.x2),Number(item.lineObject.y2)*-1]]; 
                  var geometry = new ol.geom.LineString(points);
                  var feature = new ol.Feature();
                  feature.setStyle(style_list[item.classLayerID].line);
                  count_by_objects.line =  count_by_objects.line + 1;
                  break;

                case "box":
                  count_by_objects.box =  count_by_objects.box + 1;

                  var points = [];
                  var x = Number(item.boxObject.x);
                  var y = Number(item.boxObject.y);
                  var width = Number(item.boxObject.width);
                  var height = Number(item.boxObject.height);
                   points.push([x,Number(y)*-1]);
                   points.push([x+width,Number(y)*-1]);
                   points.push([x+width,Number(y + height)*-1]);
                   points.push([x,Number(y + height)*-1]);
                  var geometry = new ol.geom.Polygon([points]);
                  geometry.on('change', function(e) {
                        var coordinates = e.target.getCoordinates();
                        // do something with the coordinates
                      console.log("box_changed::: "+coordinates);
                  },this);
                  var feature = new ol.Feature();
                  feature.setStyle(style_list[item.classLayerID].polygon);
                  
                  break;
                case "circle":

                  var x1 = Number(item.circle.x1);
                  var y1 = Number(item.circle.y1);

                  var x2 = Number(item.circle.x2);
                  var y2 = Number(item.circle.y2);
                  var radius = calculate_distance_between_2_points(x1,y1,x2,y2);
                  var geometry = new ol.geom.Circle([x1,(y1*-1)],radius);
                  var feature = new ol.Feature();
                  feature.setStyle(style_list[item.classLayerID].circle);
                  count_by_objects.circle =  count_by_objects.circle + 1;
                  break;
                case "bspline":
                  
                  break;
                default: 
                  console.log("unknown type :: "+item.type)

            } //switch case ends
            


            var properties = new Object();
            properties.annotationID = item.annotationID;
            properties.createdBy = item.createdBy;
            properties.frameNumber = item.frameNumber;
            properties.frameObjectID = item.frameObjectID;
            properties.markedObjectID = item.markedObjectID;
            properties.type = item.type;
            properties.classLayerID = item.classLayerID;
            properties.label = item.label;

            //get the max of frameObjectID and retain it in variable max_frame_object_count.
            // next time an markedObject is saved. increment max_frame_object_count and set in frameObjectID 
            if(!isNaN(Number(item.frameObjectID)) && max_frame_object_count < Number(item.frameObjectID))
            {
              max_frame_object_count = Number(item.frameObjectID);
            }
             

             geometry.on('change', function(e) {
                //console.log(e);
               // var coordinates = e.target.getCoordinates();
                //console.log("box_changed::: "+coordinates);
            }, this);
           feature.setGeometry(geometry);
           feature.setProperties(properties);
           feature.setId(item.markedObjectID);
           vector_source_list[item.classLayerID].addFeature(feature);
         });
        
        console.log(count_by_objects);
        populate_object_count();

    
   
 }


 function add_vector_list_to_map()
 {
  Object.keys(vector_list).forEach(function(key) {
    vector_list[key].setSource(vector_source_list[key]);
       map.addLayer(vector_list[key]);
     });
 }

 function clear_vector_sources()
 {
    
    Object.keys(vector_list).forEach(function(key) {
      vector_source_list[key].clear();
    });
    
    
 }


 function clear_map()
 {
    $("#map").empty();
    if(map != '')
    {
      map = ''
    }
 }


 function clear_map_and_vector_sources()
 {
    clear_vector_sources();
    clear_map();

 }

function jump_to_frame()
{

  console.log("jump_to_frame called::::");
  prev_zoom_level = map.getView().getZoom();
  current_frame_number = Number($('#frame_names_select').find(":selected").val());
  console.log("current_frame_number:: "+ current_frame_number)
  set_breadcrumbz();
  clear_map_and_vector_sources();
  navigate_frame();
}

function navigate_frame()
{
   console.log("in navigate frame:::")
    clear_variables_on_frame_nav();
    draw_image_and_annotations();
}


function prev_frame()
{

  prev_zoom_level = map.getView().getZoom();
  if(current_frame_number == 0)
  {
    current_frame_number = Number(selected_imageset.numberOfFrames) - 1;
  }
  else
  {
    current_frame_number = current_frame_number - 1;
  }
  set_breadcrumbz();
  clear_map_and_vector_sources();
  navigate_frame();
}


function next_frame()
{
  prev_zoom_level = map.getView().getZoom();
  if(current_frame_number == (Number(selected_imageset.numberOfFrames) - 1))
  {
    current_frame_number = 0;
  }
  else
  {
    current_frame_number = current_frame_number + 1;
  }
  set_breadcrumbz();
  clear_map_and_vector_sources();
  navigate_frame();
}

function convert_to_readable_type(feature_type)
{
  if(feature_type == "freeFormPoly" )
  {
     return "line";
  }
  if(feature_type == "freeForm" || feature_type == "box" )
  {
    return "polygon";
  }
  else 
  {
    return feature_type;
  }
}

