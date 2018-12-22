# GoodWe API (oct 2018)

_This is a work in progress_

This node-based import script can be used to import data from the latest GoodWe API and upload it to PVOutput.org

## Prerequisites

- Linux or Mac. Windows might work, but I didn't test and honestly; I don't care 
- Shell access (and experience :)
- Node v8.9.0 or above
- NPM v5.8.0 or above

## Installation 

- Clone repo or download from releases-page
- `cd` into the downloaded/cloned folder
- run `npm i`
- Make `db`-folder writeable (easiest way; `chmod +w db/`)
- Setup environment (see "Environment")
- Transpile the code ; `npm run build`
- check if building succeeded
- link the cli-command; `npm link`

## Running

Currently this tool runs from commandline, usually from a cronjob. I have not looked into daemonizing it yet, it's on the backlog.

_These examples run assuming you setup the environment correctly_

_Get stations_:

``` 
semsSync --list-powerstations
```

_Print last output_:

``` 
semsSync --station-id [stationID] --get-last-output
```

_Sync_:

``` 
semsSync --station-id [stationID] --sync PVOutput 
```

## Environment
These variables should be set from environment-variables or can be passed using CLI-arguments
```
GOODWE_LOGIN_API=https://globalapi.sems.com.cn/api/v1/
GOODWE_API_URI=https://euapi.sems.com.cn/api/
GOODWE_USERNAME=[Goodwe username]
GOODWE_PASSWORD=[Goodwe pass]
GOODWE_API_VERION=v2.0.4
GOODWE_CLIENT_TYPE=ios
CACHE_ID=[insert random GUID here]
CACHE_FOLDER=./db
PVapiKey=[API Key From PVOutput.org]
PVSystemId=[SystemID from PVOutput.org]
```

## CLI args
```--list-powerstations``` prints a list of powerstations connected to your account

```--get-last-output``` prints the last PAC value, expects the station-id in --station-id <station-id> *unfinished*

```--sync [target]``` syncs output to targets (comma-separated). Currently only one target is supported (which is PVOutput.org). Each target has a set of configuration options which are checked before executing the sync.

```--dry-run``` uses mock data instead of real data and does not post to targets

```--log-to-file [filename]``` write log to file instead of console.

## Targets

This tool is written to allow syncing of GoodWe-API-data to multiple targets. Currently PVOutput is the only target which is supported. Possibly more to come in the future:)

### PVOutput

Configuration options;

```--PVapiKey [key]``` the PVOutput API Key

```--PVSystemId [systemId]``` the PVOUtput systemID


## Cronjob

1. Edit your crontab;

``` 
crontab -e 
```

2. Copy the contents of your env file to the top of the crontab
3. Paste the following at the end of your crontab, _this will run the semsSync task every 5 minutes_

```
*/5 * * * *  /[Path to]node /[path to the GoodWe package]/dist/index.js --sync PVOutput --station-id [station-ID you get from running semsSync --list-powerstations] 2>&1 | while read line; do echo `/bin/date` "$line" >> /[path to you log-directory]/semsSync.log; done
```

### Example

My Crontab looks like this _(I have NVM running, so node is probably in a different path from most stock setups)_:


```
GOODWE_LOGIN_API=https://globalapi.sems.com.cn/api/v1/
GOODWE_API_URI=https://euapi.sems.com.cn/api/
GOODWE_USERNAME= [xxxx]
GOODWE_PASSWORD= [xxxx]
GOODWE_API_VERION=v2.0.4
GOODWE_CLIENT_TYPE=ios
CACHE_ID=7c3c61277bd8b4aa5efd3a5c755e6db5
CACHE_FOLDER=./db
PVapiKey= [xxxx]
PVSystemId= [xxx]

*/5 * * * *  /root/.nvm/versions/node/v8.14.0/bin/node /root/goodwe-api/dist/index.js --sync PVOutput --station-id 5368e8a7-3966-4250-8c0d-0d90faad52eb 2>&1 | while read line; do echo `/bin/date` "$line" >> /var/log/semsSync.log; done

```

### View logs

To monitor the log, you can use `tail`:

```
tail -F /var/log/semsSync.log
```

# Changelog

`v0.3.0` 
 
 - Add colors to terminal output
 - Add option to write output to file
 
`v0.2.0` 
 
 - Added CLI-command (semsSync)
 - Fixed building with babel
 - Fixed expired logins

`v0.1.0` 

First draft-release. Should be able to sync if you set a cronjob to execute every x minutes, but still very alpha!

- Login flow SEMS GoodWe-API
- Retrieve list of powerstations from SEMS/GoodWe
- Retrieve PAC (output) of single powerstation from SEMS/GoodWe
- Post values to PVOutput.org

# Known issues
See [GitHub](https://github.com/buttonfreak/goodwe-api/issues)
