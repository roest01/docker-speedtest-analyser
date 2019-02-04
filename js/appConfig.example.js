/**
 * copy appConfig.example.js into /data/appConfig.js to change values
 */
let appConfig = {
  "customTitle": "Statistics",
  "dateFormat": "DD.MM.YYYY",
  "locale": "de",
  "labels": {
    "download": "Download",
    "ping": "Ping",
    "upload": "Upload"
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