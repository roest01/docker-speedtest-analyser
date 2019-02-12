#!/usr/bin/python

# Script originally provided by AlekseyP
# https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/
# modifications by roest - https://github.com/roest01

import os
import csv
import datetime
import time

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
        print('ran')
        #split the 3 line result (ping,down,up)
        lines = a.split('\n')
        print(a)
        ts = time.time()
        date =datetime.datetime.fromtimestamp(ts).strftime('%d.%m.%Y %H:%M:%S')
        print(date)
        #if speedtest could not connect set the speeds to 0
        if "Cannot" in a:
                p = 100
                d = 0
                u = 0
        #extract the values for ping down and up values
        else:
                p = lines[0][6:11]
                d = lines[1][10:14]
                u = lines[2][8:12]
        print(date,p, d, u)
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