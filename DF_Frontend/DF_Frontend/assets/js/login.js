
//This block in invoked when index.html file is loaded
$( document ).ready(function() {
   onready();


   //make all text on the page responsive
   //$("body").fitText();
   
   //enable tooltip
   $('[data-toggle="tooltip"]').tooltip(); 

    hide_map_page_divs();
    document.addEventListener('keydown', deleteFeature, false);
    //stats_model_setup();
    add_pagination_click();
    //$( "#map" ).on( "swipe", function( event ) { event.stopPropagation(); } );
    reset_timer();
    //long_press_on_map();



$('#dialog').dialog({
  autoOpen: false,
  dialogClass : 'header-bar'
});


    

});
 
//function to identify a long press event inside the div map
function long_press_on_map()
{
  var startTime, endTime, longpress;

    $("#map").on('click', function () {
        if (longpress) 
         handle_long_press(); 
    });

    $("#map").on('mousedown', function () {
        startTime = new Date().getTime();
    });

    $("#map").on('mouseup', function () {
        endTime = new Date().getTime();
        longpress = (endTime - startTime > 1200) ? true : false;
    });
}

function handle_long_press()
{
  console.log("Long Press event")
  update_annotation_details_dialog();
  $('#dialog').dialog('open');

}

function update_inactive_time() {
    inactive_time = inactive_time + 1;
    if (inactive_time > 12) { // 10 minutes of no user activity on screen
      //TODO: Show a 30 sec modal window
       //force logout;
       logout();
       //TDOD: unregister timer
    }
}


function reset_timer()
{
  //Increment the idle time counter every minute.
     idle_time = setInterval(update_inactive_time, 60000); // 1 minute
    console.log("idle_time::"+idle_time);
    //reset timer on activity
    $(this).mousemove(function (e) {
        inactive_time = 0;
    });
    $(this).keypress(function (e) {
        inactive_time = 0;
    });

    

    
}


/*
* This function gets invoked when the next '>' or previous '<' arrows get clicked 
*/
function add_pagination_click()
{
  $(document).on('click', '#next', function() {
      next_frame();
    });

   $(document).on('click', '#prev', function() {
      prev_frame();
    });
}

/*
//function to show statistics. needs jquery-ui-min.js
function stats_model_setup()
{

  $('.modal-content').resizable({
    //alsoResize: ".modal-dialog",
    minHeight: 100,
    minWidth: 100
  });
  $('.modal-dialog').draggable();
  $('.modal-dialog').addClass('statistics_div');

    $('#stats_model').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
            'max-height':'100%'
        });
    });


// Show loader & then get content when modal is shown
 $("#stats_model").on('show.bs.modal', function() {
  console.log("::on model show::")
  create_bar_chart_objects();
});
    
}

*/


/**
This function get called from $( document ).ready(...).
Attcahes a focusout function to the username text field. 
The focus out function validates if the etered username exists in the list of users
Throws an error for invalid user.
**/
function onready()
{
	$("#username").on("focusout", function(e){

   var $input = $(this),
       val = $input.val();
       list = $input.attr('list'),
       match = $('#'+list + ' option').filter(function() {
       	if($(this).val() === val)
       	{
       		selected_userid = $(this).attr("id");
       	}
           return ($(this).val() === val);
       });

       if(match.length > 0) {
        $("#username").addClass("login-textbox");
        $("#username").removeClass("error-textbox");
        $("#password").focus();

    } else {

    	//TODO: highlight test box and show error - wrong user name
         console.log("nomathchfound");
         $("#username").addClass("error-textbox");
        // $("#username").removeClass("login-textbox");

    	}
	}); //handler function closes
} //  onready() ends


/**
This function makes a webservice to UserService to fetch all the users from the database.
From the returned list of users, forms the list to populate $('#user-list')
**/
function fetchUsers()
{

	//TODO : ERROR HANDLING
	var data="null";
   $.get(url.getall, function(response) {
   	    data = response;
        var optionslist = '';
        $.each(data, function(index, value) {
			optionslist = optionslist + '<option value="'+value[1]+'" id="'+value[0] +'" >'+value[1]+'</option>';
        }); //each closes
       // optionslist = '<select>'+optionslist+'</select>';
        $('#user-list').append(optionslist);
   });

   return data;
}



