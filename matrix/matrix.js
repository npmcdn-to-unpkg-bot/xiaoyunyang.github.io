var margin = { top: 80, right: 0, bottom: 100, left: 100 },
    padding = 2;
    width = 700 - margin.left - margin.right,
    height = 2500 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 15),
    legendElementWidth = gridSize*2,
    tooltipHeight = 20,
    buckets = 9,
    mediaIcons = {Image: '\ue3f4', Video: '\ue04a', Discussion: '\ue8af', Article: '\ue02f', Code: '\ue86f', Tutorial: '\ue8fd', Interactive: '\ue913', Website: '\ue894'  } //Materials
    //mediaIcons = {Image: '\uf03e', Video: '\uf16a', Answer: '\uf059', Article: '\ue02f', Code: '\uf121', Tutorial: '\ue8fd'  } //FontAwesome
    //mediaImages = {Image: 'oatmeal/0.png', Video: 'oatmeal/1.png', Answer: 'oatmeal/2.png', Article: 'oatmeal/3.png', Code: 'oatmeal/4.png', Tutorial: 'oatmeal/5.png'  }
    mediaImages = {Jake: 'uifaces/0.jpg', Adam: 'uifaces/1.jpg', Rob: 'uifaces/2.jpg', Tom: 'uifaces/3.jpg', Valerie: 'uifaces/4.jpg', Tutorial: 'uifaces/5.jpg'  }
    //colors = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"], // alternatively colorbrewer.YlGnBu[9]
    colors = {green: colorbrewer.Greens[4], red: colorbrewer.Reds[4], blue: colorbrewer.Blues[4], purple: colorbrewer.Purples[4]}
    datasets = ["data.csv", "data2.csv", "collection.csv"]
    mediaTypes = ["icon", "image"]
    colorThemes = ["green", "red", "blue", "purple"];
var state = {};
state.svg = null;
state.boxClicked = false;
state.clickedBox = null;
state.clickedMediaLabel = null;
state.clickedTagLabel = null;
state.heatmapChart = null;

//anonymous function
var objKey = function(d, i) {return Object.keys(d)[i]};
var objVal = function(d, i) {return d[objKey(d,i)];}

var tags = function(data) {return _.unique(data.map(function(d){return objVal(d,0)}));};
var media = function(data) {return _.unique(data.map(function(d){return objVal(d,1)}));};
var values = function(data) {return data.map(function(d){return objVal(d,2)});};

