

function create_bar_chart_objects()
{

  var height = 500;
  var width = 300;
  var max_units = 500;
  var interval = 20;
  var one_unit = 1;
  var width_interval = (width/14);

$('#barchart_object').empty();
  console.log("create_bar_chart_objects::::")
  // Create data array of values to visualize
  var dataArray = [count_by_objects.point, count_by_objects.line, count_by_objects.circle, count_by_objects.box, count_by_objects.freeformPoly, count_by_objects.freeform, count_by_objects.polygon,count_by_objects.curve];


// Create variable for the SVG
var svg = d3.select("#barchart_object").append("svg")
          .attr("height","100%")
          .attr("width","100%");

// Select, append to SVG, and add attributes to rectangles for bar chart
svg.selectAll("rect")
    .data(dataArray)
    .enter().append("rect")
          .attr("class", "bar")
          .attr("height", function(d, i) {return (d*one_unit)})
          .attr("width",width_interval)
          .attr("x",function(d, i) {return (i * width/14) + width/14})
          .attr("y",function(d, i) {return height - (d*one_unit)});



svg.selectAll("text")
    .data(dataArray)
    .enter().append("text")
    .text(function(d) {return d})
          .attr("class", "text")
          .attr("x", function(d, i) {return (i * width/14) + width/14})
          .attr("y", function(d, i) {return height - (d*one_unit)});



}



