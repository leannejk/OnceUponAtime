// set the dimensions and margins of the graph
const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border


var myColor = d3.scaleSequential()
    .interpolator(d3.interpolatePuRd);

updateVisualization()

var max = 60

function updateVisualization(){

    var select = document.getElementById('story-chosen');
    var valueSelected = String(select.options[select.selectedIndex].value);
    var address = "data/" + valueSelected + ".csv"
    d3.csv(address).then(function(data) {
        var currentMax = max
        data = data.sort(function (a,b) {return b.Num - a.Num})
        data = data.filter(word => word.Num > 1)
        if (data.length > currentMax){
            data = data.slice(0, currentMax)
        } else {currentMax = data.length}

        var minNum = data[currentMax - 1].Num
        var maxNum = data[0].Num
        myColor.domain([minNum, maxNum])


        // Scales
        const x = d3.scaleBand()
            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)                  // This does nothing
            .domain(data.map(d => d.Word)); // The domain of the X axis is the list of states.
        const y = d3.scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([0, 50]); // Domain of Y is from 0 to the max seen in the data

        //reset svg
        // document.getElementById("chart-area").remove();


        // append the svg object
        var svg = d3.select("#chart-area")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

        // Add the bars
        svg.append("g")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("fill", function (d){
                return myColor(d.Num)
            })
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(d => y(d['Num']))
                .startAngle(d => x(d.Word))
                .endAngle(d => x(d.Word) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))

        // Add the labels
        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("text-anchor", function (d) {
                return (x(d.Word) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start";
            })
            .attr("transform", function (d) {
                return "rotate(" + ((x(d.Word) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.Num) + 10) + ",0)";
            })
            .append("text")
            .text(function (d) {
                return (d.Word)
            })
            .attr("transform", function (d) {
                return (x(d.Word) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)";
            })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")

})
}