var heatmapChart = function(divId, data, mediaType, colorTheme) {
    //private state variables
    var chart = {};
    chart.tags = tags(data);
    chart.media = media(data);
    chart.svg = createNew(divId);

    function createNew(divId) {
      return d3.select(divId).append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    chart.svg.selectAll(".tag-label").remove();
    chart.svg.selectAll(".media-label").remove();

    resetGrid();

    var tagLabels = chart.svg.selectAll(".tag-label")
        .data(chart.tags)
        .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", "tag-label");

    var mediaLabels = chart.svg.selectAll(".media-label");


    bindMediaLabel(mediaType, mediaLabels, chart.media);

    function bindMediaLabel(type, mediaLabels, data) {
      if(type=="icon") {
        mediaLabels.data(data)
          .enter().append("text")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("class", "media-label mediatype-icon")
          .attr("transform", "translate(" + gridSize / 6 + ", -2)")
          .attr("value", function(d) {return d;})
          //.attr("font-family","FontAwesome")
          .text(function(d) { return mediaIcons[d]; });
      } else if(type == "image") {
        mediaLabels.data(data)
          .enter().append("svg:image")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("width", 25)
          .attr("height", 25)
          .attr("xlink:href", function(d) {return mediaImages[d];})
          .attr("class", "media-label mediatype-image")
          .attr("transform", "translate(4 , -30)")
          //.attr("transform", "translate(" + gridSize / 6 + ", -22)")
          .attr("value", function(d) {return d;});
      } else if(type == "text") {
        mediaLabels.data(data)
          .enter().append("text")
          .attr("x", function(d, i) { return i * gridSize; })
          .attr("y", 0)
          .attr("class", "media-label axis-mediatype")
          .attr("transform", "translate(" + gridSize / 2 + ", -2)")
          .attr("value", function(d) {return d;})
          .text(function(d) { return d; })
          .style("text-anchor", "middle")
          .attr("class", "media-label mono");
          //.attr("class", function(d, i) { return ((i >= data.length/2) ? "media-label mono axis axis-mediatype" : "media-label mono axis"); })
      }
    }

    var boxes = chart.svg.selectAll(".box")
                   .data(data, function(d) {return objVal(d,0)+':'+objVal(d,1);});

    //boxes.append("title"); //The tooltip

    boxes.enter().append("rect")
        .attr("x", function(d) { return (_.indexOf(chart.media, objVal(d,1))) * gridSize + padding; })
        .attr("y", function(d) { return (_.indexOf(chart.tags, objVal(d,0))) * gridSize + padding; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "box bordered")
        .attr("width", gridSize - padding*2)
        .attr("height", gridSize - padding*2)
        .style("fill", "white");

    boxes.select("title").text(function(d) { return objVal(d,2);});

    boxes.exit().remove();

    heatmapChart.prototype.changeColor(divId,colorTheme,data);

    /********************
     **  Interactions  **
    /********************/
    function resetGrid() {
      //reset everything
      chart.svg.selectAll(".box").classed("selected-bordered", false).classed("clicked-bordered", false);
      chart.svg.selectAll(".tag-label").classed("selected-taglabel", false).classed("clicked-taglabel", false);
      chart.svg.selectAll(".media-label").classed("selected-medialabel", false).classed("clicked-medialabel", false);
      mediaLabelUnhighlight();

      //...but highlight the the selected box and corresponding mediaLabel, and tagLabel
      if(state.boxClicked) {
        state.clickedBox.classed("clicked-bordered", true);
        state.clickedTagLabel.classed("clicked-taglabel", true);
        state.clickedMediaLabel.classed("clicked-medialabel", true);
        mediaLabelHighlight(state.clickedMediaLabel);
      }
    }

    //Interaction with the boxes
    chart.svg.selectAll(".box")
       .on("mouseover", boxMouseover)
       .on("mouseout", boxMouseout)
       .on("click", boxClick);

    function boxClick(d,i) {
      resetGrid();
      var clickedBox = d3.select(this);

      if(this.classList.contains("clicked-bordered")) {
        state.boxClicked = false;
        state.clickedBox = clickedBox;
        state.clickedMediaLabel = clickedMediaLabel;
        state.clickedTagLabel = clickedTagLabel;
      } else {
        var clickedMediaLabel = chart.svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
        var clickedTagLabel = chart.svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)});

        //mediaLabelHighlight(clickedMediaLabel);
        state.boxClicked = true;
        state.clickedBox = clickedBox;
        state.clickedMediaLabel = clickedMediaLabel;
        state.clickedTagLabel = clickedTagLabel;
        //resetGrid unhighlight everything box highlights the clicked box and
        //corresponding tagLabels and mediaLabels depending on the state variables above

      }
      resetGrid();

    }
    function boxMouseover(d,i) {
      resetGrid();

      //highlight selected box and corresponding labels
      d3.select(this).classed("selected-bordered", true);
      var selectedMediaLabel = chart.svg.selectAll(".media-label").filter(function(m) { return m == objVal(d,1)});
      mediaLabelHighlight(selectedMediaLabel);
      chart.svg.selectAll(".tag-label").filter(function(m) {return m == objVal(d,0)}).classed("selected-taglabel", true);

      //Update the tooltip position and value
      var xPosition = gridSize*chart.media.length+margin.left*1.5;
      var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y"))+tooltipHeight*3;

      d3.select(divId).selectAll(".tooltip").selectAll(".title").text("Value:");
      d3.select(divId).selectAll(".tooltip")
        .style("left", xPosition  + "px")
        .style("top", yPosition + "px")
        .selectAll(".value")
        .text(d.value + " thing(s) in this collection");

      //Show the tooltip
      d3.select(divId).selectAll(".tooltip").classed("hidden", false);
    }

    function mediaLabelHighlight(selected) {
      selected.classed("selected-medialabel", true)
              .attr("width", 38)
              .attr("height", 38)
              .attr("transform", function(d) {
                if(selected.classed("mediatype-image")) {
                  return "translate(0 , -40)"
                } else if(selected.classed("mediatype-icon")) {
                  return "translate(" + gridSize/9 + ", -2)"
                }
              });
    }

    function mediaLabelUnhighlight() {
      chart.svg.selectAll(".media-label").classed("selected-medialabel", false)
         .attr("width", 25)
         .attr("height", 25);
      chart.svg.selectAll(".mediatype-icon").attr("transform", "translate(" + gridSize / 6 + ", -2)");
      chart.svg.selectAll(".mediatype-image").attr("transform", "translate(4 , -30)");
    }


    function boxMouseout(d,i) {
      resetGrid();
      d3.select(divId).selectAll(".tooltip").classed("hidden", true); //Hide the tooltip
    }

    //Interaction with the media label
    chart.svg.selectAll(".media-label")
       .on("mouseover", mediaLabelMouseover)
       .on("mouseout", mediaLabelMouseout);;

    //Interaction with the mediaLabel
    function mediaLabelMouseover(d) {
      resetGrid();
      mediaLabelHighlight(d3.select(this));

      //Update the tooltip position and value
      var xPosition = parseFloat(d3.select(this).attr("x"))+margin.left-gridSize/2;
      var yPosition = $(divId).position().top + parseFloat(d3.select(this).attr("y"))-tooltipHeight;

      d3.select(divId).selectAll(".tooltip").selectAll(".title").text("Media Type");
      d3.select(divId).selectAll(".tooltip")
        .style("left", xPosition  + "px")
        .style("top", yPosition + "px")
        .selectAll(".value")
        .text(d);

      //Show the tooltip
      d3.select(divId).selectAll(".tooltip").classed("hidden", false);
    }

    function mediaLabelMouseout(d,i) {
      resetGrid();
      d3.select(divId).selectAll(".tooltip").classed("hidden", true); //Hide the tooltip
    }

    //Interaction with the tagLabel
    chart.svg.selectAll(".tag-label").on("mouseover", tagLabelMouseover);

    function tagLabelMouseover(d) {
      resetGrid();
      d3.select(this).classed("selected-taglabel", true);
    }
};

