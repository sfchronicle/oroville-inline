require("./lib/social"); //Do not delete
var d3 = require('d3');

// window.addEventListener("orientationchange", function() {
//   window.location.reload();
// }, false);

// parse date and time
var parseDate = d3.time.format("%m/%d").parse;
var	parseYr = d3.time.format("%Y").parse;
var parseFullDate = d3.time.format("%m/%d/%Y").parse;

// helpful functions:
var formatthousands = d3.format("0,000");

// color function
var cscale = d3.scale.category20b();

// color by year function
function color_by_year(year) {
  if (year == "2017") {
    return "red";
  } else {
    return cscale(year);
  }
}

// fade out colors that aren't 2017
function opacity_by_year(year,flag) {
  if (flag == 0) {
    return 1;
  } else {
    if (year == "2017") {
      return 1;
    } else {
      return 0.8;
    }
  }
}

// convert names to camel case
function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
}

// setting sizes of interactive
var margin = {
  top: 15,
  right: 50,
  bottom: 50,
  left: 70
};
if (screen.width > 768) {
  var width = 900 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  var width = 720 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
} else if (screen.width <= 480 && screen.width > 340) {
  console.log("big phone");
  var margin = {
    top: 20,
    right: 20,
    bottom: 35,
    left: 30
  };
  var width = 340 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
} else if (screen.width <= 340) {
  console.log("mini iphone")
  var margin = {
    top: 20,
    right: 20,
    bottom: 35,
    left: 35
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

draw_intro();

var selectedData = waterData.filter(function(data) { return data.type == "Inflow" });
draw_chart(selectedData,0,"#inflow-chart","Inflow")

var selectedData = waterData.filter(function(data) { return data.type == "Outflow" });
draw_chart(selectedData,0,"#outflow-chart","Outflow")

draw_overlay();

draw_reservoir();

draw_future();

// -----------------------------------------------------------------------------
// DAMAGE animations --------------------------------------------------
// -----------------------------------------------------------------------------

var fadeTime = 1000;
var timeoutTime = 1100;
var damage = $("#damage-graphic");
var iD = -1;

// these are the images
var urls = ["oroville_damagedone_powerplant_GR.jpg?v=2", "oroville_overhead_base_spillandplant.jpg?v=2","oroville_overhead_base_all.jpg?v=2"].map(s => "./assets/graphics/" + s);

// callback version
var swap = function() {
  damage.fadeOut(fadeTime, function() {
    //get the next image
    iD = (iD + 1) % urls.length; // hello modulo, my old friend
    //update the src
    damage.attr("src", urls[iD]);
    //fade in once it's loaded
    damage.one("load", function() {
      //once fade completes, schedule the next swap
      damage.fadeIn(fadeTime, () => setTimeout(swap, timeoutTime));
    });
  })
};

//either way
setTimeout(swap, timeoutTime);

// -----------------------------------------------------------------------------
// EROSION animations --------------------------------------------------
// -----------------------------------------------------------------------------

var erosion = $("#erosion-graphic");
var iE = -1;
//prepend the assets folder to these
var erosion_urls = ["reservoirs_slideshow_erosion_arrow.jpg?v=2","reservoirs_slideshow_erosion_base.jpg?v=2"].map(s => "./assets/graphics/" + s);

//callback version
var swap_erosion = function() {
  erosion.fadeOut(fadeTime, function() {
    //get the next image
    iE = (iE + 1) % erosion_urls.length; // hello modulo, my old friend
    //update the src
    erosion.attr("src", erosion_urls[iE]);
    //fade in once it's loaded
    erosion.one("load", function() {
      //once fade completes, schedule the next swap
      erosion.fadeIn(fadeTime, () => setTimeout(swap_erosion, timeoutTime));
    });
  })
};

//either way
setTimeout(swap_erosion, timeoutTime);

// -----------------------------------------------------------------------------
// FLOW animations --------------------------------------------------
// -----------------------------------------------------------------------------

var flow = $("#flow-graphic");
var iF = -1;
//prepend the assets folder to these
var flow_urls = ["oroville_overhead_inflow.jpg?v=2", "oroville_overhead_outflow.jpg?v=2"].map(s => "./assets/graphics/" + s);

//callback version
var swap_flow = function() {
  flow.fadeOut(fadeTime, function() {
    //get the next image
    iF = (iF + 1) % flow_urls.length; // hello modulo, my old friend
    //update the src
    flow.attr("src", flow_urls[iF]);
    //fade in once it's loaded
    flow.one("load", function() {
      //once fade completes, schedule the next swap
      flow.fadeIn(fadeTime, () => setTimeout(swap_flow, timeoutTime));
    });
  })
};

//either way
setTimeout(swap_flow, timeoutTime);

// -----------------------------------------------------------------------------
// FUNCTIONS to create charts --------------------------------------------------
// -----------------------------------------------------------------------------

function draw_chart(selectedData,flag,divID,flow_type) {

  // organize data by water year
  var FlowNested = d3.nest()
    .key(function(d){ return d.waterYear; })
    .entries(selectedData);

  // create new flat data structure
  var flatDataFlow = []; //var flatDataOutflow = [];
  selectedData.forEach(function(d,idx){
    var datetemp = d.Date.split("/");
    var datetemp2 = datetemp[0]+"/"+datetemp[1];
    if (datetemp[0] >= 10) {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2015";
    } else {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2016";
    }
    var datetemp3 = parseFullDate(datetemp3);
    flatDataFlow.push(
      {key: d.waterYear, Flow: d.Flow, DateString: d.Date, Date: datetemp3}
    );
  });

  // setting sizes of interactive
  var margin = {
    top: 15,
    right: 50,
    bottom: 40,
    left: 70
  };
  if (screen.width > 768) {
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 768 && screen.width > 480) {
    var width = 720 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 480 && screen.width > 340) {
    console.log("big phone");
    var margin = {
      top: 20,
      right: 20,
      bottom: 35,
      left: 30
    };
    var width = 340 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
  } else if (screen.width <= 340) {
    console.log("mini iphone")
    var margin = {
      top: 20,
      right: 20,
      bottom: 35,
      left: 35
    };
    var width = 310 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
  }

  // create SVG container for chart components
  var svgFlow = d3.select(divID).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x-axis scale
  var x = d3.time.scale()
      .range([0,width]);

  // y-axis scale
  var y = d3.scale.linear()
      .range([height, 0]);

  x.domain([parseFullDate('10/01/2015'), parseFullDate('09/31/2016')]);
  y.domain([0,170]);

  var voronoiLines = d3.geom.voronoi()
    .x(function(d) {
      return x(d.Date);
    })
    .y(function(d) {
      return y(d.Flow/1000);
    })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%b")); // tickFormat

  var yAxis = d3.svg.axis().scale(y)
      .orient("left");

  var lineFlow = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        // return x(parseFullDate(d.Date));
        var datetemp = d.Date.split("/");
        if (datetemp[0] >= 10) {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2015";
        } else {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2016";
        }
        return x(parseFullDate(datetemp2));
      })
      .y(function(d) {
        return y(d.Flow/1000);
      });

  if (flow_type == "Outflow") {
    var areaOK = d3.svg.area()
        // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
        .x(function(d) {
          return x(parseFullDate(d.Date));
        })
        .y0(height)
        .y1(function(d) {
          return y(d.Flow/1000);
        });

    var areaDanger = d3.svg.area()
        // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
        .x(function(d) {
          return x(parseFullDate(d.Date));
        })
        .y0(0)
        .y1(function(d) {
          return y(d.Flow/1000);
        });

    var dangerData = [
      {Date: '10/01/2015', Flow: 150000},
      {Date: '09/31/2016', Flow: 150000}
    ];

    // Add the filled area
    svgFlow.append("path")
        .datum(dangerData)
        .attr("class", "area")
        .style("opacity",0.5)
        .style("fill","DE8383")
        .attr("d", areaDanger);

    // Add the filled area
    svgFlow.append("path")
        .datum(dangerData)
        .attr("class", "area")
        .style("opacity",0.5)
        .style("fill","#E5E5E5")
        .attr("d", areaOK);

    if (screen.width <= 480) {
      svgFlow.append("text")
          .attr("x", function(d) {
            return x(parseFullDate("06/05/2016"));
          })
          .attr("y", function(d) {
            return y(153);
          })
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .text("Danger zone");

    } else {
      svgFlow.append("text")
          .attr("x", function(d) {
            return x(parseFullDate("08/20/2016"));
          })
          .attr("y", function(d) {
            return y(153);
          })
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .text("Danger zone");
    }

  }

  FlowNested.forEach(function(d,ddx) {
    d.values.splice(0,1);
    var class_list = "line voronoipath id"+d.key;
    svgFlow.append("path")
      .attr("class", class_list)
      .style("opacity",opacity_by_year(d.key,flag))
      // .style("stroke-dasharray", stroke_by_dataset(d.values[0].type))
      .style("stroke", color_by_year(d.key))//cscale(d.key))//
      .attr("d", lineFlow(d.values));
  });

  var nodesFlow = svgFlow.selectAll(".voronoipath")
      .data(flatDataFlow)
      .enter().append("g")
      .attr("class","node");

  if (screen.width <= 480) {
    nodesFlow.append("text")
        .attr("x", function(d) {
          if(flow_type == "Inflow") {
            if (screen.width <= 480) {
              return (x(d.Date)-50);;
            } else {
              rreturn (x(d.Date)+20);
            }
          } else {
            if ((screen.width <= 480) && (d.DateString == "3/20/11") && (flow_type == "Outflow")) {
              return (x(d.Date)-70)
            } else {
              return (x(d.Date)-50);
            }
          }
        })
        .attr("y", function(d) {
          if (flow_type == "Inflow") {
            if (screen.width <= 480) {
              return y(d.Flow/1000)-10;
            } else {
              return y(d.Flow/1000)+10;
            }
          } else {
            if (screen.width <= 480) {
              return y(d.Flow/1000)-10;
            } else {
              return y(d.Flow/1000)-30;
            }

          }
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","12px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if ((d.DateString == "3/20/11") && (flow_type == "Outflow")){
                return "2011 snowmelt also required outflow";
            } else if ((d.DateString == "2/13/17") && (flow_type == "Outflow")){
                return "Storms prompt outflow this February";
            } else if ((d.DateString == "2/9/17") && (flow_type == "Inflow")){
                return "Big storms bring lots of water this year";
            } else {
                return "";
            }
        });
  } else {
    nodesFlow.append("text")
        .attr("x", function(d) {
          if(flow_type == "Inflow") {
            return (x(d.Date)+20);
          } else {
            return (x(d.Date)-10);
          }
        })
        .attr("y", function(d) {
          if (flow_type == "Inflow") {
            return y(d.Flow/1000)+10;
          } else {
            return y(d.Flow/1000)-30;
          }
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","14px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if ((d.DateString == "3/20/11") && (flow_type == "Outflow")){
                return "Snowmelt in 2011 also required big outflows";
            } else if ((d.DateString == "2/13/17") && (flow_type == "Outflow")){
                return "Storms prompt increased outflow this February";
            } else if ((d.DateString == "2/9/17") && (flow_type == "Inflow")){
                return "Big storms bring lots of water to the reservoir this year";
            } else {
                return "";
            }
        });
  }

  var focusFlow = svgFlow.append("g")
    .attr("transform", "translate(-100,-100)")
    .attr("class", "focus");

  focusFlow.append("circle")
    .attr("r", 3.5);

  focusFlow.append("rect")
    .attr("x",-110)
    .attr("y",-25)
    .attr("width","140px")
    .attr("height","20px")
    .attr("opacity","0.8")
    .attr("fill","white");

  focusFlow.append("text")
    .attr("x", -100)
    .attr("y", -10);

  var voronoiFlow = svgFlow.append("g")
    .attr("class", "voronoipath");

  voronoiFlow.selectAll(".voronoipath")
    .data(voronoiLines(flatDataFlow))
    .enter().append("path")
    .attr("d", function(d) {
      if (d) {
        return "M" + d.join("L") + "Z";
      }
    })
    .datum(function(d) {
      if (d) {
        return d.point;
      }
    })
    .on("mouseover", mouseoverlines)
    .on("mouseout", mouseoutlines);

  function mouseoverlines(d) {
    d3.select(".id"+d.key).classed("line-hover", true);
    focusFlow.attr("transform", "translate(" + x(d.Date) + "," + y(d.Flow/1000) + ")");
    focusFlow.select("text").text(d.DateString+": "+formatthousands(Math.round(d.Flow))+" cfs");
    if (d.DateString.split("/")[0] < 10) {
      if (screen.width <= 480) {
        focusFlow.select("text").attr("x","-90px");
        focusFlow.select("rect").attr("x","-100px");
      } else {
        focusFlow.select("text").attr("x","-120px");
        focusFlow.select("rect").attr("x","-130px");
      }
      // focusOverlay.select("rect").attr("width","80px");
    } else {
      focusFlow.select("text").attr("x","10px");
      focusFlow.select("rect").attr("x","0px");
      // focusOverlay.select("rect").attr("width","80px");
    }
  }

  function mouseoutlines(d) {
    d3.select(".id"+d.key).classed("line-hover", false);
    focusFlow.attr("transform", "translate(-100,-100)");
  }

  if (screen.width <= 480) {
    svgFlow.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)" )
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 35)
        .style("text-anchor", "end")
        .text("Month")
  } else {
    svgFlow.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("Month");
  }

  if (screen.width <= 480) {
    svgFlow.append("g")
        .data(flatDataFlow)
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        // .style("fill","white")
        .text(flow_type+"(thousands of cfs)")
  } else {
    svgFlow.append("g")
        .data(flatDataFlow)
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        // .style("fill","white")
        .text(flow_type+" (thousands of cfs)")
  }

}

