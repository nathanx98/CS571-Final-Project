//D3 CODE
// i use this later on
const clamp = (num, min, max) => { return Math.min(Math.max(num, min), max) }

var ccd_data_overdue = [];
var ccd_data_total = [];
var allXScalesTotal = [];
var allXScalesOverdue = [];
var allYScalesTotal = [];
var subgroups = [];
var groups = [];
var onTimelabels = [];
var xScaleOnTime;
var yScaleOnTime;
var onTimeData;
var x, y, color, svg;

var yAxis_ontime;
var xAxis_top = [];
var yAxis_top = [];

var Tooltip, mouseover, mousemove, mouseleave, setTooltip, touch, touchClear;


color_overdue = d3.scaleOrdinal()
    .domain([0,1])
    .range(['#ff6701', '#377eb8'])

color_total = d3.scaleOrdinal()
    .domain([0,1])
    .range(['#377eb8', '#ff6701'])

color = [color_total, color_overdue]

// set the dimensions and margins of the graph
var margin = {top: 40, right: 100, bottom: 80, left: 120},
    w = 700 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
Promise.all([
    d3.csv("./city_council/csv/1.csv", type),
    d3.csv("./city_council/csv/2.csv", type),
    d3.csv("./city_council/csv/3.csv", type),
    d3.csv("./city_council/csv/4.csv", type),
    d3.csv("./city_council/csv/5.csv", type),
    d3.csv("./city_council/csv/6.csv", type),
    d3.csv("./city_council/csv/7.csv", type),
    d3.csv("./city_council/csv/8.csv", type),
    d3.csv("./city_council/csv/9.csv", type),
]).then(function(allData) {
    subgroups = allData[0].columns.slice(1).slice(1,3)

    // Add Y axis
    let y0 = d3.scaleLinear()
    .domain([0, 11000])
    .range([ h, 0 ]);
    let y1 = d3.scaleLinear()
    .domain([0, 11000])
    .range([ h, 0]);

    y = [y0, y1];




    for(var i=0; i < allData.length; i++) {
        
    // top 10 most commonly overdue types of cases
        sortedDataOverdue = allData[i].sort(function(x,y) {
        return d3.descending(x.overdue, y.overdue)
        })
        groupsOverdue = d3.map(sortedDataOverdue.slice(0,10), (d) => {return d.type});

    // creates stacked data for overdue
        var stackedDataOverdue = d3.stack()
        .keys(subgroups.reverse())
        (sortedDataOverdue)

        // create X axis scale for overdue
        var xOverdue = d3.scaleBand()
            .domain(groupsOverdue)
            .range([0, w])
            .padding([0.5]);

            
        
        // top 10 most common types of cases
        sortedDataTotal = allData[i].sort(function(x,y) {
        return d3.descending(x.overdue + x.ontime, y.overdue + y.ontime)
        })
        groupsTotal = d3.map(sortedDataTotal.slice(0,10), (d) => {return d.type})

        // creates stacked data for most common
        var stackedDataTotal = d3.stack()
        .keys(subgroups.reverse())
        (sortedDataTotal);

        // create X axis scale for total
        var xTotal = d3.scaleBand()
            .domain(groupsTotal)
            .range([0, w])
            .padding([0.5]);

        var yTotal = d3.scaleLinear()
        .domain([0, sortedDataTotal[0].ontime + sortedDataTotal[0].overdue])
        .range([h, 0]);


        // store the scales
        allXScalesTotal.push(xTotal)
        allXScalesOverdue.push(xOverdue)
        allYScalesTotal.push(yTotal)

        // store the stacked data
        ccd_data_overdue.push(stackedDataOverdue.map((d) => d.slice(0, 10)))
        ccd_data_total.push(stackedDataTotal.map((d) => d.slice(0, 10)))
        
    }


    // TOOL TIP CODE

    // creates tool tip
    Tooltip = d3.select("#tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

    // mouse over event. set opacity to 1, outline bar
    mouseover = function(event) {
    Tooltip 
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }

    // mouse move event, move tooltip to mouse location, choose side of bar to place tooltip
    mousemove = function(event, d) {
    console.log(d.data.type.length)
    var offset;
    if(d3.pointer(event)[0] > 5 * w / 8)
        offset = -100 + -1 * Math.pow(d.data.type.length, 1.4);
    else
        offset = 20;
    Tooltip
        .html(d.data.type)
        .style("left", (event.pageX+offset) + "px")
        .style("top", (event.pageY) + "px")
    }

    // mouse leave event, set opacity to 0, unoutline bar
    mouseleave = function(event) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
    }

    // touch event (set to onclick)
    touch = function(event, d) {

    // remove all outlines from all rects
    d3.selectAll(".stacked_rect").style("stroke", "none");
    
    
    // set opacity to 1, outline bar
    Tooltip 
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
        
    // choose offset, place tooltip
    var offset;
    if(d3.pointer(event)[0] > 5 * w / 8)
        offset = -100 + -1 * Math.pow(d.data.type.length, 1.4);
    else
        offset = 20;
    Tooltip
        .html(d.data.type)
        .style("left", (event.pageX+offset) + "px")
        .style("top", (event.pageY) + "px")

    event.stopPropagation();
    }
    
    touchClear = function() {
    
    d3.selectAll(".stacked_rect").style("stroke", "none");
    
    Tooltip
        .style("opacity", 0)
        
    }
    
    // add an event listener for REMOVING tooltips when clicking anywhere else
    document.addEventListener("click", touchClear);

    render(ccd_data_total, 0, allXScalesTotal, allYScalesTotal,  0 )
    render(ccd_data_overdue, 0, allXScalesOverdue, allYScalesTotal,  1)

});

