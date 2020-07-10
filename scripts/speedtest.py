#!/usr/bin/python

# Script originally provided by AlekseyP
# https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/
# modifications by roest - https://github.com/roest01

import os
import csv
import datetime
import time
import re

def runSpeedtest():

        #run speedtest-cli
        print('--- running speedtest ---')
        speedtestCommand= "speedtest-cli --simple"
        if "SPEEDTEST_PARAMS" in os.environ:
            extraParams_= os.environ.get('SPEEDTEST_PARAMS')
            speedtestCommand= speedtestCommand + " " + extraParams_
            print('speedtest with extra parameter: ' + speedtestCommand)
        else:
            print('running with default server')

        a = os.popen(speedtestCommand).read()
        print(a)
        try:
            p = re.search(r"Ping: (\d+\.\d*)", a).group(1)
            d = re.search(r"Download: (\d+\.\d*)", a).group(1)
            u = re.search(r"Upload: (\d+\.\d*)", a).group(1)
            print('ran')
         except AttributeError as e:
            # if speedtest could not connect set the speeds to 0
            print(e)
            p = 0
            d = 0
            u = 0

        ts = time.time()
        date = datetime.datetime.fromtimestamp(ts).strftime('%d.%m.%Y %H:%M:%S')
        print(date)
        print(date, p, d, u)

        #save the data to file for local network plotting
        filepath = os.path.dirname(os.path.abspath(__file__))+'/../data/result.csv'
        fileExist = os.path.isfile(filepath)

        out_file = open(filepath, 'a')
        writer = csv.writer(out_file)

        if fileExist != True:
                out_file.write("timestamp,ping,download,upload")
                out_file.write("\n")

        writer.writerow((ts*1000,p,d,u))
        out_file.close()

        return

if __name__ == '__main__':
        runSpeedtest()
        print('speedtest complete')