/**
Function is called when login button is clicked on the UI. 
Makes a service call to authenticateUser to validate the credentials
**/
function login()
{

  //Read username and password from the text feilds
	var user_name = $("#username").val();
	var password = $("#password").val();

	
    //hide divs   
   hideById('annotation');
   hideById('imageset');
   hideById('project');


   //Create request payload
   var authenticate_user = new Object();
   authenticate_user.email =  user_name;
   authenticate_user.passHash = password;
   


   //make an ajax call to the authenticate service
	 $.ajax({
        type: "POST",
        url: url.authenticateUser,
        //data: JSON.stringify(authenticate_user),
        data: { username: user_name, password: password },
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
        	console.log("data :: " +  data.status);
        	
            // register with node client for multiplayer
            socket = io(url.multiplayer);
            register_db_update_event();

        		isLoggedin = true;
            append_to_log_info("Logged in as "+user_name);
            //make service call to fetch the labs for the user
            fetchUserLabs();

            //show the hamburger menu on the header. //TODO: move this to after image load
            $("#nav_span").removeClass("hide_elem");
            $("#nav_span").addClass("show_elem");
        	
        },
        statusCode: {
              401: function() {
                console.log("in 401");
                 $("#password").addClass("error-textbox");
              }
          },
        error: function(errMsg) {
          //selected_userid ='';
          $("#password").addClass("error-textbox");
           $("#login_err_msg").show();
        }
  });
}

  
  //Function to change the background as you hover on a table row
  function hoverForTr()
  {
     $("tr").not(':first').hover(function () {
          $(this).css("background","#5d7ab7");
       }, 
        function () {
          $(this).css("background","");
        }
    );
  }


function populateLabs(labs)
{
	var new_row;
	$.each(labs, function(index, value) {
			
			new_row = '<tr class="acc-font" ><td>'+value.labID+'</td><td>'+value.labTitle+'</td><td>'+value.description+'</td></tr>';
			$('#tblLabsId').addClass('table-hover');
			$('#tblLabsId tbody').append((new_row));
		});


	 $('#tblLabsId tr').click(function() {
       //Add style to selected row
       $(this).addClass("tr-selected").siblings().removeClass("tr-selected");
       var all_tds = $(this).find("td");
       selected_lab = new Object();
       selected_lab.id = all_tds[0].innerHTML;
       selected_lab.name = all_tds[1].innerHTML;
       selected_lab.description = all_tds[2].innerHTML;
       

       clearTable('tblProjectId');
       clearTable('tblImageset');
       clearTable('tblAnnotationId');
       hideById('annotation');
       hideById('imageset');
       append_to_log_info("Selected Lab :  "+selected_lab.name);
	 	   getProjectsForLab(selected_lab.id);
		});
   

	 hoverForTr();

	 sortTable($('#tblLabsId'),'asc');

}


//remove the contents of the table with id tableID
function clearTable(tableID)
{
  var data_table = $('#'+tableID).DataTable()
  data_table.clear();
  data_table.destroy();
  var remove_selector = '#'+tableID+' '+'tbody tr';
  $(remove_selector).remove();
  
}


function populateProjects(data)
{

   var new_row;
   $.each(data, function(index,value)
   {
      new_row = '<tr class="acc-font" ><td>'+value.projectID+'</td><td>'+value.title+'</td><td>'+value.creator+'</td></tr>';
      $('#tblProjectId').addClass('table-hover');
      $('#tblProjectId tbody').append((new_row));
   });


   $('#tblProjectId tr').click(function() {
       //Add style to selected row
       $(this).addClass("tr-selected").siblings().removeClass("tr-selected");

       var all_tds = $(this).find("td");
       selected_project = new Object();
       selected_project.id = all_tds[0].innerHTML;
       selected_project.name = all_tds[1].innerHTML;
       selected_project.creator = all_tds[2].innerHTML;


       clearTable('tblImageset');
       clearTable('tblAnnotationId');
       getClassLbelsForProject(selected_project.id);
       append_to_log_info("Selected project  :  "+selected_project.name);
       getImagesetForProject(selected_project.id);
     }); 
  
   hideById('annotation');
   
   showById('project');

    hoverForTr();
}