function draw_overlay() {

  var selectedData_filter1 = waterData.filter(function(data) { return data.waterYear == "2017" });
  var selectedData = selectedData_filter1.filter(function(data) { return data.type == "Outflow" });

  // create new flat data structure
  var flatDataO = []; //var flatDataOutflow = [];
  selectedData.forEach(function(d,idx){
    var datetemp = d.Date.split("/");
    var datetemp2 = datetemp[0]+"/"+datetemp[1];
    if (datetemp[0] >= 10) {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2016";
    } else {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2017";
    }
    var datetemp3 = parseFullDate(datetemp3);
    flatDataO.push(
      {key: d.waterYear, Flow: d.Flow, DateString: d.Date, Date: datetemp3}
    );
  });

  // show tooltip
  var tooltip = d3.select("body")
      .append("div")
      .attr("class","tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

  // create SVG container for chart components
  var margin = {
    top: 15,
    right: 80,
    bottom: 60,
    left: 100
  };
  if (screen.width > 768) {
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 768 && screen.width > 480) {
    var width = 720 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 480 && screen.width > 340) {
    console.log("big phone");
    var margin = {
      top: 20,
      right: 60,
      bottom: 50,
      left: 30
    };
    var width = 340 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
  } else if (screen.width <= 340) {
    console.log("mini iphone")
    var margin = {
      top: 20,
      right: 55,
      bottom: 50,
      left: 32
    };
    var width = 310 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;
  }
  console.log(margin);
  var svgOverlay = d3.select("#overlay-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x-axis scale
  var xMonth = d3.time.scale()
      .range([0,width]);

  // y-axis scale
  var yInflow = d3.scale.linear()
      .range([height, 0]);

  var yRightHeight = d3.scale.linear()
      .range([height, 0]);

  var voronoiLine = d3.geom.voronoi()
    .x(function(d) {
      return xMonth(d.Date);
    })
    .y(function(d) {
      return yInflow(d.Flow/1000);
    })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  // Define the axes
  if (screen.width <= 480) {
    var xAxisMonth = d3.svg.axis().scale(xMonth)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d"))
        .ticks(6); // tickFormat
  } else {
    var xAxisMonth = d3.svg.axis().scale(xMonth)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d"))
        .ticks(8); // tickFormat
  }


  var yAxisInflow = d3.svg.axis().scale(yInflow)
      .orient("left");

  var yAxisRightHeight = d3.svg.axis().scale(yRightHeight)
      .orient("right")
      .ticks(5);

  xMonth.domain([parseFullDate('10/01/2016'), parseFullDate('03/01/2017')]);
  yInflow.domain([0,140]);
  yRightHeight.domain([50,110]);

  var areaReservoirs = d3.svg.area()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xMonth(parseFullDate(d.Date));
      })
      .y0(height)
      .y1(function(d) {
        return yRightHeight(d.Height/901*100);
      });

  var line100 = [
    {Date: '10/01/2016', Height: 901},
    {Date: '03/01/2017', Height: 901}
  ];

  var lineReservoirs = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xMonth(parseFullDate(d.Date));
      })
      .y(function(d) {
        return yRightHeight(d.Height/901*100);
      });

  if (screen.width <= 480) {
    svgOverlay.append("text")
        .attr("x", function(d) {
          return xMonth(parseFullDate("12/20/2016"));
        })
        .attr("y", function(d) {
          return yRightHeight(102);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Oroville reservoir capacity");
  } else {
    svgOverlay.append("text")
        .attr("x", function(d) {
          return xMonth(parseFullDate("02/01/2017"));
        })
        .attr("y", function(d) {
          return yRightHeight(102);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Oroville reservoir capacity");
  }

  var path100 = svgOverlay.append("path")
    .attr("d", lineReservoirs(line100))
    .attr("class","annotation")
    .attr("stroke", "#696969")
    .attr("fill", "none")
    .style("shape-rendering","crispEdges")

  // Add the filled area
  svgOverlay.append("path")
      .datum(reservoirData)
      .attr("class", "area")
      .style("fill","#6790B7")
      .attr("d", areaReservoirs);

  var lineFlow = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        // return x(parseFullDate(d.Date));
        var datetemp = d.Date.split("/");
        if (datetemp[0] >= 10) {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2016";
        } else {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2017";
        }
        // var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/"+d.Year;
        return xMonth(parseFullDate(datetemp2));
      })
      .y(function(d) {
        return yInflow(d.Flow/1000);
      });

  svgOverlay.append("path")
    .data(selectedData)
    .attr("class", "path voronoi")
    .style("stroke", "red")//cscale(d.key))//
    .attr("d", lineFlow(selectedData));

  var nodesOverlay = svgOverlay.selectAll(".voronoi")
      .data(flatDataO)
      .enter().append("g")
      .attr("class","node");

  if (screen.width <= 480) {
    nodesOverlay.append("text")
        .attr("x", function(d) {
          if (d.DateString == "2/10/17") {
            return (xMonth(d.Date)-175);
          } else {
            return (xMonth(d.Date)-135);
          }
        })
        .attr("y", function(d) {
          return yInflow(d.Flow/1000);
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","12px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if (d.DateString == "2/6/17"){
                return "Main spillway damaged";
            } else if (d.DateString == "2/10/17"){
                return "Emergency spillway put to use";
            } else {
                return "";
            }
        });
  } else {
    nodesOverlay.append("text")
        .attr("x", function(d) {
          if (d.DateString == "2/10/17") {
            return (xMonth(d.Date)-200);
          } else {
            return (xMonth(d.Date)-150);
          }
        })
        .attr("y", function(d) {
          return yInflow(d.Flow/1000)-30;
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","14px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if (d.DateString == "2/6/17"){
                return "Main spillway damaged";
            } else if (d.DateString == "2/10/17"){
                return "Emergency spillway put in use";
            } else {
                return "";
            }
        });
    }

  var focusOverlay = svgOverlay.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

  focusOverlay.append("circle")
      .attr("r", 3.5);
  focusOverlay.append("rect")
      .attr("x",-40)
      .attr("y",-25)
      .attr("width","140px")
      .attr("height","20px")
      .attr("opacity","0.5")
      .attr("fill","white")
      .attr("pointer-events", "none");
  focusOverlay.append("text")
      .attr("x", -30)
      .attr("y", -10)
      .attr("class","hover-text")
      .attr("pointer-events", "none");

  var voronoiLayer = svgOverlay.append("g")
    .attr("class", "voronoi");

  // if (screen.width >= 480){
  voronoiLayer.selectAll(".voronoi")
    .data(voronoiLine(flatDataO))
    .enter().append("path")
    .attr("d", function(d) {
      if (d) {
        return "M" + d.join("L") + "Z";
      }
    })
    .datum(function(d) {
      if (d) {
        return d.point;
      }
    })
    .on("mouseover", mouseover)
    .on("click", mouseover)
    .on("mouseout", mouseout);
  // }

  function mouseover(d) {
    d3.select(".id"+d.key).classed("line-hover", true);
    focusOverlay.attr("transform", "translate(" + xMonth(d.Date) + "," + yInflow(d.Flow/1000) + ")");
    focusOverlay.select("text").text(d.DateString+": "+formatthousands(Math.round(d.Flow))+ " cfs");
    // if (screen.width <= 480) {
    if (d.DateString.split("/")[0] < 10) {
      focusOverlay.select("text").attr("x","-130px");
      focusOverlay.select("rect").attr("x","-140px");
      // focusOverlay.select("rect").attr("width","80px");
    } else {
      focusOverlay.select("text").attr("x","10px");
      focusOverlay.select("rect").attr("x","0px");
      // focusOverlay.select("rect").attr("width","80px");
    }
  }

  function mouseout(d) {
    d3.select(".id"+d.key).classed("line-hover", false);
    focusOverlay.attr("transform", "translate(-100,-100)");
  }

  // if (screen.width <= 480) {
    svgOverlay.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisMonth)
      // .selectAll("text")
      //     .style("text-anchor", "end")
      //     .attr("dx", "-.8em")
      //     .attr("dy", ".15em")
      //     .attr("transform", "rotate(-65)" )
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("2017 rain year (Oct. 1 to present)")

    if (screen.width <= 480) {
      svgOverlay.append("g")
          .attr("class", "y axis")
          .call(yAxisInflow)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 10)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Outflow (thousands of cfs)")

      svgOverlay.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + " ,0)")
          .call(yAxisRightHeight)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 40)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Reservoir level (% full)")
    } else {
      svgOverlay.append("g")
          .attr("class", "y axis")
          .call(yAxisInflow)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", -55)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Outflow (thousands of cfs)")

      svgOverlay.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + " ,0)")
          .call(yAxisRightHeight)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 45)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Reservoir level (% full)")
    }
}

