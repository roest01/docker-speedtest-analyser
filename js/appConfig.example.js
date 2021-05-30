/**
 * To customize your settings:
 * 1. copy appConfig.example.js into /data/appConfig.js
 * 2. change "let appConfig = {" to "appConfig = {" in /data/appConfig.js
 * 3. restart the container if it is already running
 */
let appConfig = {
  "customTitle": "Statistics",
  "dateFormat": "DD.MM.YYYY",
  "locale": "de",
  "datasets": {
    "ping": {
      "label": "Ping",
      "hide": false,
      "hideRollingAvg": true
    },
    "upload": {
      "label": "Upload",
      "hide": false,
      "hideRollingAvg": true
    },
    "download": {
      "label": "Download",
      "hide": false,
      "hideRollingAvg": false
    }
  },
  "daterange": {
    "timePicker": true,
    "timePicker24Hour": true,
    "startDate": moment().startOf('day'),
    "endDate": moment().endOf('day'),
    ranges: {
      'Today': [moment().hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
      'Yesterday': [moment().hours(0).minutes(0).seconds(0).subtract(1, 'days'), moment().hours(23).minutes(59).seconds(59).subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }
};