function decToHex(dec) {
    return (dec + Math.pow(16, 6)).toString(16).substr(-6);
}


function create_style(class_color, class_label, class_layer_id)
{
  
  
  style_list[class_layer_id].point = create_point_style(class_color, class_label, 6);
  style_list[class_layer_id].polygon = create_polygon_style(class_color, class_label, 3);
  style_list[class_layer_id].line = create_line_style(class_color, class_label, 3);
  style_list[class_layer_id].circle = create_circle_style(class_color, class_label,3);
  
  selected_style_list[class_layer_id].point = create_point_style(class_color, class_label, 13);
  selected_style_list[class_layer_id].polygon = create_polygon_style(class_color, class_label, 7);
  selected_style_list[class_layer_id].line = create_line_style(class_color, class_label, 7);
  selected_style_list[class_layer_id].circle = create_circle_style(class_color, class_label,7);

  //create vector source and vector layers corresponding to each class layers and assign the corresponding style to vector layer
  vector_source_list[class_layer_id] = new ol.source.Vector();
  vector_list[class_layer_id] = new ol.layer.Vector();
  
}


function create_point_style(class_color, class_label, radius)
{


    var fill = new ol.style.Fill({
            color: class_color
           });

    var label_txt = new ol.style.Text({
    text:class_label
   });
    var  stroke_class = new ol.style.Stroke({
          color: class_color,
          width: 1,
          text : label_txt
          
        })

    var point_circle = new ol.style.Style({

        image: new ol.style.Circle({
                    radius: radius,
                    fill: fill,
                    stroke: stroke_class
                })
       
      });

  return point_circle 
  
}

function create_circle_style(class_color, class_label,width)
{
  var circle_style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: class_color,
          width: width,
          text: new ol.style.Text({
            text:class_label
           })
        })
      });

  return circle_style;
}


function create_polygon_style(class_color, class_label, width)
{

    var polygon_style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: class_color,
          width: width,
          text: new ol.style.Text({
            text:class_label
           })
        })
      });

   return polygon_style;
   
}




function create_line_style(class_color, class_label, width)
{

    var line_style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: class_color,
          width: width,
          text: new ol.style.Text({
            text:class_label
           })
        })
      });

   return line_style;
}

//gets invoked when a class layer is selected from the class dropdown in the menu.
function select_class(id)
{
  selected_classlayer_id = id;
  //Add style to selected row
  $("#classlayerdiv_"+id).addClass("tr-selected").siblings().removeClass("tr-selected");
  force_expand_tools();
}

//Function called when the check box "show all labels" under class layers is clicked. 
function show_all_labels()
{
  if($("#class_label_all_checkbox").is(':checked'))
  {

     // If any class label is not checked, check it.
    $("input[name='class_label_checkbox']").each(function() {
       if(!this.checked )
            {
              this.click();
              
            }
            console.log(this.id)
            $("#"+this.id).addClass('invisible_elem');
            $("#"+this.id).removeClass('visible_elem');
    });

  }
  else
  {
    
        $("input[name='class_label_checkbox']").each(function() {
                console.log(this.id)
            $("#"+this.id).removeClass('invisible_elem');
            $("#"+this.id).addClass('visible_elem');
    });
  }
}

/**
*This function is called when the checkbox in the class labels menu to enable/diable to class layer is changed.
*
*/
function filter_layer_display(class_layer_id)
{

  if($("#class_label_checkbox"+class_layer_id).is(':checked'))
  {
     vector_list[class_layer_id].setVisible(true);
     $("#classlayer_"+class_layer_id).removeClass('disabled_anchor');

  }
  else
  {
    vector_list[class_layer_id].setVisible(false);
    $("#classlayer_"+class_layer_id).addClass('disabled_anchor');


  }

}

