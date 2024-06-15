// Load the data and create the choropleth map
Promise.all([
    d3.json('path/to/your/world-geojson.json'), // Replace with your GeoJSON file path
    d3.json('path/to/your/alcohol-consumption.json') // Replace with your data file path
]).then(([geojson, data]) => {
    const width = 800;
    const height = 500;

    const svg = d3.select("#choropleth")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d.consumption)]);

    svg.selectAll("path")
        .data(geojson.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", d => {
            const countryData = data.find(item => item.country === d.properties.name);
            return countryData ? color(countryData.consumption) : "#ccc";
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);
});
