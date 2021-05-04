function draw_grouped_bar_chart(data){

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 20, left: 50},
            width = 800 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#barchart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Parse the Data
        

        // List of subgroups = header of the csv files = soil condition here

        var subgroups = ["red","blue"]
       
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = new Set();

        for (var dic of data)
            for (var element of Object.keys(dic))
                groups.add(element);

        var new_data = []
        for (var key of groups){
            var datum ={} 
            for(var i=0 ; i<data.length;i++){
                datum[subgroups[i]] = data[i][key] || 0;
            }
            datum['group'] = key
            new_data.push(datum);
        }
        console.log("bar data",new_data);


        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.8])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll('.tick text') // select all the x tick texts
            .call(function(t){                
              t.each(function(d){ // for each one
                var self = d3.select(this);
                var s = self.text().split(' ');  // get the text and split it
                self.text(''); // clear it out
                self.append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy",".8em")
                  .text(s.slice(0,s.length/2).join(" "));
                self.append("tspan")
                  .attr("x", 0)
                  .attr("dy",".8em")
                  .text(s.slice(s.length/2).join(" "));
              })
            });

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 40])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Another scale for subgroup position?
        var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c','#377eb8'])

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(new_data)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]||0}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return xSubgroup(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", xSubgroup.bandwidth())
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill", function(d) { return color(d.key); });

    

}