heatmapChart.prototype.changeColor = function(divId,colorTheme, data) {
   var colorScale = d3.scale.quantile()
           .domain([0, d3.max(data, function (d) { return parseFloat(objVal(d,2)); })])
           .range(colors[colorTheme]);
   var svg = d3.select(divId).selectAll("svg");
   svg.selectAll(".box").transition().duration(1000)
      .style("fill", function(d) { return colorScale(objVal(d,2));});


   svg.selectAll(".legend").remove();

   var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), function(d) { return d; });

   var legendY = tags(data).length * gridSize + margin.top * 1.5;

   legend.enter().append("g")
         .attr("class", "legend");

   legend.append("rect")
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", legendY)
         .attr("width", legendElementWidth)
         .attr("height", gridSize / 2)
         .style("fill", function(d, i) { return colors[colorTheme][i]; });

   legend.append("text")
         .attr("class", "mono")
         .text(function(d) { return "≥ " + Math.round(d); })
         .attr("x", function(d, i) { return legendElementWidth * i; })
         .attr("y", legendY + gridSize);

   legend.exit().remove();

   svg.selectAll(".legend").selectAll("rect").transition().duration(1000)

}


// Helper Functions for processing collection.csv//need to create key -> tags and tag -> keys
function CollectionData(data) {
  var tags = function(data,i) {return (data.map(function(d){return objVal(d,i)}));};
  var keys = function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.key];
    }
    return [];
  }
  var media = function(d, t) {
    //this function creates an array of keys that contains the tag
    if(d.tag1==t || d.tag2==t || d.tag3==t || d.tag4==t || d.tag5==t){
      return [d.favicon];
    }
    return [];
  }

  //Helper Function to construct tag2items
  function allTags(data) {
    var uniqueTags = _.unique(
      tags(data,6).concat(
        tags(data,7),tags(data,8),tags(data,9),tags(data,10))
    );

    return _.reject(uniqueTags, function(d){return d=="NULL";});
  };

  function tags2items(data) {
    /*
      returns an array of Objects in which an Object looks like:
        {keys: ["k1", "k2"], media: ["m1", "m2"], tag: "datavis"}
     */
    var arr = [];
    var t = allTags(data);
    for(var i=0; i<t.length; i++) {
      //if(keys(data[i],allTags[i]))
      var k = [];
      var m = [];
      for(var j=0; j<data.length; j++) {
        k = k.concat(keys(data[j], t[i]));
        m = m.concat(media(data[j], t[i]))
      }
      arr.push({tag: t[i], keys: k, media: m});
    }
    return arr;
  }

  function item2tags(data) {
    var arr = [];
    arr = data.map(function(d,i) {
      return {key: d.key, tags: allTags([data[i]])};
    });
    return arr;
  }

  function items(data) {
    var arr =[];
    var lut = {
      "assets/css/images/donut.png": "Image"
    }
    arr = data.map(function(d,i) {
      var icon = d.favicon;
      return {
        key: d.key,
        url: d.url,
        username: d.username,
        title: d.title,
        description: d.description,
        favicon: function(d) {
          return d.favicon;
        }
      }
    });
    return arr;
  }
  return {items: items(data), tagToItems: tags2items(data), itemToTags: item2tags(data)};
}


