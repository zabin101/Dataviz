// JavaScript code for creating visualizations

// Width and height settings
const mapWidth = 960;
const mapHeight = 600;
const barChartWidth = 960;
const barChartHeight = 600;
const barChartMargin = {top: 20, right: 30, bottom: 40, left: 40};

// SVG container for the choropleth map
const mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

// SVG container for the bar chart
const barChartSvg = d3.select("#barchart")
    .append("svg")
    .attr("width", barChartWidth + barChartMargin.left + barChartMargin.right)
    .attr("height", barChartHeight + barChartMargin.top + barChartMargin.bottom)
    .append("g")
    .attr("transform", `translate(${barChartMargin.left},${barChartMargin.top})`);

// Load and process data for the choropleth map
d3.json("world-geojson.json").then(worldData => {
    d3.csv("data3.csv").then(data => {
        // Data processing for the map
        const countryData = {};
        data.forEach(d => {
            countryData[d.Country] = +d.Value;
        });

        // Color scale for the choropleth map
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(data, d => d.Value)]);

        // Draw the map
        mapSvg.selectAll("path")
            .data(topojson.feature(worldData, worldData.objects.countries).features)
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", d => colorScale(countryData[d.properties.name] || 0))
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .on("mouseover", function(event, d) {
                // Tooltip or highlight code can be added here
            });

    });
});

// Load and process data for the bar chart
d3.csv("data3.csv").then(data => {
    // Data processing for the bar chart
    const nestedData = d3.nest()
        .key(d => d.Country)
        .entries(data);

    // Scales for the bar chart
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, barChartWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .range([barChartHeight, 0]);

    // Draw the bars
    nestedData.forEach(countryData => {
        barChartSvg.selectAll(`.bar-${countryData.key}`)
            .data(countryData.values)
            .enter().append("rect")
            .attr("class", `bar-${countryData.key}`)
            .attr("x", d => xScale(d.Year))
            .attr("y", d => yScale(d.Value))
            .attr("width", xScale.bandwidth())
            .attr("height", d => barChartHeight - yScale(d.Value))
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                // Tooltip or highlight code can be added here
            });
    });

    // Axes for the bar chart
    barChartSvg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${barChartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    barChartSvg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));
});
