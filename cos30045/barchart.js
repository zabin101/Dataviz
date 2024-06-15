// Load the data and create the bar chart
d3.json('path/to/your/alcohol-consumption.json').then(data => {
    const width = 800;
    const height = 500;
    const margin = {top: 20, right: 30, bottom: 40, left: 40};

    const svg = d3.select("#barchart")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.consumption)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d.country))
        .attr("y", d => y(d.consumption))
        .attr("height", d => y(0) - y(d.consumption))
        .attr("width", x.bandwidth());

    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", `translate(${margin.left},0)`);

    svg.append("g")
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
});