//Initialize
state.mediaType = mediaTypes[0];
state.colorTheme = colorThemes[0];

d3.csv("collection.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    var json = new CollectionData(data);
  }
});


d3.csv("data.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    state.data = data;
    state.heatmapChart = new heatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
  }
});
d3.csv("data2.csv", function(error, data) {
  if(error) {
    console.log(error);
  } else {
    heatmapChart("#chart2", data, mediaTypes[1], state.colorTheme);
  }
});

var datasetPicker = d3.select("#dataset-picker").selectAll(".dataset-button").data(datasets);
var mediaTypePicker = d3.select("#mediatype-picker").selectAll(".mediatype-button").data(mediaTypes);
var colorsPicker = d3.select("#colors-picker").selectAll(".colors-button").data(colorThemes);

datasetPicker.enter()
  .append("input")
  .attr("value", function(d){ return "Dataset: " + d })
  .attr("type", "button")
  .attr("class", "dataset-button")
  .on("click", function(d) {
    d3.csv(d, function(error, data) {
      if(error) {
        console.log(error);
      } else if(d=="data2.csv" || d=="data.csv") {
        state.data = data;
        state.mediaType = (d=="data2.csv") ? "image" : "icon";
        d3.select("#chart").selectAll("svg").remove();
        state.heatmapChart = new heatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
      } else if(d=="collection.csv") {
        var json = new CollectionData(data);
        //create array of Objects {mediaLabel: "Image",  tag: "Design", Count: "0"}
        state.data = [];
        var t2i = json.tagToItems;

        function matrixData(data) {
          var arr = [];
          for(i=0; i<data.length; i++) {
            var d = data[i];
            //helper functions
            var uniqueMedia = function(d) {
              return _.unique(d.media);
            }

            var getValue = function(d, m) {
              return _.filter(d.media, function(test) {return test==m;}).length;
            }

            arr = arr.concat(
              uniqueMedia(d).map(function(m) {
                return {tag: d.tag, mediaLabel: m, value: getValue(d, m)};
              })
            );
          }
          return arr;
        }
        state.data = matrixData(t2i);

        state.mediaType = "icon";
        d3.select("#chart").selectAll("svg").remove();
        state.heatmapChart = new heatmapChart("#chart", state.data, state.mediaType, state.colorTheme);

      }
    });
  });

mediaTypePicker.enter()
  .append("input")
  .attr("value", function(d){ return "MediaType: " + d })
  .attr("type", "button")
  .attr("class", "Mediatype-button")
  .on("click", function(d) {
    state.mediaType = d;
    state.boxClicked = false;
    d3.select("#chart").selectAll("svg").remove();
    state.heatmapChart = new heatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
  });
colorsPicker.enter()
  .append("input")
  .attr("value", function(d){ return "MediaType: " + d })
  .attr("type", "button")
  .attr("class", "colors-button")
  .on("click", function(d) {
    state.colorTheme = d;
    //d3.select("#chart").selectAll("svg").remove();
    //heatmapChart("#chart", state.data, state.mediaType, state.colorTheme);
    state.heatmapChart.changeColor("#chart", state.colorTheme, state.data);
  });
