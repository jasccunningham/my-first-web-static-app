const width = 700;
const radius = width / 2;

const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
};

const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => d.y0 * radius / 5)
    .outerRadius(d => d.y1 * radius / 5 - 1);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", width)
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

const data = {
    name: "root",
    children: [
        {
            name: "Group A",
            children: [
                { name: "A1", value: 100 },
                { name: "A2", value: 300 }
            ]
        },
        {
            name: "Group B",
            children: [
                { name: "B1", value: 200 },
                {
                    name: "B2",
                    children: [
                        { name: "B2.1", value: 150 },
                        { name: "B2.2", value: 50 }
                    ]
                }
            ]
        }
    ]
};

const root = partition(data);

root.each(d => d.current = d);

svg.selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", d => d3.interpolateCool(d.depth / 4))
    .attr("d", d => arc(d.current))
    .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(d.ancestors().map(d => d.data.name).reverse().join(" → ") + "<br/>" + d.value)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
    });
