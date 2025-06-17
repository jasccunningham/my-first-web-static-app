const width = 700;
const radius = width / 2;

const data = {
  name: "China Trade",
  children: [
    {
      name: "Southeast Asia",
      children: [
        { name: "Vietnam", value: 100 },
        { name: "Thailand", value: 80 },
        { name: "Malaysia", value: 60 },
        { name: "Indonesia", value: 90 }
      ]
    },
    {
      name: "Africa",
      children: [
        { name: "Nigeria", value: 70 },
        { name: "Kenya", value: 50 },
        { name: "South Africa", value: 85 },
        { name: "Ethiopia", value: 40 }
      ]
    }
  ]
};

const partition = data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);
  return d3.partition()
    .size([2 * Math.PI, radius])(root);
};

const root = partition(data);

const arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => d.y0)
  .outerRadius(d => d.y1);

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", width)
  .append("g")
  .attr("transform", `translate(${radius},${radius})`);

svg.selectAll("path")
  .data(root.descendants())
  .join("path")
  .attr("display", d => d.depth ? null : "none")
  .attr("d", arc)
  .style("stroke", "#fff")
  .style("fill", d => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return scale((d.children ? d : d.parent).data.name);
  })
  .append("title")
  .text(d => `${d.data.name}\n${d.value}`);
