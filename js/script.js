// Configuration for nodes and their hover images
const nodes = [
    { id: "Creative Programming", size: 150, color: "#FF6F61", images: ["images/cultpersp.jpg", "images/cultpersp2.jpg",  "images/cutper2.mov",  "images/cultper3.mov",  "images/cultper4.jpg"], x: 200, y: 200 },
    { id: "Product Design", size: 75, color: "#FFD700", images: ["images/lmd.jpg", "images/dextknife1.jpg", "images/dextknife2.jpg", "images/dextknife3.jpg", "images/textted.jpg", "images/teddy1.jpg", "images/teddy2.jpg", "images/teddy3.jpg"], x: 300, y: 200 },
    { id: "Data Analysis", size: 90, color: "#1E90FF", images: ["images/data1.jpg", "images/unions1.jpg", "images/unions2.jpg", "images/union3.jpg", "images/union4.jpg"], x: 400, y: 300 },
    { id: "Data Sonification", size: 90, color: "#FF4500", images: ["images/Sankofa1.jpg"], x: 600, y: 400 },
    { id: "Web Design", size: 100, color: "#800080", images: ["images/Sankofa1.jpg"], x: 700, y: 400 },
    //{ id: "Research", size: 120, color: "#FFA07A", images: ["images/curlconnresearch.jpg"], x: 800, y: 500 },
    { id: "User Experience", size: 90, color: "#FFA07A", images: ["images/interactdesign.jpg", "images/interact.mov","images/curlconn.jpg"], x: 800, y: 500 },
];

// Get container dimensions and header height
const canvasContainer = document.getElementById("canvas-container");
const headerHeight = document.querySelector("header").offsetHeight;
const containerWidth = canvasContainer.offsetWidth;
const containerHeight = canvasContainer.offsetHeight - headerHeight;

// Create SVG canvas
const svg = d3
    .select("#canvas-container")
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight);

// Add force simulation
const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
    .force("collision", d3.forceCollide().radius(d => d.size + 10))
    .on("tick", ticked);

// Add nodes
const nodeElements = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(
        d3
            .drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
    );

// Append circles to nodes
nodeElements
    .append("circle")
    .attr("r", d => d.size)
    .attr("fill", d => d.color);

// Append labels to nodes
nodeElements
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("fill", "white")
    .text(d => d.id);

// Click handler to open lightboxes
nodeElements.on("click", function (event, d) {
    openLightbox(d);
});

// Tick function for simulation
function ticked() {
    nodeElements.attr("transform", d => `translate(${d.x},${d.y})`);
}

// Drag functions
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Calculate boundaries for nodes
const leftBoundary = 0;
const rightBoundary = containerWidth;
const topBoundary = headerHeight;
const bottomBoundary = containerHeight;

// Add tick function to enforce boundary constraints
function ticked() {
    nodeElements.attr("transform", d => {
        // Boundary enforcement
        d.x = Math.max(d.size, Math.min(rightBoundary - d.size, d.x));
        d.y = Math.max(topBoundary + d.size, Math.min(bottomBoundary - d.size, d.y));
        return `translate(${d.x},${d.y})`;
    });
}

// Function to extract the base name from an image URL
function getBaseName(url) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.split("_")[0]; // Assuming base name is before an underscore
}

// Group images by their base names
function groupImagesByBaseName(nodes) {
    const groupedImages = {};
    nodes.forEach(node => {
        node.images.forEach(image => {
            const baseName = getBaseName(image);
            if (!groupedImages[baseName]) {
                groupedImages[baseName] = [];
            }
            groupedImages[baseName].push(image);
        });
    });
    return groupedImages;
}

nodeElements.on("click", function (event, d) {
    openLightboxForGroup({ images: d.images });
});

function openLightboxForGroup(imageGroup) {
    // Remove any existing lightbox
    d3.selectAll(".lightbox").remove();

    // Create a lightbox container
    const lightbox = d3.select("body")
        .append("div")
        .attr("class", "lightbox")
        .style("position", "fixed")
        .style("top", "50%")
        .style("left", "50%")
        .style("transform", "translate(-50%, -50%)")
        .style("width", "80%")
        .style("max-width", "600px")
        .style("height", "auto")
        .style("background-color", "rgba(0, 0, 0, 0.9)")
        .style("color", "white")
        .style("padding", "20px")
        .style("border-radius", "10px")
        .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.9)")
        .style("z-index", 1000);

    let currentIndex = 0;

    function renderImage() {
        // Remove any previous content
        lightbox.selectAll(".lightbox-content").remove();

        // Add lightbox content container
        const content = lightbox.append("div").attr("class", "lightbox-content");

        // Add image
        content.append("img")
            .attr("src", imageGroup.images[currentIndex])
            .style("width", "100%")
            .style("height", "auto")
            .style("border-radius", "5px")
            .style("display", "block")
            .style("margin", "0 auto");

        // Add description
        content.append("p")
            .text(`Image ${currentIndex + 1} of ${imageGroup.images.length}`)
            .style("text-align", "center")
            .style("margin-top", "10px");

        // Add navigation buttons container
        const buttonContainer = content.append("div")
            .style("display", "flex")
            .style("justify-content", "space-between")
            .style("margin-top", "15px");

        // Previous button
        buttonContainer.append("button")
            .text("Previous")
            .style("padding", "10px 20px")
            .style("background-color", "#555")
            .style("color", "white")
            .style("border", "none")
            .style("cursor", "pointer")
            .style("border-radius", "5px")
            .on("click", () => {
                currentIndex = (currentIndex - 1 + imageGroup.images.length) % imageGroup.images.length;
                renderImage();
            });

        // Close button
        buttonContainer.append("button")
            .text("Close")
            .style("padding", "10px 20px")
            .style("background-color", "red")
            .style("color", "white")
            .style("border", "none")
            .style("cursor", "pointer")
            .style("border-radius", "5px")
            .on("click", () => {
                d3.select(".lightbox").remove();
            });

        // Next button
        buttonContainer.append("button")
            .text("Next")
            .style("padding", "10px 20px")
            .style("background-color", "#555")
            .style("color", "white")
            .style("border", "none")
            .style("cursor", "pointer")
            .style("border-radius", "5px")
            .on("click", () => {
                currentIndex = (currentIndex + 1) % imageGroup.images.length;
                renderImage();
            });
    }

    renderImage();
}