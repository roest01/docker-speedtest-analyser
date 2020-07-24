#!/usr/bin/python

# Script originally provided by AlekseyP
# https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/
# modifications by roest - https://github.com/roest01

import os
import csv
import datetime
import time
import json

def runSpeedtest():

        #run speedtest-cli
        print('--- running speedtest ---')
        speedtestCommand= "speedtest-cli --json"
        if "SPEEDTEST_PARAMS" in os.environ:
            extraParams_= os.environ.get('SPEEDTEST_PARAMS')
            speedtestCommand= speedtestCommand + " " + extraParams_
            print('speedtest with extra parameter: ' + speedtestCommand)
        else:
            print('running with default server')

        a = os.popen(speedtestCommand).read()
        print('ran')

        ts = time.time()
        date =datetime.datetime.fromtimestamp(ts).strftime('%d.%m.%Y %H:%M:%S')
        print(date)
        #if speedtest could not connect set the speeds to 0
        if "Cannot" in a:
                p = 100
                d = 0
                u = 0
		isp = ''
		lat=0
		lon=0	
        #extract the values for ping down and up values
        else:
	        #Parse json output, load as dictionary                          
        	results_dict = json.loads(a)                                    

                p = round( results_dict['ping'] ,2)
                d = round( results_dict['download'] /1000.0 / 1000.0, 2)
                u = round( results_dict['upload'] /1000.0 / 1000.0, 2)
		isp = results_dict['client']['isp']
		lat = results_dict['client']['lat'] 
		lon = results_dict['client']['lon']

        print(date,p, d, u,isp,lat,lon)
        #save the data to file for local network plotting
        filepath = os.path.dirname(os.path.abspath(__file__))+'/../data/result.csv'
        fileExist = os.path.isfile(filepath)

        out_file = open(filepath, 'a')
        writer = csv.writer(out_file)

        if fileExist != True:
                out_file.write("timestamp,ping,download,upload,isp,lat,lon")
                out_file.write("\n")

        writer.writerow((ts*1000,p,d,u,isp,lat,lon))
        out_file.close()

        return

if __name__ == '__main__':
        runSpeedtest()
        print('speedtest complete')
