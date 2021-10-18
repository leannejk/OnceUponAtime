// set the dimensions and margins of the graph
const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 550 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    innerRadius = 60,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

//color scale:
var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateViridis);

const max = 50

//init:
updateVisualization()

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
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(data.map(d => d.Word)); // The domain of the X axis is the list of words
        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([0, maxNum]); // Domain of Y is from 0 to the max seen in the data


        //Tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d, i) {
                return i.Word + ":  <strong style='color:#863c6c'>" + i.Num + "</strong> <span>" + "Times" + "</span>";
            })

        svg.call(tip);


        // Add the bars
        var barSelection = svg.selectAll("path").data(data)

        barSelection.enter().append("path")
            .attr("class", "bar")
            .merge(barSelection)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .transition()
            .duration(3000)
            .attr("fill", function (d){
                return myColor(d.Num)
            })
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(d => y(d['Num']))
                .startAngle(d => x(d.Word))
                .endAngle(d => x(d.Word) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))

        //exit:
        barSelection.exit()
            .remove();

        //delete previous text:
        var element = Array.prototype.slice.call(document.getElementsByTagName("text"),0);

        for (var index = 0, len = element.length; index < len; index++) {
            element[index].parentNode.removeChild(element[index]);
        }

        // Add the labels
        var gSelection = svg.selectAll("g").data(data)

        gSelection.enter().append("g")
            .merge(gSelection)
            .attr("text-anchor", function (d) {
                return (x(d.Word) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start";
            })
            .attr("transform", function (d) {
                return "rotate(" + ((x(d.Word) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.Num) + 10) + ",0)";
            })
            .append("text")

            .attr("transform", function (d) {
                return (x(d.Word) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)";
            })
            .transition()
            .duration(3000)
            .text(function (d) {
                return (d.Word)
            })
            .style("font-size", "14px")
            .attr("alignment-baseline", "middle")

        //exit:
        gSelection.exit()
            .remove();



})
}