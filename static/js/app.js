// Global Variables for ID selection. Used for every graph
var sel = d3.select('#selDataset'); // Get Element
var sel_value; // Stage empty var

// Build data layer once. Each function retrieves data from here
function getJSONData() {
    d3.json("Resources/data/samples.json").then(function (data) {

        // Function calls returning data
        getSubjectID(data.names);
        populateDemographic(data.metadata);
        showBarChart(data.samples);
        showBubbleChart(data.samples);
        showguageChart(data.metadata);

    });
}
// Function to populate Subject ID dropdown with data {names} from sample json
function getSubjectID(subData) {
    var subject_ids = subData;
    subject_ids.forEach(data => {
        sel.append("option").property("value", data).text(data);
        sel_value = sel.property("value");
    })
}

// Function to populate demographic data
function populateDemographic(demoData) {
    var metadata = demoData;
    var demographic_area = d3.select("#sample-metadata").html(""); //Get html by ID
    var demo_data = metadata.filter(m => m.id == sel_value)// Retrieve data based on selection
    Object.entries(demo_data[0]).forEach(([key, value]) => {
        demographic_area.append("p").text(`${key.toUpperCase()}: ${value}`) // For Each item append to the html element for the demographic data
    });
};

// Display Bar Chart 
function showBarChart(sampleData) {
    var samplesData = sampleData.filter(data => data.id == sel_value);// Retrieve data based on selection

    // Create variables to store needed x/y values as well as labels
    var sample_values = samplesData[0].sample_values.slice(0, 10).reverse();
    var otu_ids = samplesData[0].otu_ids.slice(0, 10).reverse();
    otu_ids = otu_ids.map(d => "OTU " + d)
    var otu_Labels = samplesData[0].otu_labels.slice(0, 10).reverse();


    var trace = [{
        x: sample_values,
        y: otu_ids,
        text: otu_Labels,
        type: 'bar',
        orientation: 'h'
    }];
    var layout = {
        autosize: true,
        title: "Top 10 OTU",
        xaxis: { title: "Samples" },
        yaxis: { title: "OTU ID" },
    };
    Plotly.newPlot('bar', trace, layout)
};

function showBubbleChart(bubbleData) {
    var b_data = bubbleData.filter(data => data.id == sel_value);// Retrieve data based on selection

    var sample_values = b_data[0].sample_values;
    var otu_id = b_data[0].otu_ids;
    var otu_Labels = b_data[0].otu_labels;

    var trace = [{
        x: otu_id,
        y: sample_values,
        text: otu_Labels,
        mode: "markers",
        marker: {
            color: otu_id,
            size: sample_values
        }
    }];
    var layout = {
        showlegend: false,
        autosize: true,
        xaxis: {
            title: "OTU ID"
        }
    };
    Plotly.newPlot("bubble", trace, layout);
}


function showguageChart(gaugeData) {
    var gauge_data = gaugeData.filter(data => data.id == sel_value);// Retrieve data based on selection

    var wfreq = gauge_data[0].wfreq;
    var wfreq_labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '']

    var trace = [{
        type: "pie",
        showlegend: false,
        hole: 0.2,
        rotation: 90,
        values: [360 / 9, 360 / 9, 360 / 9, 360 / 9, 360 / 9, 360 / 9, 360 / 9, 360 / 9, 360 / 9, 360],
        text: wfreq_labels,
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        insidetextorientation: "radial",
        marker: {
            colors: ['#F8F3EC', '#F4F1E5', '#E9E6CA', '#E2E4B1', '#D5E49D', '#B7CC92', '#8CBF88', '#8ABB8F', '#85B48A', '#fff']
        },
        labels: wfreq_labels,
        hoverinfo: "label"
    }];


    var layout = {
        title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week',
        xaxis: { visible: false, range: [-1, 1] },
        yaxis: { visible: false, range: [-1, 1] }
    };


    Plotly.newPlot('gauge', trace, layout);

}

function optionChanged() {

    getJSONData()
}
getJSONData()