Promise.all([
    d3.csv("./city_council/csv/ontime1.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime2.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime3.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime4.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime5.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime6.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime7.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime8.csv", typeOnTime),
    d3.csv("./city_council/csv/ontime9.csv", typeOnTime),
]).then(function(allData) {
    onTimeData = typeOnTime(allData)
    xScaleOnTime = d3.scaleBand()
    .domain(["Ontime", "Overdue"])
    .range([0, w])
    .padding([0.5])

    yScaleOnTime = d3.scaleLinear()
    .domain([0, 40000])
    .range([h, 0]);
    
    renderOnTime(onTimeData, 0);
});
        
function switchDistrict(district)
{

    updateOnTime(onTimeData, district);
    update(ccd_data_total, district, allXScalesTotal, allYScalesTotal, 0)
    update(ccd_data_overdue, district, allXScalesOverdue, allYScalesTotal, 1)
    
    $('label.btn').click(function() {
        $('.btn-group').children('label.btn').removeClass('active');
        $('.' + (district + 1)).addClass('active');
    });
}

// renders (initally) the "ontime vs overdue bar chart"
function renderOnTime(data, district)
{
    //selects container and appends SVG and a group inside the SVG
    svg = d3.select("#ontime_container")
    .append("div")
    .attr("id", "ontime")
        .append("svg")
        .attr("viewBox", "0 0 " + (w + margin.left + margin.right) +  " " + (h + margin.top + margin.bottom))
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // creates and stores axis
    yAxis_ontime = svg.append("g")
    .call(d3.axisLeft(yScaleOnTime))
    .style("font-size", "1.5em");
    // append the svg object to the #container of the page

    
    // Show the bars
    svg
    .selectAll("rect")
    .data(data[district])
    .enter().append("rect") 
        .attr("fill", function(d) { return color[0]((d.time == "Ontime") ? 1 : 0) })
        .attr("x", function(d) {  return xScaleOnTime(d.time); })
        .attr("y", function(d) { return yScaleOnTime(d.count)})
        .attr("height", function(d) { return h - yScaleOnTime(d.count); })
        .attr("width",xScaleOnTime.bandwidth()) 

    //creates y axis
    svg.append("g")
    .attr("transform", "translate(0," + (h)  + ")")
    .call(d3.axisBottom(xScaleOnTime).tickSizeOuter(0))
    .selectAll("text")  
        .style("font-size", "3em")
}