function draw_future() {

  // show tooltip
  var future_tooltip = d3.select("body")
      .append("div")
      .attr("class","future_tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

  d3.json("http://extras.sfgate.com/editorial/droughtwatch/reservoirs.json", function(barData){

    barData.data.forEach(function(d){
      d.name = titleCase(d.name).split('(')[0];
    });

    // x-axis scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.2);

    // y-axis scale
    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    x.domain(barData.data.map(function(d) { return d.name; }));
    y.domain([0, 5000]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // use y-axis scale to set y-axis
  	var yAxis = d3.svg.axis()
  			.scale(y)
  			.orient("left")
  			.tickFormat(d3.format(".2s"));

    // create SVG container for chart components
    margin.bottom = 100;
    if (screen.width <= 480) {
      margin.bottom = 80;
    }
    margin.left = 40;
  	var svgBars = d3.select("#future-chart").append("svg")
  			.attr("width", width + margin.left + margin.right)
  			.attr("height", height + margin.top + margin.bottom)
  			.append("g")
  			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svgBars.selectAll("bar")
        .data(barData.data)
      .enter().append("rect")
        .style("fill", "#696969")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(+d.capacity/1000); })
        .attr("height", function(d) {
          return height - y(+d.capacity/1000);
        })
        .on("mouseover", function(d) {
          future_tooltip.html(`
              <div>Reservoir: <b>${d.name}</b></div>
              <div>Storage: <b>${formatthousands(Math.round(d.storage/1000))} TAF</b></div>
              <div>Capacity: <b>${formatthousands(Math.round(d.capacity/1000))} TAF</b></div>
          `);
          future_tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(d) {
          if (screen.width <= 480) {
            return future_tooltip
              .style("top", (d3.event.pageY+20)+"px")
              .style("left",d3.event.pageX/2+20+"px");
          } else {
            return future_tooltip
              .style("top", (d3.event.pageY+20)+"px")
              .style("left",(d3.event.pageX-80)+"px");
          }
        })
        .on("mouseout", function(){return future_tooltip.style("visibility", "hidden");});

    svgBars.selectAll("bar")
        .data(barData.data)
      .enter().append("rect")
        .style("fill", "#6790B7")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(+d.storage/1000); })
        .attr("height", function(d) {
          return height - y(+d.storage/1000);
        })
        .on("mouseover", function(d) {
          future_tooltip.html(`
      				<div>Reservoir: <b>${d.name}</b></div>
              <div>Storage: <b>${formatthousands(Math.round(d.storage/1000))} TAF</b></div>
              <div>Capacity: <b>${formatthousands(Math.round(d.capacity/1000))} TAF</b></div>
      		`);
        	future_tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(d) {
        	if (screen.width <= 480) {
        		return future_tooltip
        			.style("top", (d3.event.pageY+20)+"px")
        			.style("left",d3.event.pageX/2+20+"px");
        	} else {
        		return future_tooltip
        			.style("top", (d3.event.pageY+20)+"px")
        			.style("left",(d3.event.pageX-80)+"px");
        	}
        })
        .on("mouseout", function(){return future_tooltip.style("visibility", "hidden");});

    svgBars.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-65)" );

    svgBars.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Reservoir levels (TAF)");

  });

  d3.json("http://extras.sfgate.com/editorial/droughtwatch/snowwatercontent.json", function(snowData){
    document.querySelector("#snowpack-num").innerHTML = "<span class='bold'>"+snowData.data[0]["pctofnormal"]+"</span><span class='unbold'> percent of normal</span>";
  });

}

