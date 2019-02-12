# Docker Speedtest Analyser

Automated docker speedtest analyser tool with included web interface to monitor your internet speed connection over time. Setup at home on your NAS (Synology, QNAP tested) and the container runs hourly speedtests. The speedtest results are displayed in an webinterface as line graph(s) over the day.

This tool was created in reference to [this reddit post](https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/).  
It used [speedtest-cli](https://github.com/sivel/speedtest-cli) to make speedtests and log them into a CSV file.  
After that you can visit the web interface to view a hourly - time filterable reports about
your internet connectivity speed.

# Screenshot
![Statistic Screenshot](https://github.com/roest01/docker-speedtest-analyser/raw/master/speedlogger_screenshot.png?raw=true)

# Docker Hub Image
You can get the publicly available docker image at the following location: [roest/docker-speedtest-analyser](https://hub.docker.com/r/roest/docker-speedtest-analyser/).


# Facts
1. The speedtest runs hourly per default
2. nginx is prepared but not configured for SSL yet
3. data is saved in a _.csv_ under ```/var/www/html/data/result.csv```
4. First speedtest will be executed in container build

# Installation
The SpeedTest analyser should to run out of the box with docker.

**Important:** To keep the history of speedtest within a rebuild of
the container please moint a volume in ``/var/www/html/data/``

### Setup:
1. Moint host volume onto ``/var/www/html/data/``
2. Map preferred host port on port _80_
3. Build container from image
4. Enjoy continious speed statistics after a while

# Environment variables
| Variable  | Type | Usage |  Example Value | Default |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| CRONJOB_ITERATION  | INT  | Time between speedtests in minutes. Value 15 means the cronjob runs every 15 minutes. Keep undefined to run hourly. | 15 | 60 |
| SPEEDTEST_PARAMS  | STRING  | append extra parameter for cli command.<br/> `speedtest-cli --simple $SPEEDTEST_PARAMS` <br/> Check [parameter documentation](https://github.com/sivel/speedtest-cli#usage)  | --mini https://speedtest.test.fr | none |

# Config
You can configure the visualization frontend via ``appConfig.js``
copy the ``/js/appConfig.example.js`` into ``/data/appConfig.js`` (where your volume should be mounted)


#### Libs used
1. Bootstrap 4 - alpha
2. Chart.js
3. daterangepicker.js
4. moment.js
5. papaparse
6. speedtest-cli

#### Licence
I kindly ask not to re-distribute this repo on hub.docker.com if it's not indispensable.

##### Disclaimer / Off topic
I've written this small tool for private use on my Synology NAS.  
The original twitter function is removed in this version.

If you want to contribute and report / fix bugs or bring the feature stuff written for your
own setup, don't be shy.

have fun and test your speeeeed :)
