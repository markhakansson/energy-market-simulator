class ProsumerChart {
    constructor (elementId) {
        this.chart = new Chart($(elementId), {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: 'Production (Wh)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: []
                }]
            },

            // Configuration options go here
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 5,
                            minRotation: 0,
                            maxRotation: 0
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 8
                        }
                    }]
                }
            }
        });
    }

    addData (data, label) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });

        if (this.chart.data.labels.length > 24) { // 24 ticks = 1 day
            this.removeFirstLabel(this.chart.data);
            this.chart.data.datasets.forEach((dataset) => {
                this.removeFirstElement(dataset);
            })
        }

        this.chart.update();
    }

    removeFirstElement (dataset) {
        dataset.data.shift();
    }

    removeFirstLabel (data) {
        data.labels.shift();
    }
}

class MarketChart {
    constructor (elementId) {
        this.chart = new Chart($(elementId), {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: 'Demand (Wh)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: []
                }]
            },

            // Configuration options go here
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 5,
                            minRotation: 0,
                            maxRotation: 0
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 8
                        }
                    }]
                }
            }
        });
        // console.log(this.chart);
    }

    addData (data, label) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });

        if (this.chart.data.labels.length > 24) { // 24 ticks = 1 day
            this.removeFirstLabel(this.chart.data);
            this.chart.data.datasets.forEach((dataset) => {
                this.removeFirstElement(dataset);
            })
        }

        this.chart.update();
    }

    removeFirstElement (dataset) {
        dataset.data.shift();
    }

    removeFirstLabel (data) {
        data.labels.shift();
    }
}