function draw_intro() {

  // show tooltip
  var bar_tooltip = d3.select("body")
      .append("div")
      .attr("class","bar_tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

  // setting sizes of interactive
  var margin = {
    top: 15,
    right: 50,
    bottom: 50,
    left: 70
  };
  if (screen.width > 768) {
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 768 && screen.width > 480) {
    var width = 720 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
  } else if (screen.width <= 480 && screen.width > 340) {
    console.log("big phone");
    var margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 30
    };
    var width = 340 - margin.left - margin.right;
    var height = 360 - margin.top - margin.bottom;
  } else if (screen.width <= 340) {
    console.log("mini iphone")
    var margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 43
    };
    var width = 310 - margin.left - margin.right;
    var height = 360 - margin.top - margin.bottom;
  }

  // x-axis scale
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.2);

  // y-axis scale
  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  x.domain(rainData.map(function(d) {
    return parseYr(String(d.year));
  }));
  y.domain([0, 50]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y"));

  // use y-axis scale to set y-axis
	var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));

  // create SVG container for chart components
	var svgRain = d3.select("#setup-chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgRain.selectAll("bar")
      .data(rainData)
    .enter().append("rect")
      .style("fill", "#6790B7")
      .attr("x", function(d) { return x(parseYr(String(d.year))); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(+d.rainfall); })
      .attr("height", function(d) {
        return height - y(+d.rainfall);
      })
      .on("mouseover", function(d) {
        bar_tooltip.html(`
    				<div>Year: <b>${d.year}</b></div>
            <div>Rainfall: <b>${(d.rainfall)} inches</b></div>
    		`);
      	bar_tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d) {
      	if (screen.width <= 480) {
      		return bar_tooltip
      			.style("top", (d3.event.pageY+20)+"px")
      			.style("left",d3.event.pageX/2+20+"px");
      	} else {
      		return bar_tooltip
      			.style("top", (d3.event.pageY+20)+"px")
      			.style("left",(d3.event.pageX-80)+"px");
      	}
      })
      .on("mouseout", function(){return bar_tooltip.style("visibility", "hidden");});

  if (screen.width <= 480) {
    svgRain.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)" );
      svgRain.append("g")
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 60)
        .style("text-anchor", "end")
        .text("Rain year through February (Oct. 1 - Feb. 28)")
  } else {
    svgRain.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        // .selectAll("text")
        //     .style("text-anchor", "end")
        //     .attr("dx", "1em")
        //     .attr("dy", "1em")
          // .attr("transform", "rotate(-65)" )
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", 40)
          .style("text-anchor", "end")
          .text("Rain year through February (Oct. 1 - Feb. 28)")
  }

  if (screen.width <= 480){
    svgRain.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "20px")
        .style("text-anchor", "end")
        .text("Cumulative rain (in)");
  } else {
    svgRain.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", "-45px")
        .style("text-anchor", "end")
        .text("Cumulative rainfall (inches)");
  };
}

