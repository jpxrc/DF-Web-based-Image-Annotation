//Variable for multiplayer
var socket = {}

//variable to keep count of session inactivity.
var inactive_time=0;

var isLoggedin = false;
//timer for session inactivity
var idle_time;
var selected_userid = '';
var selected_project = '';
var selected_imageset='';
var selected_annotation='';
var current_frame_number='';
var selected_lab='';
var loggedin_user='';
var class_layer_list='';
var class_layer_details={};
var fr_number_to_name={};
var max_frameObjectID = 0;
var path_prefix="../DragonFly/path_symlinks/"

var resolution='';
var style_list=  {};
var selected_style_list=  {};
var vector_source_list =  {};
var vector_list = {};

//Flag based on with draw intercation is added or deleted 
var draw_mode=false;

//Flag to determine whether the download link was clicked on the annotation or the annottaion was clicked to navigate to the map
download_flag = false;

//Fill color for annotations
var alpha_fill = new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.6)'
        });

var stroke = new ol.style.Stroke({
             width: 1
        });


var circle_image = new ol.style.Circle({
          radius: 1,
          })




// Variables related to drawing tile layer and vector layer

//Map extend and resolutions

//Extends - [minx, miny, maxx, maxy]
var mapExtent = [];
var mapMaxResolution = 1.00000000;
var mapMinZoom = 3;
var mapMaxZoom = 5;
var mapMaxResolution = 1.00000000;
//Extends - [minx, miny, maxx, maxy]
//var tileExtent = [0.00000000, -4032, 3024, 0];
var tileExtent = [];
//Map attributes
var map;
var image_tile_layer;

var vector_source = new ol.source.Vector();
var vector = new ol.layer.Vector();

var prev_zoom_level=-1;
//interactions
var draw;
var select;
var modify;
var snap;
var translate;
var selected_classlayer_id;
var selected_draw_tool;
var markedObjectID_of_saved_feature = -1;
var curr_modified_feature ;

var draw_shapes = new Object();
draw_shapes.Point='Point';
draw_shapes.LineString='LineString';
draw_shapes.Polygon='Polygon';
draw_shapes.Circle='Circle';
draw_shapes.Box='Box';


var draw_types = new Object();
draw_types.Point='point';
draw_types.LineString='line';
draw_types.Polygon='polygon';
draw_types.Circle='circle';
draw_types.Box='box';


//Object statistics variables
var count_by_objects = new Object();
count_by_objects.point = 0;
count_by_objects.polygon = 0;
count_by_objects.line = 0;
count_by_objects.circle = 0;
count_by_objects.box = 0;
count_by_objects.freeformPoly = 0;
count_by_objects.freeform = 0;
count_by_objects.curve = 0;
count_by_objects.total = function()
{
  return (count_by_objects.point + count_by_objects.polygon + count_by_objects.line + count_by_objects.circle + count_by_objects.box + count_by_objects.freeformPoly + count_by_objects.freeform + count_by_objects.curve);
}

var count_by_class = new Object();
//variable to hold frame ID max value count
var max_frame_object_count = 0;



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





