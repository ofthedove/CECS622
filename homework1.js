function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var data;
var options;
var chart;

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initializeChart);

function initializeDataTable() {
    data = new google.visualization.DataTable();
    data.addColumn('number', 'N');
    data.addColumn('number', 'Player A');
    data.addColumn('number', 'Player B');
}

function initializeChart() {
    initializeDataTable();

    options = {
        'title':'Average Winnings After N Games',
        legend: { position: 'bottom' }
    };

    chart = new google.visualization.LineChart(document.querySelector('[data-js-result-graph]'));
    chart.draw(data, options);
}

function updateChart() {
    chart.draw(data, options);
}

function roll(numDie, numSides) {
    var result = 0;
    for (; numDie > 0; numDie--) {
        result += Math.floor( (Math.random() * numSides) + 1 );
    }
    return result;
}

async function monteCarloGame(N, interval) {
    initializeDataTable();

    var PlayerATotal = 0;
    var PlayerBTotal = 0;

    var winTableA = [1, 2, 4, 8, 16, 0];
    var winTableB = [0, 0, 0, 0, 0, 32];

    var i;
    for (i = 0; i < N; i++) {
        var rollResult = roll(1, 6);
        PlayerATotal += winTableA[rollResult - 1];
        PlayerBTotal += winTableB[rollResult - 1];

        data.addRow([i, PlayerATotal, PlayerBTotal]);

        if (i % interval == 0) {
            updateChart();
            await sleep(50);
        }
    }
}