/**
*This function generates html content that goes into the classlabels div. Populates the div the class labels in class_layer_list(whose values are obtained from the service call)
*
*/
function populateClassLabels()
{
  $("div#classlabels").empty();
  var checkbox_label;
  //This variable used to populate the select dropdown in the annotations details page.
  var classLayersOptionsForDetailsDiv='';
  var option_css='';


  $.each(class_layer_list, function(index, value)
  {
       var canvas_tag = '<canvas id="'+value.classLayerID+'" width="30" height="15"> </canvas>';
       var checkbox_label = '<div class="col-sm-1"><input type="checkbox" name="class_label_checkbox" class="invisible_elem" onclick="filter_layer_display('+value.classLayerID+')" id="class_label_checkbox'+value.classLayerID+'" checked /></div>';
       $("div#classlabels").append(checkbox_label);
       //$("div#classlabels").append('<div class="col-sm-10 no_sides_padding_imp"><a href="#"  onclick="select_class('+value.classLayerID+')" id= "classlayer_'+value.classLayerID+'">' +  canvas_tag + '&nbsp;'  +value.className  + '</a></div>');
       $("div#classlabels").append('<div id="classlayerdiv_'+value.classLayerID+'"><a href="#" class="no_sides_padding_imp"  onclick="select_class('+value.classLayerID+')" id= "classlayer_'+value.classLayerID+'">' +  canvas_tag + '&nbsp;'  +value.className  + '</a></div>');

       option_css = {
          
          "background-color": value.color
        }
        //populate class layer  in select classLayerDropbox
        classLayersOptionsForDetailsDiv = '<option value="'+value.classLayerID + '">'+value.className+'</option>';
        $("#classLayerDropbox").append(classLayersOptionsForDetailsDiv);
        $("#classLayerDropbox").children().last().css(option_css);
        option_css='';
  });

  
  
  $.each(class_layer_list, function(index, value)
   {
        var c = document.getElementById(value.classLayerID);
        var ctx = c.getContext("2d");
        var class_color = '#'+decToHex(value.color);;
        ctx.fillStyle=class_color;
        ctx.fillRect(0, 0, 30, 15);

        style_list[value.classLayerID] =  new Object();
        selected_style_list[value.classLayerID] =  new Object();
        create_style(class_color, value.className, value.classLayerID);
        class_layer_details[value.classLayerID] = [class_color, value.className, value.baseString];
        //$("#classLayerDropbox :nth-child("+index+")").append(c);
        
    });
  
  console.log(style_list)
 }



/**
* This function is called when the download icon is clicked for an annotation
*/
function download_annotation(download_annotationID)
{
  //service call
  downloadAnnotations(download_annotationID);
  download_flag = true;
}


//This function gets called when annotation is selected
function populateAnnotations(data)
{
   var new_row;
   $.each(data, function(index,value)
   {
      new_row = '<tr class="acc-font" ><td><a class="w3-hover-green" data-toggle="tooltip" title="download" data-placement="top" href="#"><img src="assets/images/download.png"/></a></td><td>'+value.annotationID+'</td><td>'+value.title+'</td><td>'+value.imageset.maxResolution+'</td></tr>';
      $('#tblAnnotationId').addClass('table-hover');
      $('#tblAnnotationId tbody').append((new_row));
   });


   $('#tblAnnotationId tr').click(function() {

      //Add style to selected row
       $(this).addClass("tr-selected").siblings().removeClass("tr-selected");

      var all_tds = $(this).find("td");
      selected_annotation = new Object();
      selected_annotation.annotationID = all_tds[1].innerHTML;
      selected_annotation.title = all_tds[1].innerHTML;
      selected_annotation.maxResolution = all_tds[3].innerHTML;
      console.log("selected_annotation.maxResolution::: "+selected_annotation.maxResolution)
      if(!download_flag)
      {
        $("#workspace-select").hide();
        $("#map").show();
        set_map_variables();
        append_to_log_info("Selected Annotation  :  "+selected_annotation.annotationID);

        getFrameNumberToNameMapping();
      }
      download_flag = false;
      return false;
      
    }); 

   //attach function to the link inside the tr
   $('#tblAnnotationId tr td a').click(function() {

      console.log("#tblAnnotationId tr td a");
      var all_tds = $(this).parent().parent().find("td");
      console.log(all_tds)
      download_annotation(all_tds[1].innerHTML);
      
   }); 
  
   showById('annotation');
   hoverForTr();
}