// renders stacked bar chart
function render(data, district, xScales, yScales, index) {
    console.log(data);
    // selects container and adds a div with ID and and SVG
    svg = d3.select("#top10_" + index + "_container")
    .append("div")
    .attr("id", "top10_" + index)
        .append("svg")
        .attr("viewBox", "0 0 " + (w + margin.top + margin.bottom) +  " " + (h + margin.left + margin.right))
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    // Show the bars
    svg.append("g")
        .classed("bar", true)
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(data[district])
        .enter().append("g")
        .attr("fill", function(d) { return color[index](clamp(d[0][0], 0, 1)); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("class", "stacked_rect")
            .attr("x", function(d) { if(xScales[district](d.data.type) == undefined) console.log(d.data.type); return xScales[district](d.data.type); })
            .attr("y", function(d) {  return yScales[district](d[1]); })
            .attr("height", function(d) { return yScales[district](d[0]) - yScales[district](d[1]); })
            .attr("width",xScales[district].bandwidth())
            .attr("stroke-width", "2px")
            // add tooltip events
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", touch);

    svg.append("g")
    .classed("yaxis", true)
    .call(d3.axisLeft(yScales[district]))
    .style("font-size", "1.3em");

    

    
    svg.append("g")
    .classed("xaxis", true)
    .attr("transform", "translate(0," + (h)  + ")")
    .call(d3.axisBottom(xScales[district]).tickSizeOuter(0))
    .selectAll("text")  
        .style("font-size", "1.5em")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)" );
    
        
}


// updates the data
function update(data, district, xScales, yScales, index) {

    // selects necessary elements
    var bargroups = d3.select("#top10_" + index).select("svg").select("g").select(".bar").selectAll("g")
    .data(data[district]);
    var rects = bargroups.selectAll("rect")
    .data(function(d) { return d; });
    var xaxis = d3.select("#top10_" + index).select("svg").select("g").select(".xaxis");
    var yaxis = d3.select("#top10_" + index).select("svg").select("g").select(".yaxis");
    
    // add new data
    bargroups
    .enter()
    .append("g")
    .merge(bargroups)
    .transition()
    .duration(1000)
    .attr("fill", function(d) { return color[index](clamp(d[0][0], 0, 1)); })
    
    // create new rectangles and transition them
    rects
        .enter().append("rect")
        .merge(rects)
        .transition()
        .duration(1000)
        .attr("x", function(d) { if(xScales[district](d.data.type) == undefined) console.log(d.data.type); return xScales[district](d.data.type); })
        .attr("y", function(d) {  return yScales[district](d[1]); })
        .attr("height", function(d) { return yScales[district](d[0]) - yScales[district](d[1]); })
        .attr("width",xScales[district].bandwidth())

    // transition the x axis
    xaxis
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScales[district]).tickSizeOuter(0))
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)" );

    // in a separate call so the font size doesn't have a transformation
    xaxis
    .selectAll("text")  
        .style("font-size", "1.5em")
    
        
    yaxis
    .transition()
    .duration(1000)
    .call(d3.axisLeft(yScales[district]))

}

// updates the ontime vs overdue bar chart
function updateOnTime(data, district)
{
    
    // transition axis to axis for district

    // select bars
    var bars = d3.select("#ontime").select("svg").select("g").selectAll("rect")
    .data(data[district]);
    console.log(data[district][0]);
    console.log(data[district][1]);
    // enter the new data
    bars
    .enter()
    .append("rect")
    .merge(bars)
    .transition()
    .duration(1000)
        .attr("x", function(d) {  return xScaleOnTime(d.time); })
        .attr("y", function(d) { return yScaleOnTime(d.count)})
        .attr("height", function(d) { return h - yScaleOnTime(d.count); })
        .attr("width",xScaleOnTime.bandwidth())

}

// this is necessary to turn these numeric attributes to js number types, and on time into a boolean
function type(d) {
    d.type = d.type;
    d.ontime = +d.ontime
    d.overdue = +d.overdue
    
    return d;
} 

function typeOnTime(d) {
    d.time = (d.ontime == "ONTIME") ? "Ontime" : "Overdue";
    d.count = +d.count;
    return d;
} 