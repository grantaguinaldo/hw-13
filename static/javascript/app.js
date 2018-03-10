var dropDownData = d3.select("#selDataset")
var namesUrl = "/api/v1/names";
Plotly.d3.json(namesUrl, function(error, response) {
    if (error) return console.warn(error);

    for (var i = 0; i < response.length; i++){
        dropDownData
              .append('option')
              .attr('value', response[i])
              .text(response[i])
    }

});

function apiCallMetaData(endPoint){

    Plotly.d3.json(endPoint, function(error, response) {
    if (error) return console.warn(error);

    d3.select('#metaList').append('li').text('BB Type: ' + response[0]['BBTYPE'])
    d3.select('#metaList').append('li').text('Ethnicity: '+ response[0]['ETHNICITY'])
    d3.select('#metaList').append('li').text('Gender: ' + response[0]['GENDER'])
    d3.select('#metaList').append('li').text('Location: ' + response[0]['LOCATION'])
    d3.select('#metaList').append('li').text('Sample ID: ' + response[0]['SAMPLEID'])
    d3.select('#metaList').append('li').text('Age: ' + response[0]['age'])

    })
};


function graphPieData(response){

    var dataPie = [{
        values: response['sample_values'],
        labels: response['otu_ids'],
        type: 'pie'
    }];

    var layoutPie = {
        height: 500,
        width: 800
    };

    return Plotly.newPlot('pie', dataPie, layoutPie);
};


function graphBubbleData(response){
    sizeList = []
    for (var i = 0; i < response['sample_values'].length; i++){
        sizeList.push(0.3 * response['sample_values'][i])
    };

    var trace = {
        x: response['otu_ids'],
        y: response['sample_values'],
        mode: 'markers',
        marker: {
            size: sizeList
        }
    };

    var data = [trace];

    var layout = {
          title: 'Bubble Chart of the Bacteria Distrubution (all data)',
          showlegend: false,
          height: 400,
          width: 800
        };

    return Plotly.newPlot('bubble', data, layout);
};


function getData() {

        sampleValue = document.getElementById("selDataset").value;

        document.getElementById("metaList").innerHTML = ""

        var endPoint = '/api/v1/metadata/' + sampleValue.split('_')[1]
        apiCallMetaData(endPoint)

        var endPointSampleData = '/api/v1/samples/' + sampleValue
        Plotly.d3.json(endPointSampleData, function(error, response) {

            if (error) return console.warn(error);

            graphPieData(response)

        })

        var endPointSampleDataAll = '/api/v1/samplesall/' + sampleValue
        Plotly.d3.json(endPointSampleDataAll, function(error, response) {

            if (error) return console.warn(error);

            graphBubbleData(response)

        })


        var endPointWash = '/api/v1/wfreq/' + sampleValue.split('_')[1]
        Plotly.d3.json(endPointWash, function(error, response){

            if (error) return console.warn(error);

            gaugeChart(response)


    });

};

function gaugeChart(response){

    var level = response[0];

    console.log(level)

    var degrees = 9 - level,
         radius = .5;
    var radians = degrees * Math.PI / 9;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
         pathX = String(x),
         space = ' ',
         pathY = String(y),
         pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 28, color:'DB5F59'},
        showlegend: false,
        name: 'Belly Button Wash Frequency',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors: ['rgba(14, 127, 0, .5)',
                        'rgba(110, 154, 22, .5)',
                        'rgba(170, 202, 42, .5)',
                        'rgba(202, 209, 95, .5)',
                        'rgba(210, 206, 145, .5)',
                        'rgba(232, 226, 202, .5)',
                        'rgba(255, 255, 255, 0)',
                        'rgba(14, 127, 0, .5)',
                        'rgba(110, 154, 22, .5)',
                        'rgba(14, 127, 0, .5)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];


    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Wash Frequency',
      height: 600,
      width: 800,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]}
    };

    return Plotly.newPlot('gauge', data, layout);

}
