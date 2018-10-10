# GoodWe API (oct 2018)

_This is a work in progress_

This node-based import script can be used to import data from the latest GoodWe API and upload it to PVOutput.org

## Environment
These variables should be set from environment-variables or can be passed using CLI-arguments
```
GOODWE_LOGIN_API=https://globalapi.sems.com.cn/api/v1/
GOODWE_API_URI=https://euapi.sems.com.cn/api/
GOODWE_API_VERION=v2.0.4
GOODWE_CLIENT_TYPE=ios
CACHE_ID=7c3c61277bd8b4aa5efd3a5c755e6db5
CACHE_FOLDER=./db
GOODWE_USERNAME=<your goodwe-username>
GOODWE_PASSWORD=<your goodwe-password>
```

## CLI args
```--list-powerstations``` prints a list of powerstations connected to your account

```--get-last-output``` prints the last PAC value, expects the station-id in --station-id <station-id> *unfinished*

```--sync [target]``` syncs output to targets (comma-separated). Currently only one target is supported (which is PVOutput.org). Each target has a set of configuration options which are checked before executing the sync.

```--dry-run``` uses mock data instead of real data and does not post to targets

## Targets

This tool is written to allow syncing of GoodWe-API-data to multiple targets. Currently PVOutput is the only target which is supported. Possibly more to come in the future:)

### PVOutput

Configuration options;

```--PVapiKey [key]``` the PVOutput API Key

```--PVSystemId [systemId]``` the PVOUtput systemID