function set_breadcrumbz()
{
  var html_inner = '<a href="#" id="brc_lab" onclick="go_to_lab();">'+ selected_lab.name +'</a> &nbsp;&#10095;&nbsp; <a href="#"  onclick="go_to_project();" id="brc_project">'+ selected_project.name +'</a> &nbsp;&#10095;&nbsp; <a href="#" onclick="go_to_imageset();"  id="brc_imageset">'+ selected_imageset.path +'</a> &nbsp;&#10095;&nbsp; '+ selected_annotation.annotationID  +' &nbsp;&#10095;&nbsp; ';
  $("#frame_names_select").val(current_frame_number);
  //var html_inner = html_inner + '<input type="text" /> '
  
  var retain = $('#breadcrumz_data').children().not('a');
  $('#breadcrumz_data').html(html_inner);
  $('#breadcrumz_data').append(retain);
  //Clear cursor pos div on every load. Openlayer will keep appending position divs and you will land up with empty space above the map, if you do not do this.
  //This needs to be done on frame navigation too.
  $('#object_count').show();

  $('#cursor_pos_div').empty();
  $('#object_count').empty();

  
  
 }

//called when lab is clicked on the breadcrumbz
function go_to_lab()
{
  goHome();

  hideById('annotation');
  hideById('imageset');
  hideById('project');
  $("div#classlabels").empty();


}

//called when project is clicked on the breadcrumbz
function go_to_project()
{
  goHome();
  $("div#classlabels").empty();
  hideById('annotation');
  hideById('imageset');
}

//called when imageset is clicked on the breadcrumbz
function go_to_imageset()
{
  goHome();
  hideById('annotation');
}


//Populate imageset table with the results
function populateImageset(data)
{
 var new_row;
   $.each(data, function(index,value)
   {
      
      new_row = '<tr class="acc-font" ><td>'+value[0]+'</td><td>'+value[1]+'</td><td>'+value[2]+'</td><td>'+value[3]+'</td></tr>';
      
      $('#tblImageset').addClass('table-hover');
      $('#tblImageset tbody').append((new_row));
   });


   $('#tblImageset tr').click(function() {
    
    //Add style to selected row
    $(this).addClass("tr-selected").siblings().removeClass("tr-selected");

     var all_tds = $(this).find("td");
     selected_imageset = new Object();
     selected_imageset.path = all_tds[0].innerHTML;
     selected_imageset.numberOfFrames = all_tds[1].innerHTML;
     selected_imageset.resolutionWidth = all_tds[2].innerHTML;
     selected_imageset.resolutionHeight = all_tds[3].innerHTML;

      clearTable('tblAnnotationId');
      append_to_log_info("Selected Imageset  :  "+selected_imageset.path);
      getAnnotationsForImageset(selected_imageset.path)
     }); 
  
  
    hideById('annotation');
    showById('imageset');

    $('#tblImageset').DataTable( {
        scrollY:        '25vh',
        scrollCollapse: true,
        paging:         false
    } );

$('#tblImageset').addClass('table');
$('#tblImageset').removeClass('dataTable');
    hoverForTr();
}


