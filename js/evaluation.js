/**
 * all the custom
 * @author github/roest01
 */
jQuery(document).ready(function(){
    let colors = {
        orange: "rgba(255,190,142,0.5)",
        black: "rgba(90,90,90,1)",
        green: "rgba(143,181,178,0.8)"
    };
    if (appConfig.customTitle){
        jQuery('#title').html(appConfig.customTitle);
        window.document.title = appConfig.customTitle;
    }
    let data = {
        labels:[] ,
        datasets: [
            {
                name: 'ping',
                label: appConfig.datasets.ping.label,
                isMB: false,
                fill: false,
                backgroundColor: colors.black,
                borderColor: colors.black,
                tension: 0,
                hidden: appConfig.datasets.ping.hide,
            },
            {
                name: 'upload',
                label: appConfig.datasets.upload.label,
                isMB: true,
                fill: false,
                backgroundColor: colors.green,
                borderColor: colors.green,
                tension: 0,
                hidden: appConfig.datasets.upload.hide,
            },
            {
                name: 'download',
                label: appConfig.datasets.download.label,
                isMB: true,
                fill: true,
                backgroundColor: colors.orange,
                borderColor: colors.orange,
                tension: 0,
                hidden: appConfig.datasets.download.hide,
            }
        ]
    };


    let chartDom = jQuery("#speedChart").get(0).getContext("2d");
    let chartJS = new Chart(chartDom, {
        type: "line",
        data: data,
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(item, data){
                        if (data.datasets[item.datasetIndex].isMB){
                            return data.datasets[item.datasetIndex].label + ": "+ item.yLabel + ' MBits/s'
                        }
                        return data.datasets[item.datasetIndex].label + ": " + item.yLabel;
                    }
                }
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            responsive: true,
            multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %> <%if (datasetLabel != appConfig.datasets.ping.label){%>MBits/s<%}%>"
        }
    });


    let ParseManager = function(){
        let parseManager = this;
        parseManager.header = null;
        parseManager._startDate = null;
        parseManager._endDate = null;
        parseManager._chart = null;
        parseManager.i = 0;
        parseManager.uploadCount = 0;
        parseManager.downloadCount = 0;

        /**
         * parse result.csv and create graph with _startDate and _endDate filter
         */
        parseManager.parse = function(){
            let parseManager = this;
            parseManager.i = 0;

            Papa.parse("data/result.csv", {
                download: true,
                step: function(row) { //using stream to allow huge file progressing
                    parseManager.i++;
                    let dataArr = row.data[0];
                    if (!parseManager.header || parseManager.i === 1){
                        parseManager.header = dataArr;
                    } else {
                        //build csv array
                        let measureRow = [];
                        for (i = 0; i < dataArr.length; i++) {
                            measureRow[parseManager.header[i]] = dataArr[i];
                        }
                        measureRow['timestamp_s'] = parseInt(measureRow['timestamp'] / 1000); //from ms timestamp to secounds
                        measureRow['timestamp'] = parseInt(measureRow['timestamp']); //from save ms timestamp

                        if (!!parseManager._startDate && !!parseManager._endDate){
                            if (measureRow['timestamp_s'] < parseManager._startDate.unix() || measureRow['timestamp_s'] > parseManager._endDate.unix()){
                                //not in filter
                                return;
                            }
                        }

                        parseManager.addRow(measureRow);
                    }
                },
                complete: () => {
                    const chart = parseManager._chart;
                    const chartData = chart.config.data;
                    chartData.datasets.forEach((dataset, idx) => {
                        const { name, label } = dataset;
                        if(!['ping', 'upload', 'download'].includes(name)) {
                            return
                        }
                        dataset.min = Infinity;
                        dataset.max = 0;
                        dataset.sum = 0;
                        dataset.rollingAvg = [];

                        dataset.data.forEach((dp, index) => {
                            const datapoint = parseFloat(dp)
                            if(datapoint < dataset.min) {
                                dataset.min = datapoint
                            }

                            if (datapoint > dataset.max) {
                                dataset.max = datapoint
                            }

                            dataset.sum += datapoint

                            const ROLLING_DPS = 8
                            let sample = null
                            if (index - ROLLING_DPS < 0) {
                                sample = dataset.data.slice(index, ROLLING_DPS)
                            } else {
                                sample = dataset.data.slice(index - ROLLING_DPS, index)
                            }

                            const avg = sample.reduce((a,b) => a + parseFloat(b), 0) / sample.length
                            dataset.rollingAvg.push(avg.toFixed(2))
                        })

                        dataset.average = parseInt(dataset.sum / dataset.data.length)

                        const { average, isMB } = dataset;
                        
                        const data = dataset.data.map(() => average)

                        chartData.datasets[idx+3] = {
                            name: `${name} rolling avg`,
                            label: `${label} rolling avg`,
                            data: dataset.rollingAvg,
                            hidden: appConfig.datasets[name].hideRollingAvg,
                            borderColor: dataset.borderColor.replace('0.5', 1),
                            backgroundColor: dataset.backgroundColor.replace('0.5', 1),
                            fill: false,
                            type: 'line',
                            isMB
                        }

                        parseManager.updateStats(chartData.datasets)
                        chart.update()
                    })
                }
            });

            

        };

        parseManager.updateStats = (datasets) => {
            const div = document.getElementById('stats')
            let html = ''

            for(i=0; i<=2; i++) {
                const { label, min, max, average, isMB } = datasets[i]

                html += `<div style="margin: 20px;"><h4>${label}</h4>Min: ${min} ${isMB ? 'mbps' : 'ms' }<br /> Max: ${max} ${isMB ? 'mbps' : 'ms' }<br /> Avg: ${average} ${isMB ? 'mbps' : 'ms' }<br /></div>`
            }

            div.innerHTML = html
        }

        /**
         * add a row to chart
         *
         * @param measureRow
         */
        parseManager.addRow = function(measureRow){
            let chart = parseManager._chart;
            let chartData = chart.config.data;
            chartData.labels.push(this.getDateFromData(measureRow));

            if (parseFloat(measureRow['upload']) > parseFloat(measureRow['download'])){
                parseManager.uploadCount++;
            } else {
                parseManager.downloadCount++;
            }

            chartData.datasets[0].data.push(
                measureRow['ping']
            );
            chartData.datasets[1].data.push(
                measureRow['upload']
            );
            chartData.datasets[2].data.push(
                measureRow['download']
            );

            /**
             * graph has to be filled dynamically whether upload or download is higher. See issue #10
             */
            let total = parseManager.uploadCount + parseManager.downloadCount;
            let largerValue = 0;
            if (parseManager.uploadCount > parseManager.downloadCount){
                chartData.datasets[1].fill = "+1"; //fill upload till download line
                chartData.datasets[2].fill = "origin";
                largerValue = parseManager.uploadCount;
            } else {
                //upload lower than download -> priority for upload
                chartData.datasets[1].fill = "origin";
                chartData.datasets[2].fill = "-1"; //fill download starting @ upload line
                largerValue = parseManager.downloadCount;
            }

            let percentDominated = largerValue * 100 / total;
            if (percentDominated < 70){ //threshold
                //no fill for upload because more than 30% overlapping
                chartData.datasets[1].fill = false;
                chartData.datasets[2].fill = true;
            }


            parseManager._chart.config.data = chartData;
            chart.update();
        };

        parseManager.flushChart = function(force, callback){
            let parseManager = this;
            let chart = parseManager._chart;

            parseManager.uploadCount = 0;
            parseManager.downloadCount = 0;

            chart.data.labels = [];
            chart.data.datasets.forEach(function(dataSet){
                dataSet.data = [];
            });

            parseManager._chart.update();
            callback();
            return true;
        };


        parseManager.getDateFromData = function(measureRow){
            return moment(new Date(measureRow['timestamp'])).format('L - LT')
        };


        /**
         * set start date as filter
         *
         * @param startDate
         * @returns {ParseManager}
         */
        parseManager.setStartDate = function(startDate){
            parseManager._startDate = startDate;
            return parseManager;
        };

        /**
         * set end date as filter
         *
         * @param endDate
         * @returns {ParseManager}
         */
        parseManager.setEndDate = function(endDate){
            parseManager._endDate = endDate;
            return parseManager;
        };

       /**
         *
         * @param chart {*|e}
         * @returns {ParseManager}
         */
        this.setChart = function(chart){
            this._chart = chart;
            return this;
        };

        /**
         * set a new filter and update the graph
         *
         * @param startDate
         * @param endDate
         */
        this.update = function(startDate, endDate){
            let parseManager = this;
            parseManager._startDate = startDate;
            parseManager._endDate = endDate;

            parseManager.flushChart(true, function(){
                parseManager.parse();
            });
        };
    };

    let daterangeConfig = {
        locale: {
            format: appConfig.dateFormat
        },
        "autoApply": true,
        "opens": "left"
    };

    jQuery.extend(daterangeConfig, appConfig.daterange);

    //init application
    jQuery(document).ready(function(){
        let parseManager = new ParseManager();
        parseManager.setChart(chartJS);
        let dateRange = jQuery('input[name="daterange"]');
        dateRange.daterangepicker(
            daterangeConfig,
            function(start, end) {
                parseManager.update(start,end);
            });

        moment.locale(appConfig.locale);

        if (appConfig.daterange.startDate && appConfig.daterange.endDate){
            parseManager
                .setStartDate(appConfig.daterange.startDate)
                .setEndDate(appConfig.daterange.endDate);
        }
        parseManager.parse();

        jQuery('#startSpeedtest').click(function(){
            let buttonHelper = new ButtonHlpr(this);

            buttonHelper.loading();

            jQuery.get( "/run_speedtest", function( data ) {
                buttonHelper.reset();
                parseManager.flushChart(true, function(){
                    parseManager.parse();
                });
            });
        });
    });
});

let ButtonHlpr = function(btn){
    let button = jQuery(btn);
    this.loading = function(){
        button.html(button.data('loading-text'));
    };

    this.reset = function(){
        button.html(button.data('original-text'));
    };
};
