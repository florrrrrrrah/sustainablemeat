const data = [
    { category: 'Vegan', values: [2, 2, 2, 2, 3, 2, 2, 3, 2, 2] },
    { category: 'Vegetarian', values: [5, 5, 6, 5, 7, 5, 5, 5, 5, 5] },
    { category: 'Flexitarian', values: [13, 15, 13, 14, 14, 16, 16, 14, 14, 13] },
    { category: 'Pescetarian', values: [3, 2, 3, 3, 3, 3, 3, 3, 3, 3] },
    { category: 'Meat eater', values: [73, 72, 72, 73, 68, 70, 70, 71, 72, 73] }
];

const dates = ['JUL 2019', 'JAN 2020', 'JUL 2020', 'JAN 2021', 'JUL 2021', 'JAN 2022', 'JUL 2022', 'JAN 2023', 'JUL 2023', 'JAN 2024'];

// SVG setup

const margin = { top: 120, right: 40, bottom: 120, left: 20 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("svg#dietary")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.select("svg#dietary")
    .style("background-color", "rgba(255, 252, 249, 1)");

// Border

svg.append("rect")
    .attr("x", -margin.left)
    .attr("y", -margin.top)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "none")
    .attr("stroke-width", 2);

// Header

svg.append("text")
    .attr("class", "header")
    .attr("x", 0)
    .attr("y", -80)
    .text("Less Flexitarians and More Meat Eaters");

// Subheader

svg.append("text")
    .attr("class", "subheader")
    .attr("x", 0)
    .attr("y", -50)
    .text("Trend in dietary preferences in the UK, by year");

// Footnote


svg.append("a")
    .attr("xlink:href", "https://yougov.co.uk/topics/society/trackers/dietery-choices-of-brits-eg-vegeterian-flexitarian-meat-eater-etc?period=5yrs")
    .attr("target", "_blank")
    .append("text")
    .attr("class", "footnote")
    .attr("x", width)
    .attr("y", height + margin.bottom - 10)
    .style("text-decoration", "underline")
    .text("Source: YouGov");


// Scale

const x = d3.scalePoint()
    .domain(dates)
    .range([0, width - 50]);

const y = d3.scaleLinear()
    .domain([0, 80])
    .range([height, 0]);

// Axis

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .tickFormat(d => `${d}%`);

svg.append("g")
    .attr("transform", `translate(50,${height + 30} )`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-family", "Source Sans Pro, sans-serif")
    .style("font-size", "12px")
    .style("fill", "rgba(50, 46, 24, 1)");

svg.append("g")
    .call(yAxis)
    .attr("transform", `translate(50,30)`)
    .selectAll("text")
    .style("font-family", "Source Sans Pro, sans-serif")
    .style("font-size", "12px")
    .style("fill", "rgba(50, 46, 24, 1)");

// Line

const line = d3.line()
    .x((d, i) => x(dates[i]))
    .y(d => y(d));

const color = d3.scaleOrdinal()
    .domain(data.map(d => d.category))
    .range([
        "rgba(168, 198, 134, 1)",
        "rgba(50, 46, 24, 1)",
        "rgba(243, 167, 18, 1)",
        "rgba(102, 155, 188, 1)",
        "#b55340ff"
    ]);

const paths = [];

data.forEach((d, i) => {
    const path = svg.append("path")
        .datum(d.values)
        .attr("fill", "none")
        .attr("stroke", color(d.category))
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("class", "line")
        .attr("transform", `translate(50,30)`);

    paths.push(path);

    // label
    if (d.category === 'Meat eater' || d.category === 'Flexitarian') {
        const lastDataPoint = d.values[d.values.length - 1];
        svg.append("text")
            .attr("x", x(dates[dates.length - 1]) + 55)
            .attr("y", y(lastDataPoint) + 30)
            .attr("fill", color(d.category))
            .attr("dy", ".35em")
            .text(lastDataPoint + '%')
            .style("font-family", "Source Sans Pro, sans-serif")
            .style("font-size", "12px");
    }

    if (d.category === 'Flexitarian') {
        const fifthDataPoint = d.values[4];
        svg.append("text")
            .attr("x", x(dates[4]) + 40)
            .attr("y", y(fifthDataPoint) + 30)
            .attr("fill", color(d.category))
            .attr("dy", "-0.7em")
            .text(fifthDataPoint + '%')
            .style("font-family", "Source Sans Pro, sans-serif")
            .style("font-size", "12px");
    }

    if (d.category === 'Meat eater') {
        const fifthDataPoint = d.values[4];
        svg.append("text")
            .attr("x", x(dates[4]) + 40)
            .attr("y", y(fifthDataPoint) + 30)
            .attr("fill", color(d.category))
            .attr("dy", "-0.7em")
            .text(fifthDataPoint + '%')
            .style("font-family", "Source Sans Pro, sans-serif")
            .style("font-size", "12px");
    }

});


// Legend

const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(0, 0)");

data.forEach((d, i) => {
    const legendItem = legend.append("g")
        .attr("transform", `translate(${i * 90}, 0)`);

    legendItem.append("rect")
        .attr("x", 0)
        .attr("y", -18)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", color(d.category));

    legendItem.append("text")
        .attr("x", 15)
        .attr("y", -12)
        .attr("dy", ".35em")
        .text(d.category);
});

// dealy animation

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            paths.forEach(path => {
                const totalLength = path.node().getTotalLength();
                path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
            observer.disconnect();
        }
    });
}, { threshold: 0.5 });

observer.observe(document.querySelector('svg#dietary'));