//service call to get project for the lab
function getProjectsForLab(labId)
{
  var project = new Object();
  project.labID = labId;
  
  
  $.ajax({
        type: "GET",
        url: url.getprojects+"/"+labId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          
          populateProjects(data);// associate click with each tr


           },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}


/*
*This functions calls the getrosultion service of the tiling service to get the number of resolutions in the tiff file
*
*/
function fetch_pyramid_depth(image_for_pdepth)
{

  serv_url = "https://tile.eecs.missouri.edu/getresolution.php?path="+path_prefix+selected_imageset.path+"tiled/&image="+image_for_pdepth
   $.ajax({
        type: "GET",
        url: serv_url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){

                  mapMinZoom = 0;
                  mapMaxZoom = Number(data);
                  if(data=="" || typeof data == 'undefined')
                  {
                    mapMaxZoom = selected_annotation.maxResolution;
                  }
                  mapMaxZoom = mapMaxZoom - 1;
                  if(prev_zoom_level== -1)
                  {
                    prev_zoom_level = mapMaxZoom - 2;
                  }
                  if(mapMaxZoom > 2)
                  {
                    mapMinZoom = 2;
                  }
                  show_map_page_divs();
                  draw_image_and_annotations();
          },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}

/**
* This function calls the service to fetch the frame number to name mapping for a given annotationID
*/
function getFrameNumberToNameMapping()
{
  
  $.ajax({
        type: "GET",
        url: url.geFrameNamesForAnnotation+"/"+selected_annotation.annotationID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
                   

                  
                    
                    $('#frame_names_select').children().remove();

                    $.each(data, function (index, value) {
                            var lastindex = value.lastIndexOf(".");
                            var str_len = value.length;
                            var extension = value.substr(lastindex, str_len);
                            fr_number_to_name[index] = value.replace(extension, ".tiff");
                            $('<option>').val(index).text(fr_number_to_name[index] +"  (frame#:  "+ index+")").appendTo('#frame_names_select');
                      });
                    
                  var image_for_pdepth = fr_number_to_name[0];
                  fetch_pyramid_depth(image_for_pdepth);
                  //Following 3 functions are called form here because they use the variable
                  set_breadcrumbz();
                  

          },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}

//Service call to get class label for project
function getClassLbelsForProject(projectID)
{
  $.ajax({
        type: "GET",
        url: url.getClassLayers+"/"+projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          
          class_layer_list = data;
          populateClassLabels();
          },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}


/**
Makes a service call to get image set for the given project ID
**/
function getImagesetForProject(projectID)
{
 
  $.ajax({
        type: "GET",
        url: url.getImageset+"/"+projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          console.log(data.length)
          populateImageset(data);// associate click with each tr


           },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });

}

//function that makes the service calls to download annotations
function downloadAnnotations(annotationID)
{
   
  $.ajax({
    type: "GET",
    url: url.downloadAnnotationsForImageSet+"/"+annotationID,
    //contentType: "application/json; charset=utf-8",
    Accept: "application/x-download", 
        //dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
      success: function(response, status, request) {
      console.log(response)
        var disp = request.getResponseHeader('Content-Disposition');
       // if (disp && disp.search('attachment') != -1) {
            var form = $('<form method="GET" id="form_temp" action="' + url.downloadAnnotationsForImageSet +"/"+annotationID+'">');
            $('body').append(form);
            //need to resubmit form because ajax call doesnt prompt the save file dialog
            form.submit();
            $("#form_temp").remove();
       // }
    }
});
}


function getAnnotationsForImageset(path)
{

  var annotation_request = new Object();
  annotation_request.userID = selected_userid;
  annotation_request.imageset = path;
  
  $.ajax({
        type: "POST",
        url: url.geAnnotationsForImageSet,
        data: JSON.stringify(annotation_request),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
          
          populateAnnotations(data);// associate click with each tr


           },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}





//function to sort table
function sortTable($table,order){
    var $rows = $('tbody > tr', $table);
    $rows.sort(function (a, b) {
        var keyA = $('td', a).text();
        var keyB = $('td', b).text();
        if (order=='asc') {
            return (keyA > keyB) ? 1 : 0;
        } else {
            return (keyA > keyB) ? 0 : 1;
        }
    });
    $.each($rows, function (index, row) {
        $table.append(row);
    });
}



//Util functions to hide and show a given element
function hideById(elemID)
{
   var x = '#'+elemID;
  $(x).hide();
}


function showById(elemID)
{
  var x = '#'+elemID;
  $(x).show();
}

/**
* Shows divs have to be shown only when the map div/ dataset is shown
*/
function hide_map_page_divs()
{
   $("div#map").empty();
   hideById('breadcrumbz');
   hideById('draw_mode');
   hideById('map_status');
   hideById('pagination');
}


/**
*Hides divs have to be shown only when the map div/ dataset is shown
*/
function show_map_page_divs()
{
   
   showById('breadcrumbz');
   showById('draw_mode');
   showById('map_status');
   showById('pagination');
}




/**
* Service call to get all labs assigned to the selected userID
*/
function fetchUserLabs()
{

   var user = new Object();
   
   user.userID = selected_userid;
   user.email =  $("#username").val();
   $.ajax({
        type: "POST",
        url: url.getUserLabs,
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
         xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function(data){
        	
        	$( ".login-form" ).hide();
        	$("#workspace-select").show();
        	populateLabs(data);

          },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}