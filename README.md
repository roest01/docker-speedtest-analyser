# Speedtest Logger

automated tool and web interface to monitor your internet speed.  
This tool was created in reference to [this reddit post](https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/).  
It used [speedtest-cli](https://github.com/sivel/speedtest-cli) to make speedtests and log them into a CSV file.  
After that you can visit the web interface to view a hourly - time filterable reports about
your internet connectivity speed.

# Installation
I try to provide this tool to run out of the box.
Therefore it does not use bower, grunt or any other tool to keep the installation simple.

Clone the repo  
``
git clone https://github.com/roest01/speedlogger.git
``

make scripts executable  
``
chmod +x scripts/speedtest.py
chmod +x scripts/speedtest-cli/speedtest_cli.py
``

create cronjob on you machine running every hour  
``
0       *       *       *       *       root    /PATH_TO_DIR/scripts/speedtest.py >/dev/null 2>&1
``

# Config
You can configure the visualization frontend via js/appConfig.js


# Troubleshooting
I've setup the speedtest-cli module under scripts/ and checking in all the files
created with the setup progress of speedtest-cli/setup.py.

If the speedtest don't run with your machine clear scripts/speedtest-cli folder
and reinstall [speedtest-cli](https://github.com/sivel/speedtest-cli).
``
cd scripts
git clone https://github.com/sivel/speedtest-cli.git
cd speedtest-cli
python setup.py install
``

#Libs
1. bootstrap 4 - alpha
2. Chart.js
3. daterangepicker.js
4. moment.js
5. papaparse
6. speedtest-cli

#Disclaimer / Off topic
I've written this small tool for private use on my Synology NAS.  
The original twitter function is removed in this Version.  
I'm sure this tool has still some bugs and of course feature potential.  
The biggest problems in the interface where at updating the charts.js data points.  

If you want to contribute and report / fix bugs or bring the feature stuff written for your
own setup, don't be shy.

have fun and test your speeeeed :)
