#!/usr/bin/python3

# Script originally provided by AlekseyP
# https://www.reddit.com/r/technology/comments/43fi39/i_set_up_my_raspberry_pi_to_automatically_tweet/
# modifications by roest - https://github.com/roest01

import os
import csv
import datetime
import time
from speedtest import Speedtest, SpeedtestBestServerFailure, ConfigRetrievalError

#static values
CSV_FIELDNAMES=["timestamp", "ping", "download", "upload"]
FILEPATH = os.path.dirname(os.path.abspath(__file__)) + '/../data/result.csv'

def getIntEnv(varname, default):
        try:
                val = int(os.environ.get(varname, default))
        except ValueError:
                print('{}:{} should be an integer, defaulting to {}'.format(varname, os.environ.get(varname), default))
                val = default
        return val

def runSpeedtest():
        #run speedtest-cli
        print('--- running speedtest ---')

        #execute speedtest
        servers = []
        threads = 3

        result = {'ping': 0.0, 'download': 0.0, 'upload': 0.0}
        attempts = getIntEnv('RETRY_ATTEMPTS', 10)
        for i in range(max(1, attempts)):
                try:
                        s = Speedtest()
                except ConfigRetrievalError:
                        print('attempt {} of {} failed to get config, trying again'.format(i + 1, attempts))
                        continue
                s.get_servers(servers)
                try:
                        s.get_best_server()
                except SpeedtestBestServerFailure:
                        print('attempt {} of {} failed to get best server, trying again'.format(i + 1, attempts))
                        continue
                s.download(threads=threads)
                s.upload(threads=threads, pre_allocate=False)
                result = s.results.dict()
                break
        else:
                print('failed to get speeds, defaulting to 0.0')

        #collect speedtest data
        ping = round(result['ping'], 2)
        download = round(result['download'] / 1000 / 1000, 2)
        upload = round(result['upload'] / 1000 / 1000, 2)
        timestamp = round(time.time() * 1000, 3)

        csv_data_dict = {
                CSV_FIELDNAMES[0]: timestamp,
                CSV_FIELDNAMES[1]: ping,
                CSV_FIELDNAMES[2]: download,
                CSV_FIELDNAMES[3]: upload}

        #write testdata to file
        isFileEmpty = not os.path.isfile(FILEPATH) or os.stat(FILEPATH).st_size == 0

        with open(FILEPATH, "a") as f:
                csv_writer = csv.DictWriter(f, delimiter=',', lineterminator='\n', fieldnames=CSV_FIELDNAMES)
                if isFileEmpty:
                        csv_writer.writeheader()

                csv_writer.writerow(csv_data_dict)

        #print testdata
        print('--- Result ---')
        print("Timestamp: %s" %(timestamp))
        print("Ping: %d [ms]" %(ping))
        print("Download: %d [Mbit/s]" %(download))
        print("Upload: %d [Mbit/s]" %(upload))

if __name__ == '__main__':
        runSpeedtest()
        print('speedtest complete')
