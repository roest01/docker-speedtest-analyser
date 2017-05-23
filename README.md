# Docker Speedtest Analyser

automated tool and web interface to monitor your internet speed delivered in a docker container.
This tool was created in reference to [this reddit post](https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/).  
It used [speedtest-cli](https://github.com/sivel/speedtest-cli) to make speedtests and log them into a CSV file.  
After that you can visit the web interface to view a hourly - time filterable reports about
your internet connectivity speed.

# Screenshot
![Statistic Screenshot](/speedlogger_screenshot.png?raw=true)

# Facts
1. The speedtest runs hourly
2. No environment variables
3. nginx is prepared but not configured for SSL yet
4. data is saved in a _.csv_ under ```/var/www/html/data/result.csv```
5. First speedtest will be executed in container build

# Installation
The SpeedTest analyser should to run out of the box with docker.

**Important:** To keep the history of speedtest within a rebuild of
the container please moint a volume in ``/var/www/html/data/``

### Setup:
1. Moint host volume onto ``/var/www/html/data/``
2. Map preferred host port on port _80_
3. Build container from image
4. Enjoy continious speed statistics after a while

# Config
You can configure the visualization frontend via volume in
``/var/www/html/js/appConfig.js``


#### Libs used
1. Bootstrap 4 - alpha
2. Chart.js
3. daterangepicker.js
4. moment.js
5. papaparse
6. speedtest-cli

##### Disclaimer / Off topic
I've written this small tool for private use on my Synology NAS.  
The original twitter function is removed in this version.

If you want to contribute and report / fix bugs or bring the feature stuff written for your
own setup, don't be shy.

have fun and test your speeeeed :)
