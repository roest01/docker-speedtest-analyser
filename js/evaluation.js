/**
 * all the custom
 * @author github/roest01
 */
jQuery(document).ready(function(){
    var data = {
        labels:[] ,
        datasets: [
            {
                label: appConfig.labels.download,
                fillColor: "rgba(255,190,142,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)"
            },
            {
                label: appConfig.labels.ping,
                fillColor: "rgba(2,2,1,0)",
                strokeColor: "rgba(2,2,1,1)",
                pointColor: "rgba(90,90,90,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)"
            },
            {
                label: appConfig.labels.upload,
                fillColor: "rgba(143,181,178,0.8)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)"
            }
        ]
    };


    var chartDom = jQuery("#speedChart").get(0).getContext("2d");
    var chartJS = new Chart(chartDom).Line(data, {
        responsive: true,
        bezierCurve: false,
        multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %> <%if (datasetLabel != appConfig.labels.ping){%>Mb/s<%}%>",
        maintainAspectRatio: false
    });


    var ParseManager = function(){
        this.header = null;
        this._startDate = null;
        this._endDate = null;
        this._chart = null;
        this.i = 0;

        /**
         * parse result.csv and create graph with _startDate and _endDate filter
         */
        this.parse = function(){
            var parseManager = this;
            parseManager.i = 0;

            Papa.parse("data/result.csv", {
                download: true,
                step: function(row) { //using stream to allow huge file progressing
                    parseManager.i++;
                    var dataArr = row.data[0];
                    if (!parseManager.header || parseManager.i == 1){
                        parseManager.header = dataArr;
                    } else {
                        //build csv array
                        var measureRow = [];
                        for (i = 0; i < dataArr.length; i++) {
                            measureRow[parseManager.header[i]] = dataArr[i];
                        }
                        measureRow['timestamp_s'] = parseInt(measureRow['timestamp'] / 1000); //from ms timestamp to secounds
                        measureRow['timestamp'] = parseInt(measureRow['timestamp']); //from save ms timestamp

                        if (parseManager._startDate != null && parseManager._endDate != null){
                            if (measureRow['timestamp_s'] < parseManager._startDate.unix() || measureRow['timestamp_s'] > parseManager._endDate.unix()){
                                //parseManager.removeRow(measureRow);
                                return;
                            }
                        }

                        parseManager.addRow(measureRow);
                    }
                }
            });
        };

        /**
         * add a row to chart
         *
         * @param measureRow
         */
        this.addRow = function(measureRow){
            this._chart.addData([
                measureRow['download'],
                measureRow['ping'],
                measureRow['upload']
            ], this.getDateFromData(measureRow));
        };

        this.flushChart = function(force, callback){
            var parseManager = this;
            var points = this._chart.datasets[0].points;

            for (i = 0; i <  points.length; i++) {
                var currentDatapointTime = moment(points[i]['label'], 'L - LT').unix();
                if (currentDatapointTime < parseManager._startDate.unix() || force){
                    setTimeout(function(){
                        parseManager._chart.removeData();

                        if (points.length == 0){
                            callback();
                        }
                    }, i*10); //timeout need by chart.js :(
                } else if (currentDatapointTime > parseManager._endDate.unix()) {
                    //@todo removeData with index is not supported by Chart.js
                    jQuery.each(this._chart.datasets, function(index, singleDataset){
                        //delete singleDataset.points[i]; <- this does not work
                        //parseManager._chart.update();

                        parseManager.flushChart(true);//dirty solution (not in use)
                    });
                    break;
                }
            }
        };


        this.getDateFromData = function(measureRow){
            return moment(new Date(measureRow['timestamp'])).format('L - LT')
        };


        /**
         * set start date as filter
         *
         * @param startDate
         * @returns {ParseManager}
         */
        this.setStartDate = function(startDate){
            this._startDate = startDate;
            return this;
        };

        /**
         * set end date as filter
         *
         * @param endDate
         * @returns {ParseManager}
         */
        this.setEndDate = function(endDate){
            this._endDate = endDate;
            return this;
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
            var parseManager = this;
            parseManager._startDate = startDate;
            parseManager._endDate = endDate;

            parseManager.flushChart(true, function(){
                parseManager.parse();
            });
        };
    };

    var daterangeConfig = {
        locale: {
            format: appConfig.dateFormat
        },
        "autoApply": true,
        "opens": "left"
    };

    jQuery.extend(daterangeConfig, appConfig.daterange);

    //init application

    var parseManager = new ParseManager();
    parseManager.setChart(chartJS);
    var dateRange = jQuery('input[name="daterange"]');
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
});