function draw_reservoir_old() {
  margin.left = 60;
  margin.bottom = 50;
  // create SVG container for chart components
  var svgReservoir = d3.select("#reservoir-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  reservoirData.forEach(function(d) {
      d.Storage = +d.Storage;
  });

  // x-axis scale
  var xR = d3.time.scale()
      .range([0,width]);

  // y-axis scale
  var yR = d3.scale.linear()
      .range([height, 0]);

  xR.domain([parseFullDate('10/01/2016'), parseFullDate('03/01/2017')]);
  yR.domain([0,1000]);

  // Define the axes
  var xAxisR = d3.svg.axis().scale(xR)
      .orient("bottom")
      .tickFormat(d3.time.format("%m/%d")); // tickFormat

  var yAxisR = d3.svg.axis().scale(yR)
      .orient("left");

  var line901 = [
    {Date: '10/01/2016', Height: 901},
    {Date: '03/01/2017', Height: 901}
  ];
  //
  var lineReservoirs = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xR(parseFullDate(d.Date));
      })
      .y(function(d) {
        return yR(d.Height);
      });

  var areaReservoirs = d3.svg.area()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xR(parseFullDate(d.Date));
      })
      .y0(height)
      .y1(function(d) {
        return yR(d.Height);
      });

  // Add the filled area
  svgReservoir.append("path")
      .datum(reservoirData)
      .attr("class", "area")
      .style("fill","#6790B7")
      .attr("d", areaReservoirs);

  // svgReservoir.append("path")
  //   .attr("class", "line")
  //   .style("stroke","green")
  //   .attr("d", lineReservoirs(reservoirData));

  var path901 = svgReservoir.append("path")
    .attr("d", lineReservoirs(line901))
    .attr("class","annotation")
    .attr("stroke", "#696969")
    .attr("fill", "none")
    .style("shape-rendering","crispEdges")

  if (screen.width <= 480) {
    svgReservoir.append("text")
        .attr("x", function(d) {
          return xR(parseFullDate("01/10/2017"));
        })
        .attr("y", function(d) {
          return yR(915);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Oroville reservoir capacity");
  } else {
    svgReservoir.append("text")
        .attr("x", function(d) {
          return xR(parseFullDate("02/01/2017"));
        })
        .attr("y", function(d) {
          return yR(915);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Oroville reservoir capacity");
  }

  // if (screen.width <= 480) {
    svgReservoir.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisR)
      // .selectAll("text")
      //     .style("text-anchor", "end")
      //     .attr("dx", "-.8em")
      //     .attr("dy", ".15em")
      //     .attr("transform", "rotate(-65)" )
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 35)
        .style("text-anchor", "end")
        .text("2017 rain year (10/01 to present)")
  // } else {
  //   svgReservoir.append("g")
  //       .attr("class", "x axis")
  //       .attr("transform", "translate(0," + height + ")")
  //       .call(xAxisR)
  //       .append("text")
  //       .attr("class", "label")
  //       .attr("x", width)
  //       .attr("y", 40)
  //       .style("text-anchor", "end")
  //       .text("Month");
  // }

  if (screen.width <= 480) {
    svgReservoir.append("g")
        .data(reservoirData)
        .attr("class", "y axis")
        .call(yAxisR)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        // .style("fill","white")
        .text("Elevation (Feet)")
  } else {
    svgReservoir.append("g")
        .data(reservoirData)
        .attr("class", "y axis")
        .call(yAxisR)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -70)
        .attr("x", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        // .style("fill","white")
        .text("Elevation (Feet)")
  }
}

function draw_reservoir() {

  var selectedData_filter1 = waterData.filter(function(data) { return data.Year == "2017" });
  var selectedData = selectedData_filter1.filter(function(data) { return data.type == "Outflow" });
  var selectedReservoir = reservoirData.filter(function(data) {
    return +data.Date.split("/")[2] == "2017"
  });

  // create new flat data structure
  var flatDataO = []; //var flatDataOutflow = [];
  selectedData.forEach(function(d,idx){
    var datetemp = d.Date.split("/");
    var datetemp2 = datetemp[0]+"/"+datetemp[1];
    if (datetemp[0] >= 10) {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2016";
    } else {
      var datetemp3 = datetemp[0]+"/"+datetemp[1]+"/2017";
    }
    var datetemp3 = parseFullDate(datetemp3);
    flatDataO.push(
      {key: d.waterYear, Flow: d.Flow, DateString: d.Date, Date: datetemp3}
    );
  });

  // show tooltip
  var tooltip = d3.select("body")
      .append("div")
      .attr("class","tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

  // create SVG container for chart components
  var margin = {
    top: 15,
    right: 80,
    bottom: 60,
    left: 100
  };
  if (screen.width > 768) {
    var width = 900 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 768 && screen.width > 480) {
    var width = 720 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;
  } else if (screen.width <= 480 && screen.width > 340) {
    console.log("big phone");
    var margin = {
      top: 20,
      right: 60,
      bottom: 50,
      left: 30
    };
    var width = 340 - margin.left - margin.right;
    var height = 365 - margin.top - margin.bottom;
  } else if (screen.width <= 340) {
    console.log("mini iphone")
    var margin = {
      top: 20,
      right: 60,
      bottom: 50,
      left: 30
    };
    var width = 310 - margin.left - margin.right;
    var height = 365 - margin.top - margin.bottom;
  }
  console.log(margin);
  var svgOverlay = d3.select("#outflow2-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x-axis scale
  var xMonth = d3.time.scale()
      .range([0,width]);

  // y-axis scale
  var yInflow = d3.scale.linear()
      .range([height, 0]);

  var yRightHeight = d3.scale.linear()
      .range([height, 0]);

  var voronoiLine = d3.geom.voronoi()
    .x(function(d) {
      return xMonth(d.Date);
    })
    .y(function(d) {
      return yInflow(d.Flow/1000);
    })
    .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

  // Define the axes
  if (screen.width <= 480) {
    var xAxisMonth = d3.svg.axis().scale(xMonth)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d"))
        .ticks(4); // tickFormat
  } else {
    var xAxisMonth = d3.svg.axis().scale(xMonth)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d"))
        .ticks(8); // tickFormat
  }


  var yAxisInflow = d3.svg.axis().scale(yInflow)
      .orient("left");

  var yAxisRightHeight = d3.svg.axis().scale(yRightHeight)
      .orient("right")
      .ticks(5);

  xMonth.domain([parseFullDate('01/01/2017'), parseFullDate('03/01/2017')]);
  yInflow.domain([0,140]);
  yRightHeight.domain([50,110]);

  var areaReservoirs = d3.svg.area()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xMonth(parseFullDate(d.Date));
      })
      .y0(height)
      .y1(function(d) {
        return yRightHeight(d.Height/901*100);
      });

  var line100 = [
    {Date: '01/01/2017', Height: 901},
    {Date: '03/01/2017', Height: 901}
  ];

  var lineReservoirs = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        return xMonth(parseFullDate(d.Date));
      })
      .y(function(d) {
        return yRightHeight(d.Height/901*100);
      });

  if (screen.width <= 480) {
    svgOverlay.append("text")
        .attr("x", function(d) {
          return xMonth(parseFullDate("02/01/2017"));
        })
        .attr("y", function(d) {
          return yRightHeight(102);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Oroville reservoir capacity");
  } else {
    svgOverlay.append("text")
        .attr("x", function(d) {
          return xMonth(parseFullDate("02/01/2017"));
        })
        .attr("y", function(d) {
          return yRightHeight(102);
        })
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Oroville reservoir capacity");
  }

  var path100 = svgOverlay.append("path")
    .attr("d", lineReservoirs(line100))
    .attr("class","annotation")
    .attr("stroke", "#696969")
    .attr("fill", "none")
    .style("shape-rendering","crispEdges")

  // Add the filled area
  svgOverlay.append("path")
      .datum(selectedReservoir)
      .attr("class", "area")
      .style("fill","#6790B7")
      .attr("d", areaReservoirs);

  var lineFlow = d3.svg.line()
      // .interpolate("monotone")//linear, linear-closed,step-before, step-after, basis, basis-open,basis-closed,monotone
      .x(function(d) {
        // return x(parseFullDate(d.Date));
        var datetemp = d.Date.split("/");
        if (datetemp[0] >= 10) {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2016";
        } else {
          var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/2017";
        }
        // var datetemp2 = datetemp[0]+"/"+datetemp[1]+"/"+d.Year;
        return xMonth(parseFullDate(datetemp2));
      })
      .y(function(d) {
        return yInflow(d.Flow/1000);
      });

  svgOverlay.append("path")
    .data(selectedData)
    .attr("class", "path voronoi")
    .style("stroke", "red")//cscale(d.key))//
    .attr("d", lineFlow(selectedData));

  var nodesOverlay = svgOverlay.selectAll(".voronoi")
      .data(flatDataO)
      .enter().append("g")
      .attr("class","node");

  if (screen.width <= 480) {
    nodesOverlay.append("text")
        .attr("x", function(d) {
          if (d.DateString == "2/10/17") {
            return (xMonth(d.Date)-175);
          } else {
            return (xMonth(d.Date)-130);
          }
        })
        .attr("y", function(d) {
          return yInflow(d.Flow/1000);
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","12px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if (d.DateString == "2/6/17"){
                return "Main spillway damaged";
            } else if (d.DateString == "2/11/17"){
                return "Emergency spillway put to use";
            } else {
                return "";
            }
        });
  } else {
    nodesOverlay.append("text")
        .attr("x", function(d) {
          if (d.DateString == "2/10/17") {
            return (xMonth(d.Date)-200);
          } else {
            return (xMonth(d.Date)-150);
          }
        })
        .attr("y", function(d) {
          return yInflow(d.Flow/1000)-30;
        })
        .attr("class","dottextslope")
        .style("fill","black")//"#3F3F3F")
        .style("font-size","14px")
        .style("font-family","AntennaExtraLight")
        // .style("font-style","italic")
        .text(function(d) {
            if (d.DateString == "2/6/17"){
                return "Main spillway damaged";
            } else if (d.DateString == "2/10/17"){
                return "Emergency spillway put in use";
            } else {
                return "";
            }
        });
    }

  var focusOverlay = svgOverlay.append("g")
      .attr("transform", "translate(-100,-100)")
      .attr("class", "focus");

  focusOverlay.append("circle")
      .attr("r", 3.5);
  focusOverlay.append("rect")
      .attr("x",-40)
      .attr("y",-25)
      .attr("width","140px")
      .attr("height","20px")
      .attr("opacity","0.5")
      .attr("fill","white")
      .attr("pointer-events", "none");
  focusOverlay.append("text")
      .attr("x", -30)
      .attr("y", -10)
      .attr("class","hover-text")
      .attr("pointer-events", "none");

  var voronoiLayer = svgOverlay.append("g")
    .attr("class", "voronoi");

  // if (screen.width >= 480){
  voronoiLayer.selectAll(".voronoi")
    .data(voronoiLine(flatDataO))
    .enter().append("path")
    .attr("d", function(d) {
      if (d) {
        return "M" + d.join("L") + "Z";
      }
    })
    .datum(function(d) {
      if (d) {
        return d.point;
      }
    })
    .on("mouseover", mouseover)
    .on("click", mouseover)
    .on("mouseout", mouseout);
  // }

  function mouseover(d) {
    d3.select(".id"+d.key).classed("line-hover", true);
    focusOverlay.attr("transform", "translate(" + xMonth(d.Date) + "," + yInflow(d.Flow/1000) + ")");
    focusOverlay.select("text").text(d.DateString+": "+formatthousands(Math.round(d.Flow))+ " cfs");
    // if (screen.width <= 480) {
    if (d.DateString.split("/")[0] > 1) {
      focusOverlay.select("text").attr("x","-130px");
      focusOverlay.select("rect").attr("x","-140px");
      // focusOverlay.select("rect").attr("width","80px");
    } else {
      focusOverlay.select("text").attr("x","10px");
      focusOverlay.select("rect").attr("x","0px");
      // focusOverlay.select("rect").attr("width","80px");
    }
  }

  function mouseout(d) {
    d3.select(".id"+d.key).classed("line-hover", false);
    focusOverlay.attr("transform", "translate(-100,-100)");
  }

  // if (screen.width <= 480) {
    svgOverlay.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisMonth)
      // .selectAll("text")
      //     .style("text-anchor", "end")
      //     .attr("dx", "-.8em")
      //     .attr("dy", ".15em")
      //     .attr("transform", "rotate(-65)" )
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 40)
        .style("text-anchor", "end")
        .text("2017 rain year (Oct. 1 to present)")

    if (screen.width <= 480) {
      svgOverlay.append("g")
          .attr("class", "y axis")
          .call(yAxisInflow)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 10)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Outflow (thousands of cfs)")

      svgOverlay.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + " ,0)")
          .call(yAxisRightHeight)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 40)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Reservoir level (% full)")
    } else {
      svgOverlay.append("g")
          .attr("class", "y axis")
          .call(yAxisInflow)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", -55)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Outflow (thousands of cfs)")

      svgOverlay.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + " ,0)")
          .call(yAxisRightHeight)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 45)
          .attr("x", 0)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .style("fill","white")
          .text("Reservoir level (% full)")
    }
}
