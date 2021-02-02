var sel = d3.select('#selDataset');
var sel_value;

function getJSONData() {
    d3.json("Resources/data/samples.json").then(function (data) {

        getSubjectID(data.names);
        populateDemographic(data.metadata);
        showBarChart(data.samples);

    });
}

function getSubjectID(subData) {
    var subject_ids = subData;
    subject_ids.forEach(data => {
        sel.append("option").property("value", data).text(data);
        sel_value = sel.property("value");
        // console.log(data.samples)
    })
}

function populateDemographic(demoData) {

    var metadata = demoData;
    var demographic_area = d3.select("#sample-metadata").html("");
    var demo_data = metadata.filter(m => m.id == sel_value)
    Object.entries(demo_data[0]).forEach(([key, value]) => {
        demographic_area.append("p").text(`${key.toUpperCase()}: ${value}`)
    });
};

function showBarChart(sampleData) {
    var samplesData = sampleData.filter(data => data.id == sel_value)

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

function optionChanged() {

    getJSONData()
}
getJSONData()